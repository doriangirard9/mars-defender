import {Entity, ISystem} from "../../ecsModels.ts";
import EventManager from "../../managers/EventManager.ts";

// components
import Sprite from "../../components/core/Sprite.ts";
import Hover from "../../components/core/Hover.ts";

export default class HoverHandler implements ISystem {
    eventManager: EventManager;

    constructor() {
        this.eventManager = EventManager.getInstance();
        this.subscribeToEvents();
    }

    subscribeToEvents(): void {
        this.eventManager.subscribe("OnNewEntity", this.OnNewEntity.bind(this));
    }

    OnNewEntity(entity: Entity): void {
        if (entity.hasComponents(["Hover", "Sprite"])) {
            const spriteComponent: Sprite = entity.getComponent("Sprite") as Sprite;
            const hoverComponent: Hover = entity.getComponent("Hover") as Hover;

            spriteComponent.sprite.eventMode = "static";
            spriteComponent.sprite.cursor = 'pointer';

            spriteComponent.sprite.on('pointerenter', (): void => {
                if (!hoverComponent.isEnable) {
                    return;
                }
                hoverComponent.onPointerEnter.forEach((listener: Function): void => {
                    listener();
                });
            });

            spriteComponent.sprite.on('pointerleave', (): void => {
                if (!hoverComponent.isEnable) {
                    return;
                }
                hoverComponent.onPointerLeave.forEach((listener: Function): void => {
                    listener();
                });
            });
        }
    }

    update(deltaTime: number): void {}
}