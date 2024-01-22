import {Entity, IComponent, ISystem} from "../../../ecsModels.ts";
import EventManager from "../../../managers/EventManager.ts";
import Text from "../../../components/core/Text.ts";

export default class TextDestroyHandler implements ISystem {
    eventManager: EventManager;

    constructor() {
        this.eventManager = EventManager.getInstance();
        this.subscribeToEvents();
    }

    subscribeToEvents(): void {
        this.eventManager.subscribe("OnRemoveComponent", this.removeComponent.bind(this));
    }

    removeComponent(entity: Entity, component: IComponent): void {
        if (component.name !== "Text") {
            return;
        }

        const textComponent: Text = component as Text;

        textComponent.value.destroy();
    }

    update(deltaTime: number): void {}
}