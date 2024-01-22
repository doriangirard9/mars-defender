import {Entity, IComponent} from "../../ecsModels.ts";

export default class Hover implements IComponent {
    entity: Entity;
    name: string = "Hover";

    onPointerEnter: Function[] = [];
    onPointerLeave: Function[] = [];
    isEnable: boolean;

    constructor(
        entity: Entity,
        isEnable: boolean = true
    ) {
        this.entity = entity;
        this.isEnable = isEnable;
    }
}