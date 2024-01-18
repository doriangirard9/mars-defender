import {Entity, IComponent} from "../../ecsModels.ts";

export default class Click implements IComponent {
    entity: Entity;
    name: string = "Click";

    onPointerDown: Function[] = [];
    onPointerUp: Function[] = [];

    constructor(
        entity: Entity
    ) {
        this.entity = entity;
    }

    destroy(): void {}
}