import {Entity, ISystem} from "../../ecsModels.ts";
import Game from "../../Game.ts";

// components
import Sprite from "../../components/core/Sprite.ts";
import Drag from "../../components/core/Drag.ts";

export default class DragHandler implements ISystem {
    game: Game;

    constructor() {
        this.game = Game.getInstance();
        this.subscribeToEvents();
    }

    subscribeToEvents(): void {
        this.game.eventManager.subscribe("OnNewEntity", this.OnNewEntity.bind(this));
    }

    OnNewEntity(entity: Entity): void {
        if (this.checkComponents(entity)) {
            const spriteComponent: Sprite = entity.getComponent("Sprite") as Sprite;
            const dragComponent: Drag = entity.getComponent("Drag") as Drag;

            spriteComponent.sprite.eventMode = "static";
            spriteComponent.sprite.cursor = 'pointer';

            spriteComponent.sprite.on('pointerdown', (): void => {
                dragComponent.isDragged = true;
            });

            spriteComponent.sprite.on('pointerup', (): void => {
                dragComponent.isDragged = false;
            });

            spriteComponent.sprite.on('pointerupoutside', (): void => {
                dragComponent.isDragged = false;
            });

            spriteComponent.sprite.on('globalpointermove', (event: any): void => {
                if (dragComponent.isDragged) {
                    dragComponent.movement.x += event.data.originalEvent.movementX;
                    dragComponent.movement.y += event.data.originalEvent.movementY;
                }
            });
        }
    }

    update(deltaTime: number): void {}

    checkComponents(entity: Entity): boolean {
        return entity.hasComponent("Drag")
            && entity.hasComponent("Sprite")
            && entity.hasComponent("Transform");
    }
}