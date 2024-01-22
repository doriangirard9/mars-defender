import {ISystem} from "../../ecsModels.ts";
import EntityManager from "../../managers/EntityManager.ts";
import EventManager from "../../managers/EventManager.ts";

// components
import Health from "../../components/core/Health.ts";

export default class HealthHandler implements ISystem {
    entityManager: EntityManager;
    eventManager: EventManager;

    constructor() {
        this.entityManager = EntityManager.getInstance();
        this.eventManager = EventManager.getInstance();
        this.subscribeToEvents();
    }

    subscribeToEvents(): void {
        this.eventManager.subscribe("OnUpdateHealth", this.OnUpdateHealth.bind(this));
    }

    OnUpdateHealth(healthComponent: Health, amount: number): void {
        if (healthComponent.health + amount > healthComponent.maxHealth) {
            healthComponent.health = healthComponent.maxHealth;
        }
        if (healthComponent.health + amount < 0) {
            healthComponent.health = 0;
        }
        else {
            healthComponent.health += amount;
        }

        healthComponent.onNewHealth.forEach((callback: Function): void => {
            callback();
        });

        if (healthComponent.health <= 0) {
            healthComponent.onNoHealth.forEach((callback: Function): void => {
                callback();
            });
        }
    }

    update(deltaTime: number): void {}
}