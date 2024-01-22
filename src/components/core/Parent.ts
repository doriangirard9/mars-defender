import {Entity, IComponent} from "../../ecsModels.ts";
import Vector2 from "../../utils/Vector2.ts";

export default class Parent implements IComponent {
    entity: Entity;
    name: string = "Parent";

    parent: Entity
    linkTransform: boolean;
    linkRotation: boolean;
    offset: Vector2;

    constructor(
        entity: Entity,
        parent: Entity,
        linkTransform: boolean = true,
        linkRotation: boolean = true,
        offset: Vector2 = new Vector2(0, 0)
    ) {
        this.entity = entity;
        this.parent = parent;
        this.linkTransform = linkTransform;
        this.linkRotation = linkRotation;
        this.offset = offset;
    }
}