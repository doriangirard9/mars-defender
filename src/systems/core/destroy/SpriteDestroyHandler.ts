import {Entity, IComponent, ISystem} from "../../../ecsModels.ts";
import EventManager from "../../../managers/EventManager.ts";
import Sprite from "../../../components/core/Sprite.ts";

export default class SpriteDestroyHandler implements ISystem {
    eventManager: EventManager;

    constructor() {
        this.eventManager = EventManager.getInstance();
        this.subscribeToEvents();
    }

    subscribeToEvents(): void {
        this.eventManager.subscribe("OnRemoveComponent", this.removeComponent.bind(this));
    }

    removeComponent(entity: Entity, component: IComponent): void {
        if (component.name !== "Sprite") {
            return;
        }

        const spriteComponent: Sprite = component as Sprite;

        spriteComponent.sprite.destroy();
    }

    update(deltaTime: number): void {}
}