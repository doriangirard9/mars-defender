import { IComponent, Entity } from "../../ecsModels.ts";
import Vector2 from "../../utils/Vector2.ts";

export default class Transform implements IComponent {
    entity: Entity;
    name: string = "Transform";

    position: Vector2;
    scale: Vector2;
    rotation: number;

    constructor(
        entity: Entity,
        position: Vector2 = new Vector2(0, 0),
        scale: Vector2 = new Vector2(1, 1),
        rotation: number = 0
    ) {
        this.entity = entity;
        this.position = position;
        this.scale = scale;
        this.rotation = rotation;
    }
}