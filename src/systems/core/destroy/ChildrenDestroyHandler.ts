import {Entity, IComponent, ISystem} from "../../../ecsModels.ts";
import EventManager from "../../../managers/EventManager.ts";
import EntityManager from "../../../managers/EntityManager.ts";

// components
import Children from "../../../components/core/Children.ts";

export default class SpriteDestroyHandler implements ISystem {
    eventManager: EventManager;
    entityManager: EntityManager;

    constructor() {
        this.eventManager = EventManager.getInstance();
        this.entityManager = EntityManager.getInstance();
        this.subscribeToEvents();
    }

    subscribeToEvents(): void {
        this.eventManager.subscribe("OnRemoveComponent", this.removeComponent.bind(this));
    }

    removeComponent(entity: Entity, component: IComponent): void {
        if (component.name !== "Children") {
            return;
        }

        const childrenComponent: Children = component as Children;

        childrenComponent.children.forEach((child: Entity): void => {
            this.entityManager.removeEntity(child);
        });
    }

    update(deltaTime: number): void {}
}