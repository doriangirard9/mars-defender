import {Entity, ISystem} from "../../ecsModels.ts";
import EventManager from "../../managers/EventManager.ts";
import EntityManager from "../../managers/EntityManager.ts";
import {getEnemyData, IEnemy} from "../../models/models.ts";

// components
import Health from "../../components/core/Health.ts";
import Enemy from "../../components/Enemy.ts";

export default class EnemyDeathHandler implements ISystem {
    eventManager: EventManager;
    entityManager: EntityManager;

    constructor() {
        this.entityManager = EntityManager.getInstance();
        this.eventManager = EventManager.getInstance();
        this.subscribeToEvents();
    }

    subscribeToEvents(): void {
        this.eventManager.subscribe("OnNewEntity", this.OnNewEntity.bind(this));
        this.eventManager.subscribe("OnEnemyHitBase", this.OnEnemyHitBase.bind(this));
    }

    OnEnemyHitBase(entity: Entity): void {
        this.eventManager.notify("OnEnemyDeath");
        this.entityManager.removeEntity(entity);
    }

    OnNewEntity(entity: Entity): void {
        if (entity.hasComponents(["Enemy", "Health"])) {
            const healthComponent: Health = entity.getComponent("Health") as Health;
            const enemyComponent: Enemy = entity.getComponent("Enemy") as Enemy;
            const enemyData: IEnemy = getEnemyData(enemyComponent.type);

            healthComponent.onNoHealth.push((): void => {
                this.eventManager.notify("OnEnemyDeath");
                this.entityManager.removeEntity(entity);
                this.eventManager.notify("OnUpdateGold", enemyData.reward);
            });
        }
    }

    update(deltaTime: number): void {}
}