import {Entity, ISystem} from "../../ecsModels.ts";
import EventManager from "../../managers/EventManager.ts";
import EntityManager from "../../managers/EntityManager.ts";

// components
import Text from "../../components/core/Text.ts";
import Tag from "../../components/core/Tag.ts";

export default class WaveTextHandler implements ISystem {
    eventManager: EventManager;
    entityManager: EntityManager;

    constructor() {
        this.eventManager = EventManager.getInstance();
        this.entityManager = EntityManager.getInstance();
        this.subscribeToEvents();
    }

    subscribeToEvents(): void {
        this.eventManager.subscribe("OnUpdateWaveText", this.updateText.bind(this));
    }

    updateText(text: string): void {
        const entities: Entity[] = this.entityManager.getEntitiesWithComponents(["Tag", "Text"]);

        entities.forEach((entity: Entity): void => {
            const tag: Tag = entity.getComponent("Tag") as Tag;

            if (tag.tag !== "waveText") {
                return;
            }

            const textComponent: Text = entity.getComponent("Text") as Text;
            textComponent.value.text = text;
        });
    }

    update(deltaTime: number): void {}
}