import { IComponent, Entity } from "../../ecsModels.ts";
import * as PIXI from "pixi.js";

export default class Shape implements IComponent {
    entity: Entity;
    name: string = "Shape";

    shape: PIXI.Graphics;

    constructor(
        entity: Entity,
        shape: PIXI.Graphics
    ) {
        this.entity = entity;
        this.shape = shape;
    }
}