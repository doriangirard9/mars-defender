import {Entity, ISystem} from "../../ecsModels.ts";
import EventManager from "../../EventManager.ts";

// components
import Sprite from "../../components/core/Sprite.ts";
import Click from "../../components/core/Click.ts";

export default class ClickHandler implements ISystem {
    eventManager: EventManager;

    constructor() {
        this.eventManager = EventManager.getInstance();
        this.subscribeToEvents();
    }

    subscribeToEvents(): void {
        this.eventManager.subscribe("OnNewEntity", this.OnNewEntity.bind(this));
    }

    OnNewEntity(entity: Entity): void {
        if (entity.hasComponents(["Click", "Sprite"])) {
            const spriteComponent: Sprite = entity.getComponent("Sprite") as Sprite;
            const clickComponent: Click = entity.getComponent("Click") as Click;

            spriteComponent.sprite.eventMode = "static";
            spriteComponent.sprite.cursor = 'pointer';

            spriteComponent.sprite.on('pointerdown', (): void => {
                clickComponent.onPointerDown.forEach((listener: Function): void => {
                    listener();
                });
            });

            spriteComponent.sprite.on('pointerup', (): void => {
                clickComponent.onPointerUp.forEach((listener: Function): void => {
                    listener();
                });
            });
        }
    }

    update(deltaTime: number): void {}
}