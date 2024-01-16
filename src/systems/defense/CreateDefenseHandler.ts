import {Entity, ISystem} from "../../ecsModels.ts";
import Game from "../../Game.ts";
import * as PIXI from "pixi.js";
import Vector2 from "../../utils/Vector2.ts";

// components
import Click from "../../components/core/Click.ts";
import Tag from "../../components/core/Tag.ts";
import Sprite from "../../components/core/Sprite.ts";
import Transform from "../../components/core/Transform.ts";
import Drag from "../../components/core/Drag.ts";
import LinkTransform from "../../components/core/LinkTransform.ts";

export default class CreateDefenseHandler implements ISystem {
    game: Game;

    constructor() {
        this.game = Game.getInstance();
    }

    update(deltaTime: number): void {
        const entities: Entity[] = this.game.entities.filter((entity: Entity): boolean => {
            return this.checkComponents(entity);
        });

        entities.forEach((entity: Entity): void => {
            const clickComponent: Click = entity.getComponent("Click") as Click;
            const tagComponent: Tag = entity.getComponent("Tag") as Tag;

            if (tagComponent.tag !== "buttonCreateDefense") {
                return;
            }

            if (clickComponent.isClicked) {
                clickComponent.isClicked = false;
                this.createDefense();
            }
        });
    }

    checkComponents(entity: Entity): boolean {
        return entity.hasComponent("Click") && entity.hasComponent("Tag");
    }

    createDefense(): void {
        const defense: Entity = new Entity();
        defense.addComponent(new Transform(defense, new Vector2(200, 100), new Vector2(0.15, 0.15)));
        let sprite1: PIXI.Sprite = PIXI.Sprite.from("img/defense.png");
        sprite1.zIndex = 2;
        defense.addComponent(new Sprite(defense, sprite1));
        defense.addComponent(new Drag(defense));
        defense.addComponent(new Tag(defense, "defense"));
        this.game.addEntity(defense);

        const defenseValidateButton: Entity = new Entity();
        defenseValidateButton.addComponent(
            new Transform(
                defenseValidateButton,
                new Vector2(0, 0),
                new Vector2(0.015, 0.03)
            )
        );
        defenseValidateButton.addComponent(
            new Sprite(defenseValidateButton,
            PIXI.Sprite.from("img/button.png"))
        );
        defenseValidateButton.addComponent(
            new LinkTransform(
                defenseValidateButton,
                new Vector2(0, -70),
                defense.getComponent("Transform") as Transform)
        );
        defenseValidateButton.addComponent(new Click(defenseValidateButton));
        this.game.addEntity(defenseValidateButton);
    }
}