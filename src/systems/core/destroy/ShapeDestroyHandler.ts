import {Entity, IComponent, ISystem} from "../../../ecsModels.ts";
import EventManager from "../../../managers/EventManager.ts";
import Shape from "../../../components/core/Shape.ts";

export default class ShapeDestroyHandler implements ISystem {
    eventManager: EventManager;

    constructor() {
        this.eventManager = EventManager.getInstance();
        this.subscribeToEvents();
    }

    subscribeToEvents(): void {
        this.eventManager.subscribe("OnRemoveComponent", this.removeComponent.bind(this));
    }

    removeComponent(entity: Entity, component: IComponent): void {
        if (component.name !== "Shape") {
            return;
        }

        const shapeComponent: Shape = component as Shape;

        shapeComponent.shape.destroy();
    }

    update(deltaTime: number): void {}
}