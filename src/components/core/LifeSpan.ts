import {Entity, IComponent} from "../../ecsModels.ts";

export default class LifeSpan implements IComponent {
    entity: Entity;
    name: string = "LifeSpan";

    value: number;

    constructor(
        entity: Entity,
        lifeSpan: number
    ) {
        this.entity = entity;
        this.value = lifeSpan;
    }
}