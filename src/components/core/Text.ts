import { IComponent, Entity } from "../../ecsModels.ts";
import * as PIXI from "pixi.js";

export default class Text implements IComponent {
    entity: Entity;
    name: string = "Text";

    value: PIXI.Text;

    constructor(
        entity: Entity,
        value: PIXI.Text
    ) {
        this.entity = entity;
        this.value = value;
    }
}