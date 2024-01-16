import {Entity, ISystem} from "../../ecsModels.ts";
import * as PIXI from "pixi.js";
import Game from "../../Game.ts";

// components
import Text from "../../components/core/Text.ts";
import Transform from "../../components/core/Transform.ts";

export default class SpriteRendererSystem implements ISystem {
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
            const textComponent: Text = entity.getComponent("Text") as Text;

            textComponent.value.anchor.set(0.5, 0.5);

            this.app.stage.addChild(textComponent.value);
        }
    }

    update(deltaTime: number): void {
        const entities: Entity[] = this.game.entities.filter((entity: Entity): boolean => {
            return this.checkComponents(entity);
        });

        // update all texts
        entities.forEach((entity: Entity): void => {
            const textComponent: Text = entity.getComponent("Text") as Text;
            const transformComponent: Transform = entity.getComponent("Transform") as Transform;

            textComponent.value.x = transformComponent.position.x;
            textComponent.value.y = transformComponent.position.y;

            textComponent.value.scale.set(transformComponent.scale.x, transformComponent.scale.y);
        });
    }

    checkComponents(entity: Entity): boolean {
        return entity.hasComponent("Text") && entity.hasComponent("Transform");
    }
}