import {Entity} from "../ecsModels.ts";
import * as PIXI from "pixi.js";
import Vector2 from "../utils/Vector2.ts";

import Transform from "../components/core/Transform.ts";
import Sprite from "../components/core/Sprite.ts";
import Tag from "../components/core/Tag.ts";

export default class TileEntity extends Entity {
    constructor(
        position: Vector2 = new Vector2(0, 0),
        scale: Vector2 = new Vector2(1, 1),
        rotation: number = 0,
        sprite: PIXI.Sprite
    ) {
        super();

        this.addComponent(new Tag(this, "Tile"));
        this.addComponent(new Transform(this, position, scale, rotation));
        this.addComponent(new Sprite(this, sprite));
    }
}