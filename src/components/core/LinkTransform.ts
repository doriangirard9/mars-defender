import {Entity, IComponent} from "../../ecsModels.ts";
import Vector2 from "../../utils/Vector2.ts";
import Transform from "./Transform.ts";

export default class LinkTransform implements IComponent {
    entity: Entity;
    name: string = "LinkTransform";

    transform: Transform;
    offset: Vector2;

    constructor(
        entity: Entity,
        offset: Vector2 = new Vector2(0, 0),
        transform: Transform
    ) {
        this.entity = entity;
        this.offset = offset;
        this.transform = transform;
    }
}