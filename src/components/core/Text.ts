import { IComponent, Entity } from "../../ecsModels.ts";
import * as PIXI from "pixi.js";
import Vector2 from "../../utils/Vector2.ts";

export default class Text implements IComponent {
    entity: Entity;
    name: string = "Text";

    value: PIXI.Text;
    scale: Vector2;

    constructor(
        entity: Entity,
        value: PIXI.Text,
        scale: Vector2 = new Vector2(1, 1)
    ) {
        this.entity = entity;
        this.value = value;
        this.scale = scale;
    }

    destroy(): void {
        this.value.destroy();
    }
}