import {Entity, IComponent} from "../../ecsModels.ts";
import Vector2 from "../../utils/Vector2.ts";

export default class Click implements IComponent {
    entity: Entity;
    name: string = "Drag";

    isDragged: boolean = false;
    movement: Vector2 = new Vector2(0, 0);

    constructor(
        entity: Entity
    ) {
        this.entity = entity;
    }
}