import {Entity, ISystem} from "../../ecsModels.ts";

// components
import Sprite from "../../components/core/Sprite.ts";
import Drag from "../../components/core/Drag.ts";
import EventManager from "../../managers/EventManager.ts";

export default class DragHandler implements ISystem {
    eventManager: EventManager;

    constructor() {
        this.eventManager = EventManager.getInstance();
        this.subscribeToEvents();
    }

    subscribeToEvents(): void {
        this.eventManager.subscribe("OnNewEntity", this.OnNewEntity.bind(this));
    }

    OnNewEntity(entity: Entity): void {
        if (entity.hasComponents(["Drag", "Sprite"])) {
            const spriteComponent: Sprite = entity.getComponent("Sprite") as Sprite;
            const dragComponent: Drag = entity.getComponent("Drag") as Drag;

            spriteComponent.sprite.eventMode = "static";
            spriteComponent.sprite.cursor = 'pointer';

            spriteComponent.sprite.on('pointerdown', (): void => {
                if (!dragComponent.isEnable) {
                    return;
                }
                dragComponent.isDragged = true;
            });

            spriteComponent.sprite.on('pointerup', (): void => {
                if (!dragComponent.isEnable) {
                    return;
                }
                dragComponent.onPointerUp.forEach((listener: Function): void => {
                    listener();
                });
                dragComponent.isDragged = false;
            });

            spriteComponent.sprite.on('pointerupoutside', (): void => {
                if (!dragComponent.isEnable) {
                    return;
                }
                dragComponent.onPointerUp.forEach((listener: Function): void => {
                    listener();
                });
                dragComponent.isDragged = false;
            });

            spriteComponent.sprite.on('globalpointermove', (event: any): void => {
                if (!dragComponent.isDragged || !dragComponent.isEnable) {
                    return;
                }
                dragComponent.onPointerMove.forEach((listener: Function): void => {
                    listener(event);
                });
            });
        }
    }

    update(deltaTime: number): void {}
}