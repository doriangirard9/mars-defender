import {Entity, ISystem} from "../../ecsModels.ts";
import * as PIXI from "pixi.js";
import Game from "../../Game.ts";

// components
import Sprite from "../../components/core/Sprite.ts";
import Transform from "../../components/core/Transform.ts";

export default class SpriteRenderer implements ISystem {
    game: Game;
    app: PIXI.Application;

    constructor() {
        this.game = Game.getInstance();
        this.app = this.game.app;
        this.subscribeToEvents();
    }

    subscribeToEvents(): void {
        this.game.eventManager.subscribe("OnNewEntity", this.OnNewEntity.bind(this));
    }

    OnNewEntity(entity: Entity): void {
        if (this.checkComponents(entity)) {
            const spriteComponent: Sprite = entity.getComponent("Sprite") as Sprite;
            const transformComponent: Transform = entity.getComponent("Transform") as Transform;

            spriteComponent.sprite.anchor.set(0.5, 0.5);

            this.setSpritePosition(spriteComponent, transformComponent);
            this.setSpriteRotation(spriteComponent, transformComponent);
            this.setSpriteScale(spriteComponent, transformComponent);

            this.app.stage.addChild(spriteComponent.sprite);
        }
    }

    update(deltaTime: number): void {
        const entities: Entity[] = this.game.entities.filter((entity: Entity): boolean => {
            return this.checkComponents(entity);
        });

        // update all sprites
        entities.forEach((entity: Entity): void => {
            const spriteComponent: Sprite = entity.getComponent("Sprite") as Sprite;
            const transformComponent: Transform = entity.getComponent("Transform") as Transform;

            this.setSpritePosition(spriteComponent, transformComponent);
            this.setSpriteRotation(spriteComponent, transformComponent);
            this.setSpriteScale(spriteComponent, transformComponent);
        });
    }

    checkComponents(entity: Entity): boolean {
        return entity.hasComponent("Sprite") && entity.hasComponent("Transform");
    }

    setSpritePosition(spriteComponent: Sprite, transformComponent: Transform): void {
        spriteComponent.sprite.x = transformComponent.position.x;
        spriteComponent.sprite.y = transformComponent.position.y;
    }

    setSpriteRotation(spriteComponent: Sprite, transformComponent: Transform): void {
        spriteComponent.sprite.rotation = transformComponent.rotation;
    }

    setSpriteScale(spriteComponent: Sprite, transformComponent: Transform): void {
        spriteComponent.sprite.scale.set(transformComponent.scale.x, transformComponent.scale.y);
    }
}