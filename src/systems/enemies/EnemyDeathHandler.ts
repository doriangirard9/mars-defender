import {Entity, ISystem} from "../../ecsModels.ts";
import EventManager from "../../managers/EventManager.ts";
import EntityManager from "../../managers/EntityManager.ts";
import {getEnemyData, IEnemy} from "../../models/models.ts";

// components
import Health from "../../components/core/Health.ts";
import Enemy from "../../components/Enemy.ts";
import Transform from "../../components/core/Transform.ts";
import LifeSpan from "../../components/core/LifeSpan.ts";
import * as PIXI from "pixi.js";
import Sprite from "../../components/core/Sprite.ts";
import SpriteBuilder from "../../managers/SpriteBuilder.ts";
import Vector2 from "../../utils/Vector2.ts";

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
        this.createLightningAnimation(entity);
        this.eventManager.notify("OnEnemyDeath");
        this.entityManager.removeEntity(entity);
    }

    OnNewEntity(entity: Entity): void {
        if (entity.hasComponents(["Enemy", "Health"])) {
            const healthComponent: Health = entity.getComponent("Health") as Health;
            const enemyComponent: Enemy = entity.getComponent("Enemy") as Enemy;
            const enemyData: IEnemy = getEnemyData(enemyComponent.type);

            healthComponent.onNoHealth.push((): void => {
                this.createEnemyDeathAnimation(entity);
                this.eventManager.notify("OnEnemyDeath");
                this.entityManager.removeEntity(entity);
                this.eventManager.notify("OnUpdateGold", enemyData.reward);
            });
        }
    }

    createEnemyDeathAnimation(enemy: Entity): void {
        const enemyTransformComponent: Transform = enemy.getComponent("Transform") as Transform;

        const animation: Entity = new Entity();
        animation.addComponent(new Transform(animation, enemyTransformComponent.position));
        animation.addComponent(new LifeSpan(animation, 500));
        let frames: string[] = [];
        for (let i: number = 1; i < 16; i++) {
            frames.push(`img/animations/explosion/i_00${i}.png`);
        }
        let animationSprite: PIXI.AnimatedSprite = PIXI.AnimatedSprite.fromFrames(frames);
        animationSprite.animationSpeed = 0.5;
        const sprite: Sprite = new SpriteBuilder()
            .addSprite(animationSprite)
            .addEntity(animation)
            .addAnchor(new Vector2(0.5, 0.5))
            .addScale(new Vector2(0.15, 0.15))
            .build();
        animation.addComponent(sprite);
        this.entityManager.addEntity(animation);
        animationSprite.play();
    }

    createLightningAnimation(enemy: Entity): void {
        const enemyTransformComponent: Transform = enemy.getComponent("Transform") as Transform;

        const animation: Entity = new Entity();
        animation.addComponent(new Transform(animation, enemyTransformComponent.position));
        animation.addComponent(new LifeSpan(animation, 1500));
        let frames: string[] = [];
        for (let i: number = 0; i < 18; i++) {
            frames.push(`img/animations/lightning/${i}.png`);
        }
        let animationSprite: PIXI.AnimatedSprite = PIXI.AnimatedSprite.fromFrames(frames);
        animationSprite.animationSpeed = 0.3;
        const sprite: Sprite = new SpriteBuilder()
            .addSprite(animationSprite)
            .addEntity(animation)
            .addAnchor(new Vector2(0.5, 0.5))
            .addScale(new Vector2(0.3, 0.3))
            .build();
        animation.addComponent(sprite);
        this.entityManager.addEntity(animation);
        animationSprite.play();
    }

    update(deltaTime: number): void {}
}