import {Entity, IComponent} from "../ecsModels.ts";

export default class Defense implements IComponent {
    entity: Entity;
    name: string = "Defense";

    isPlaced: boolean = false;

    constructor(
        entity: Entity
    ) {
        this.entity = entity;
    }

    destroy(): void {}
}