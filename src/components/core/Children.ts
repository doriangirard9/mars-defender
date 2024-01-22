import {Entity, IComponent} from "../../ecsModels.ts";

export default class Children implements IComponent {
    entity: Entity;
    name: string = "Children";

    children: Entity[] = [];

    constructor(
        entity: Entity
    ) {
        this.entity = entity;
    }
}