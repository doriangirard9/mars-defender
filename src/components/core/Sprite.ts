import { IComponent, Entity } from "../../ecsModels.ts";
import * as PIXI from "pixi.js";

export default class Sprite implements IComponent {
    entity: Entity;
    name: string = "Sprite";

    sprite: PIXI.Sprite;

    constructor(
        entity: Entity,
        sprite: PIXI.Sprite
    ) {
        this.entity = entity;
        this.sprite = sprite;
    }
}