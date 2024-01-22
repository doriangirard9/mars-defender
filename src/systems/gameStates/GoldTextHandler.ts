import {Entity, ISystem} from "../../ecsModels.ts";
import EventManager from "../../managers/EventManager.ts";
import EntityManager from "../../managers/EntityManager.ts";

// components
import GameStates from "../../components/singletons/GameStates.ts";
import Text from "../../components/core/Text.ts";
import Tag from "../../components/core/Tag.ts";

export default class GoldTextHandler implements ISystem {
    eventManager: EventManager;
    entityManager: EntityManager;

    constructor() {
        this.eventManager = EventManager.getInstance();
        this.entityManager = EntityManager.getInstance();
        this.subscribeToEvents();
    }

    subscribeToEvents(): void {
        this.eventManager.subscribe("OnNewEntity", this.OnNewEntity.bind(this));
        this.eventManager.subscribe("OnUpdateGold", this.OnUpdateGold.bind(this));
    }

    OnNewEntity(entity: Entity): void {
        if (!entity.hasComponents(["Tag", "Text"])) {
            return;
        }

        const tagComponent: Tag = entity.getComponent("Tag") as Tag;
        if (tagComponent.tag !== "goldText") {
            return;
        }

        const gameStatesComponent: GameStates = GameStates.getInstance();
        const textComponent: Text = entity.getComponent("Text") as Text;

        textComponent.value.text = gameStatesComponent.golds;
    }

    OnUpdateGold(amount: number): void {
        const gameStatesComponent: GameStates = GameStates.getInstance();
        gameStatesComponent.golds += amount;

        // update gold text
        const entities: Entity[] = this.entityManager.getEntitiesWithComponents(["Tag", "Text"]);
        entities.forEach((entity: Entity): void => {
            const tagComponent: Tag = entity.getComponent("Tag") as Tag;
            if (tagComponent.tag !== "goldText") {
                return;
            }

            const textComponent: Text = entity.getComponent("Text") as Text;
            textComponent.value.text = gameStatesComponent.golds;
        });
    }

    update(deltaTime: number): void {}
}