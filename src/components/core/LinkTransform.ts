import {Entity, IComponent} from "../../ecsModels.ts";
import Vector2 from "../../utils/Vector2.ts";

export default class LinkTransform implements IComponent {
    entity: Entity;
    name: string = "LinkTransform";

    entityID: string;
    offset: Vector2;

    constructor(
        entity: Entity,
        entityID: string,
        offset: Vector2 = new Vector2(0, 0)
    ) {
        this.entity = entity;
        this.offset = offset;
        this.entityID = entityID;
    }

    destroy(): void {}
}