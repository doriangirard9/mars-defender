import Sprite from "../components/core/Sprite.ts";
import * as PIXI from "pixi.js";
import Vector2 from "../utils/Vector2.ts";
import {Entity} from "../ecsModels.ts";

export default class SpriteBuilder {
    private zIndex: number = 0;
    private pixiSprite!: PIXI.Sprite;
    private scale: Vector2 = new Vector2(1, 1);
    private anchor: Vector2 = new Vector2(0.5, 0.5);
    private rotationOffset: number = 0;
    private entity!: Entity;

    constructor() {}

    addEntity(entity: Entity): SpriteBuilder {
        this.entity = entity;
        return this;
    }

    addSprite(sprite: PIXI.Sprite): SpriteBuilder {
        this.pixiSprite = sprite;
        return this;
    }

    addScale(scale: Vector2): SpriteBuilder {
        this.scale = scale;
        return this;
    }

    addAnchor(anchor: Vector2): SpriteBuilder {
        this.anchor = anchor;
        return this;
    }

    addRotationOffset(rotationOffset: number): SpriteBuilder {
        this.rotationOffset = rotationOffset;
        return this;
    }

    addZIndex(zIndex: number): SpriteBuilder {
        this.zIndex = zIndex;
        return this;
    }

    build(): Sprite {
        this.pixiSprite.zIndex = this.zIndex;
        return new Sprite(
            this.entity,
            this.pixiSprite,
            this.scale,
            this.anchor,
            this.rotationOffset
        );
    }
}