import {Entity, IComponent} from "../../ecsModels.ts";

export default class Drag implements IComponent {
    entity: Entity;
    name: string = "Drag";

    isDragged: boolean = false;
    onPointerMove: Function[] = [];

    constructor(
        entity: Entity
    ) {
        this.entity = entity;
    }

    destroy(): void {}
}