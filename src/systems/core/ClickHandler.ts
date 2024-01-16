import {Entity, ISystem} from "../../ecsModels.ts";
import Game from "../../Game.ts";

// components
import Sprite from "../../components/core/Sprite.ts";
import Click from "../../components/core/Click.ts";

export default class ClickHandler implements ISystem {
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
            const clickComponent: Click = entity.getComponent("Click") as Click;

            spriteComponent.sprite.eventMode = "static";
            spriteComponent.sprite.cursor = 'pointer';

            spriteComponent.sprite.on('pointerdown', (): void => {
                clickComponent.isClicked = true;
            });

            spriteComponent.sprite.on('pointerup', (): void => {
                clickComponent.isClicked = false;
            });

            spriteComponent.sprite.on('pointerupoutside', (): void => {
                clickComponent.isClicked = false;
            });
        }
    }

    update(deltaTime: number): void {}

    checkComponents(entity: Entity): boolean {
        return entity.hasComponent("Click") && entity.hasComponent("Sprite");
    }
}