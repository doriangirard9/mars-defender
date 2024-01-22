import {IDefense, SpriteLayer} from "../models/models.ts";
import {Entity} from "../ecsModels.ts";
import Vector2 from "../utils/Vector2.ts";
import * as PIXI from "pixi.js";
import SpriteBuilder from "./SpriteBuilder.ts";

// components
import Sprite from "../components/core/Sprite.ts";
import Drag from "../components/core/Drag.ts";
import Click from "../components/core/Click.ts";
import Hover from "../components/core/Hover.ts";
import Tag from "../components/core/Tag.ts";
import Children from "../components/core/Children.ts";
import Defense from "../components/Defense.ts";
import Transform from "../components/core/Transform.ts";
import Parent from "../components/core/Parent.ts";

export default class DefenseFactory {
    private static instance: DefenseFactory;

    private constructor() {}

    createDefense(defenseData: IDefense): Entity {
        const defense: Entity = new Entity();
        defense.addComponent(new Transform(defense, new Vector2(200, 200)));
        let defenseSprite: Sprite = new SpriteBuilder()
            .addSprite(PIXI.Sprite.from(defenseData.sprite))
            .addEntity(defense)
            .addAnchor(new Vector2(defenseData.anchor.x, defenseData.anchor.y))
            .addScale(new Vector2(0.17, 0.17))
            .addRotationOffset(Math.PI / 2)
            .addZIndex(SpriteLayer.FOREGROUND)
            .build();
        defense.addComponent(defenseSprite);
        defense.addComponent(new Drag(defense));
        defense.addComponent(new Click(defense, false));
        defense.addComponent(new Hover(defense));
        defense.addComponent(new Tag(defense, "defense"));
        defense.addComponent(new Children(defense));
        defense.addComponent(new Defense(defense, defenseData.name));
        return defense;
    }

    createUpgradedDefense(defenseData: IDefense, oldDefense: Entity): Entity {
        const oldDefenseTransformComponent: Transform = oldDefense.getComponent("Transform") as Transform;

        const defense: Entity = new Entity();
        defense.addComponent(new Transform(defense, oldDefenseTransformComponent.position));
        let defenseSprite: Sprite = new SpriteBuilder()
            .addSprite(PIXI.Sprite.from(defenseData.sprite))
            .addEntity(defense)
            .addAnchor(new Vector2(defenseData.anchor.x, defenseData.anchor.y))
            .addScale(new Vector2(0.17, 0.17))
            .addRotationOffset(Math.PI / 2)
            .addZIndex(SpriteLayer.FOREGROUND)
            .build();
        defense.addComponent(defenseSprite);
        defense.addComponent(new Drag(defense, false));
        defense.addComponent(new Click(defense, true));
        defense.addComponent(new Hover(defense));
        defense.addComponent(new Tag(defense, "defense"));
        defense.addComponent(new Children(defense));
        defense.addComponent(new Defense(defense, defenseData.name, true));
        return defense;
    }

    createDefenseBase(defense: Entity): Entity {
        const defenseBase: Entity = new Entity();
        defenseBase.addComponent(new Transform(defenseBase, new Vector2(0, 0)));
        let defenseBaseSprite: PIXI.Sprite = PIXI.Sprite.from("img/baseDefense.png");
        defenseBaseSprite.zIndex = SpriteLayer.DEFAULT;
        defenseBase.addComponent(new Sprite(defenseBase, defenseBaseSprite, new Vector2(0.17, 0.17)));
        defenseBase.addComponent(new Parent(defenseBase, defense, true, false));
        return defenseBase;
    }

    public static getInstance(): DefenseFactory {
        if (!DefenseFactory.instance) {
            DefenseFactory.instance = new DefenseFactory();
        }

        return DefenseFactory.instance;
    }
}