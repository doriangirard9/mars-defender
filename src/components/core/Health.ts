import {Entity, IComponent} from "../../ecsModels.ts";

export default class Health implements IComponent {
    entity: Entity;
    name: string = "Health";

    maxHealth: number;
    health: number;
    onNoHealth: Function[] = [];
    onNewHealth: Function[] = [];

    constructor(
        entity: Entity,
        maxHealth: number,
        health: number = maxHealth
    ) {
        this.entity = entity;
        this.maxHealth = maxHealth;
        this.health = health;
    }
}