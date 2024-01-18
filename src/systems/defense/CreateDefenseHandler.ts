import {Entity, ISystem} from "../../ecsModels.ts";
import * as PIXI from "pixi.js";
import Vector2 from "../../utils/Vector2.ts";
import EntityManager from "../../EntityManager.ts";
import EventManager from "../../EventManager.ts";
import {SpriteLayer} from "../../models/models.ts";

// components
import Click from "../../components/core/Click.ts";
import Tag from "../../components/core/Tag.ts";
import Sprite from "../../components/core/Sprite.ts";
import Transform from "../../components/core/Transform.ts";
import Drag from "../../components/core/Drag.ts";
import LinkTransform from "../../components/core/LinkTransform.ts";
import Text from "../../components/core/Text.ts";
import Defense from "../../components/Defense.ts";
import Game from "../../Game.ts";

export default class CreateDefenseHandler implements ISystem {
    entityManger: EntityManager;
    eventManager: EventManager;

    constructor() {
        this.entityManger = EntityManager.getInstance();
        this.eventManager = EventManager.getInstance();
        this.subscribeToEvents();
    }

    subscribeToEvents(): void {
        this.eventManager.subscribe("OnNewEntity", this.OnNewEntity.bind(this));
    }

    OnNewEntity(entity: Entity): void {
        if (entity.hasComponents(["Click", "Tag"])) {
            const tagComponent: Tag = entity.getComponent("Tag") as Tag;
            const clickComponent: Click = entity.getComponent("Click") as Click;

            if (tagComponent.tag !== "buttonCreateDefense") {
                return;
            }

            clickComponent.onPointerDown.push(this.createDefense.bind(this));
        }
    }

    update(deltaTime: number): void {}

    createDefense(): void {
        // defense
        const defense: Entity = new Entity();
        defense.addComponent(new Transform(defense, new Vector2(200, 100)));
        let defenseSprite: PIXI.Sprite = PIXI.Sprite.from("img/defense.png");
        defenseSprite.zIndex = SpriteLayer.FOREGROUND;
        defense.addComponent(new Sprite(defense, defenseSprite, new Vector2(0.15, 0.15), new Vector2(0.5, 0.75)));
        defense.addComponent(new Drag(defense));
        defense.addComponent(new Tag(defense, "defense"));
        defense.addComponent(new Defense(defense));
        this.entityManger.addEntity(defense);

        // defense base
        const defenseBase: Entity = new Entity();
        defenseBase.addComponent(new Transform(defenseBase, new Vector2(0, 0)));
        let defenseBaseSprite: PIXI.Sprite = PIXI.Sprite.from("img/baseDefense.png");
        defenseBaseSprite.zIndex = SpriteLayer.DEFAULT;
        defenseBase.addComponent(new Sprite(defenseBase, defenseBaseSprite, new Vector2(0.15, 0.15)));
        defenseBase.addComponent(new LinkTransform(defenseBase, defense.id, new Vector2(0, 0)));
        this.entityManger.addEntity(defenseBase);

        this.createValidationButton(defense);

        Game.getInstance().app.stage.sortChildren();
    }

    createValidationButton(defense: Entity): void {
        // defense validate button
        const defenseValidateButton: Entity = new Entity();
        defenseValidateButton.addComponent(new Tag(defenseValidateButton, "buttonValidateDefense"));
        defenseValidateButton.addComponent(
            new Transform(
                defenseValidateButton,
                new Vector2(0, 0)
            )
        );
        const text: PIXI.Text = new PIXI.Text("Validate");
        text.zIndex = SpriteLayer.UI;
        defenseValidateButton.addComponent(
            new Text(
                defenseValidateButton,
                text,
                new Vector2(0.4, 0.4)
            )
        );
        const buttonSprite: PIXI.Sprite = PIXI.Sprite.from("img/button.png");
        buttonSprite.zIndex = SpriteLayer.UI;
        defenseValidateButton.addComponent(
            new Sprite(
                defenseValidateButton,
                buttonSprite,
                new Vector2(0.015, 0.03)
            ),
        );
        defenseValidateButton.addComponent(
            new LinkTransform(
                defenseValidateButton,
                defense.id,
                new Vector2(0, -70)
            )
        );
        defenseValidateButton.addComponent(new Click(defenseValidateButton));
        this.entityManger.addEntity(defenseValidateButton);
    }
}