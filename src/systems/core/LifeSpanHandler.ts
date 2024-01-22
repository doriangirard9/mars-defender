import {Entity, ISystem} from "../../ecsModels.ts";
import EventManager from "../../managers/EventManager.ts";
import EntityManager from "../../managers/EntityManager.ts";

// components
import LifeSpan from "../../components/core/LifeSpan.ts";

export default class LifeSpanHandler implements ISystem {
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
        if (!entity.hasComponents(["LifeSpan"])) {
            return;
        }

        const lifeSpanComponent: LifeSpan = entity.getComponent("LifeSpan") as LifeSpan;

        setTimeout((): void => {
            this.entityManager.removeEntity(entity);
        }, lifeSpanComponent.value);
    }

    update(deltaTime: number): void {}
}