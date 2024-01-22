import {Entity, ISystem} from "../../ecsModels.ts";
import EntityManager from "../../managers/EntityManager.ts";
import Vector2 from "../../utils/Vector2.ts";
import EventManager from "../../managers/EventManager.ts";
import * as PIXI from "pixi.js";
import {getDefenseData, IDefense} from "../../models/models.ts";
import SpriteBuilder from "../../managers/SpriteBuilder.ts";

// components
import Transform from "../../components/core/Transform.ts";
import Defense from "../../components/Defense.ts";
import Health from "../../components/core/Health.ts";
import Shape from "../../components/core/Shape.ts";
import LifeSpan from "../../components/core/LifeSpan.ts";
import Sprite from "../../components/core/Sprite.ts";

export default class ShootingHandler implements ISystem {
    entityManager: EntityManager;
    eventManager: EventManager;

    constructor() {
        this.entityManager = EntityManager.getInstance();
        this.eventManager = EventManager.getInstance();
    }

    update(deltaTime: number): void {
        const defenses: Entity[] = this.entityManager.getEntitiesWithComponents(["Defense", "Transform"]);

        defenses.forEach((entity: Entity): void => {
            const defenseComponent: Defense = entity.getComponent("Defense") as Defense;
            const transformComponent: Transform = entity.getComponent("Transform") as Transform;
            const defenseData: IDefense = getDefenseData(defenseComponent.type);

            if (!defenseComponent.isPlaced) {
                return;
            }

            const target: Entity | null = this.getTarget(defenseComponent, transformComponent, defenseData);

            if (!target) {
                defenseComponent.targetId = null;
                return;
            }

            defenseComponent.targetId = target.id;
            this.lookAt(target, transformComponent);
            this.shootTarget(defenseComponent, transformComponent, target, deltaTime, defenseData);
        });

    }

    getTarget(defenseComponent: Defense, defenseTransformComponent: Transform, defenseData: IDefense): Entity | null {
        if (defenseComponent.targetId) {
            const target: Entity | undefined = this.entityManager.getEntityById(defenseComponent.targetId);

            if (target && this.isInRange(defenseTransformComponent, target, defenseData.range)) {
                return target;
            }
        }

        let target: Entity | null = null;

        const enemies: Entity[] = this.entityManager.getEntitiesWithComponents(["Enemy", "Transform", "Health"]);

        for (let i: number = 0; i < enemies.length; i++) {
            if (this.isInRange(defenseTransformComponent, enemies[i], defenseData.range)) {
                target = enemies[i];
                break;
            }
        }

        return target;
    }

    isInRange(defenseTransformComponent: Transform, enemy: Entity, range: number): boolean {
        const enemyTransformComponent: Transform = enemy.getComponent("Transform") as Transform;

        const dist: number = defenseTransformComponent.position.dist(enemyTransformComponent.position);

        return dist < range;
    }

    lookAt(target: Entity, transform: Transform): void {
        const targetTransformComponent: Transform = target.getComponent("Transform") as Transform;

        const direction: Vector2 = targetTransformComponent.position.sub(transform.position).normalize();

        transform.rotation = Math.atan2(direction.y, direction.x);
    }

    shootTarget(defenseComponent: Defense, transformComponent: Transform, target: Entity, deltaTime: number, defenseData: IDefense): void {
        if (defenseComponent.shootCooldown <= 0) {
            defenseComponent.shootCooldown = defenseData.fireRate;

            const targetTransformComponent: Transform = target.getComponent("Transform") as Transform;

            const firePoint: Vector2 = new Vector2(
                transformComponent.position.x + (Math.cos(transformComponent.rotation) * defenseData.firePoint),
                transformComponent.position.y + (Math.sin(transformComponent.rotation) * defenseData.firePoint)
            );

            this.createBullet(firePoint, targetTransformComponent.position, defenseData);
            this.createMuzzleFlash(firePoint, transformComponent.rotation, defenseData);

            const healthComponent: Health = target.getComponent("Health") as Health;
            this.eventManager.notify("OnUpdateHealth", healthComponent, -defenseData.damage);
        }
        else {
            defenseComponent.shootCooldown -= deltaTime;
        }
    }

    createBullet(start: Vector2, end: Vector2, defenseData: IDefense): void {
        const bullet: Entity = new Entity();

        const bulletShape: PIXI.Graphics = new PIXI.Graphics();
        bulletShape.lineStyle(defenseData.laser.width, 0xFFFF00, 0.7);
        bulletShape.moveTo(start.x, start.y);
        bulletShape.lineTo(end.x, end.y);
        bulletShape.endFill();

        bullet.addComponent(new Shape(bullet, bulletShape));
        bullet.addComponent(new LifeSpan(bullet, 50));
        this.entityManager.addEntity(bullet);
    }

    createMuzzleFlash(position: Vector2, rotation: number, defenseData: IDefense): void {
        const muzzleFlash: Entity = new Entity();

        muzzleFlash.addComponent(new Transform(muzzleFlash, position, rotation));
        muzzleFlash.addComponent(new LifeSpan(muzzleFlash, 100));

        const muzzleFlashSprite: Sprite = new SpriteBuilder()
            .addSprite(PIXI.Sprite.from(defenseData.laser.muzzleFlash))
            .addEntity(muzzleFlash)
            .addAnchor(new Vector2(0.1, 0.5))
            .addScale(new Vector2(0.1, 0.1))
            .build();
        muzzleFlash.addComponent(muzzleFlashSprite);
        this.entityManager.addEntity(muzzleFlash);
    }
}