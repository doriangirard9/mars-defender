import { IComponent, Entity } from "../../ecsModels.ts";

export default class Tag implements IComponent {
    entity: Entity;
    name: string = "Tag";

    tag: string;

    constructor(
        entity: Entity,
        tag: string
    ) {
        this.entity = entity;
        this.tag = tag;
    }

    destroy(): void {}
}