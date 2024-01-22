import {Entity, IComponent} from "../../ecsModels.ts";

export default class Drag implements IComponent {
    entity: Entity;
    name: string = "Drag";

    isDragged: boolean = false;
    onPointerMove: Function[] = [];
    onPointerUp: Function[] = [];
    isEnable: boolean;

    constructor(
        entity: Entity,
        isEnable: boolean = true
    ) {
        this.entity = entity;
        this.isEnable = isEnable;
    }
}