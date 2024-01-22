import {Entity, IComponent} from "../../ecsModels.ts";

export default class Click implements IComponent {
    entity: Entity;
    name: string = "Click";

    onPointerDown: Function[] = [];
    onGlobalPointerDown: Function[] = [];
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