import {Entity, ISystem} from "../../ecsModels.ts";
import EventManager from "../../managers/EventManager.ts";
import EntityManager from "../../managers/EntityManager.ts";

// components
import Text from "../../components/core/Text.ts";
import Tag from "../../components/core/Tag.ts";
import Health from "../../components/core/Health.ts";

export default class GameHealthHandler implements ISystem {
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
        if (!entity.hasComponents(["Tag", "Text", "Health"])) {
            return;
        }

        const tagComponent: Tag = entity.getComponent("Tag") as Tag;
        if (tagComponent.tag !== "gameHealth") {
            return;
        }

        const healthComponent: Health = entity.getComponent("Health") as Health;
        const textComponent: Text = entity.getComponent("Text") as Text;

        textComponent.value.text = healthComponent.health;

        healthComponent.onNewHealth.push((): void => {
            this.updateHealthText(textComponent, healthComponent);
        });

        healthComponent.onNoHealth.push((): void => {
            this.eventManager.notify("OnGameOver");
        });
    }

    updateHealthText(textComponent: Text, healthComponent: Health): void {
        textComponent.value.text = healthComponent.health;
    }

    update(deltaTime: number): void {}
}