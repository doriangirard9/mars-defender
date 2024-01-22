import {Entity, IComponent} from "../ecsModels.ts";
import Vector2 from "../utils/Vector2.ts";

export default class Enemy implements IComponent {
    entity: Entity;
    name: string = "Enemy";

    path: Vector2[] = [];
    spawn: Vector2;
    type: string;

    constructor(
        entity: Entity,
        type: string,
        spawn: Vector2
    ) {
        this.entity = entity;
        this.type = type;
        this.spawn = spawn;
    }
}