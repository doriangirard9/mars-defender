import {Entity, IComponent} from "../../ecsModels.ts";

export default class Click implements IComponent {
    entity: Entity;
    name: string = "Click";

    isClicked: boolean = false;

    constructor(
        entity: Entity
    ) {
        this.entity = entity;
    }
}