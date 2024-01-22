import {Entity, ISystem} from "../../ecsModels.ts";
import EntityManager from "../../managers/EntityManager.ts";
import Vector2 from "../../utils/Vector2.ts";
import {shortestPath} from "../../utils/shortestPath.ts";
import EventManager from "../../managers/EventManager.ts";
import {getEnemyData} from "../../models/models.ts";

// components
import Transform from "../../components/core/Transform.ts";
import GameStates from "../../components/singletons/GameStates.ts";
import Enemy from "../../components/Enemy.ts";
import Tag from "../../components/core/Tag.ts";
import Health from "../../components/core/Health.ts";
import Sprite from "../../components/core/Sprite.ts";
import {IEnemy} from "../../models/models.ts";

export default class EnemyMovementHandler implements ISystem {
    entityManager: EntityManager;
    eventManager: EventManager;

    constructor() {
        this.entityManager = EntityManager.getInstance();
        this.eventManager = EventManager.getInstance();
        this.subscribeToEvents();
    }

    subscribeToEvents(): void {
        this.eventManager.subscribe("OnNewEntity", this.OnNewEntity.bind(this));
    }

    OnNewEntity(entity: Entity): void {
        if (entity.hasComponents(["Enemy", "Transform"])) {
            const enemyComponent: Enemy = entity.getComponent("Enemy") as Enemy;
            const gameStatesComponent: GameStates = GameStates.getInstance();
            enemyComponent.path = shortestPath(gameStatesComponent.grid, enemyComponent.spawn, gameStatesComponent.base);
        }
    }

    update(deltaTime: number): void {
        const entities: Entity[] = this.entityManager.getEntitiesWithComponents(["Enemy", "Transform", "Sprite"]);
        const gameStatesComponent: GameStates = GameStates.getInstance();

        entities.forEach((entity: Entity): void => {
            const enemyComponent: Enemy = entity.getComponent("Enemy") as Enemy;
            const transformComponent: Transform = entity.getComponent("Transform") as Transform;
            const spriteComponent: Sprite = entity.getComponent("Sprite") as Sprite;
            const enemyData: IEnemy = getEnemyData(enemyComponent.type);

            if (enemyComponent.path.length > 0) {
                const nextPosition: Vector2 = enemyComponent.path[0];

                const nextPositionWorld: Vector2 = new Vector2(
                    nextPosition.y * gameStatesComponent.tileSize + gameStatesComponent.tileSize / 2,
                    nextPosition.x * gameStatesComponent.tileSize + gameStatesComponent.tileSize / 2
                );

                const direction: Vector2 = nextPositionWorld.sub(transformComponent.position).normalize();

                if (direction.x < 0) {
                    spriteComponent.sprite.scale.x *= -1;
                }

                const speed: Vector2 = new Vector2(enemyData.speed * deltaTime, enemyData.speed * deltaTime);

                transformComponent.position = transformComponent.position.add(direction.mult(speed));

                if (transformComponent.position.dist(nextPositionWorld) < 1) {
                    enemyComponent.path.shift();
                }
            }
            else {
                this.eventManager.notify("OnEnemyHitBase", entity);
                this.hitBase(enemyData.damage);
            }
        });
    }

    hitBase(damage: number): void {
        const entities: Entity[] = this.entityManager.getEntitiesWithComponents(["Health", "Tag", "Text"]);

        entities.forEach((entity: Entity): void => {
            const tagComponent: Tag = entity.getComponent("Tag") as Tag;
            if (tagComponent.tag !== "gameHealth") {
                return;
            }

            const healthComponent: Health = entity.getComponent("Health") as Health;
            this.eventManager.notify("OnUpdateHealth", healthComponent, -damage);
        });
    }
}