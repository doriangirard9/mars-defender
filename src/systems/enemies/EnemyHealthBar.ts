import {Entity, ISystem} from "../../ecsModels.ts";
import EventManager from "../../managers/EventManager.ts";
import EntityManager from "../../managers/EntityManager.ts";

// components
import Parent from "../../components/core/Parent.ts";
import Tag from "../../components/core/Tag.ts";
import Sprite from "../../components/core/Sprite.ts";
import Health from "../../components/core/Health.ts";

export default class EnemyHealthBar implements ISystem {
    eventManager: EventManager;
    entityManager: EntityManager;

    constructor() {
        this.eventManager = EventManager.getInstance();
        this.entityManager = EntityManager.getInstance();
        this.subscribeToEvents();
    }

    subscribeToEvents(): void {
        this.eventManager.subscribe("OnNewEntity", this.OnNewEntity.bind(this));
    }

    OnNewEntity(entity: Entity): void {
        if (!entity.hasComponents(["Tag", "Sprite", "Parent"])) {
            return;
        }

        const tagComponent: Tag = entity.getComponent("Tag") as Tag;
        if (tagComponent.tag !== "enemyHealthBar") {
            return;
        }

        const spriteComponent: Sprite = entity.getComponent("Sprite") as Sprite;
        const parentComponent: Parent = entity.getComponent("Parent") as Parent;

        const parentHealthComponent: Health = parentComponent.parent.getComponent("Health") as Health;
        parentHealthComponent.onNewHealth.push((): void => {
            this.updateHealthBar(spriteComponent, parentHealthComponent);
        });
    }
    update(deltaTime: number): void {}

    updateHealthBar(spriteComponent: Sprite, healthComponent: Health): void {
        let healthPercentage: number = healthComponent.health / healthComponent.maxHealth;
        // healthPercentage *= 0.3;
        // healthPercentage = Math.max(0.7, healthPercentage + 0.7);
        spriteComponent.scale.x = healthPercentage * 0.05;
    }
}