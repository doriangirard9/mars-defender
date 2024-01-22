import {Entity, IComponent} from "../ecsModels.ts";

export default class Defense implements IComponent {
    entity: Entity;
    name: string = "Defense";

    isUIActive: boolean = false;
    isPlaced: boolean = false;
    targetId: string | null = null;
    shootCooldown: number = 0;
    type: string;

    constructor(
        entity: Entity,
        type: string,
        isPlaced: boolean = false,
    ) {
        this.entity = entity;
        this.type = type;
        this.isPlaced = isPlaced;
    }
}