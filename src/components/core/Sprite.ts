import { IComponent, Entity } from "../../ecsModels.ts";
import * as PIXI from "pixi.js";
import Vector2 from "../../utils/Vector2.ts";

export default class Sprite implements IComponent {
    entity: Entity;
    name: string = "Sprite";

    sprite: PIXI.Sprite;
    scale: Vector2;
    anchor: Vector2;

    constructor(
        entity: Entity,
        sprite: PIXI.Sprite,
        scale: Vector2 = new Vector2(1, 1),
        anchor: Vector2 = new Vector2(0.5, 0.5)
    ) {
        this.entity = entity;
        this.sprite = sprite;
        this.scale = scale;
        this.anchor = anchor;
    }

    destroy(): void {
        this.sprite.destroy();
    }
}