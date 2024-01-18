import {Entity} from "./ecsModels.ts";
import EventManager from "./EventManager.ts";

export default class EntityManager {
    private static instance: EntityManager;

    eventManager: EventManager = EventManager.getInstance();

    entities: Entity[] = [];

    private constructor() {}

    static getInstance(): EntityManager {
        if (!EntityManager.instance) {
            EntityManager.instance = new EntityManager();
        }

        return EntityManager.instance;
    }

    addEntity(entity: Entity): void {
        this.entities.push(entity);
        this.eventManager.notify("OnNewEntity", entity);
    }

    removeEntity(entity: Entity): void {
        // remove all components
        entity.components.forEach((component: any): void => {
            entity.removeComponent(component.name);
        });

        // remove entity from entities list
        for (let i: number = this.entities.length - 1; i >= 0; i--) {
            if (this.entities[i].id === entity.id) {
                this.entities.splice(i, 1);
            }
        }
    }

    getEntityById(id: string): Entity | undefined {
        return this.entities.find((entity: Entity): boolean => {
            return entity.id === id;
        });
    }

    getEntitiesWithComponents(componentNames: string[]): Entity[] {
        return this.entities.filter((entity: Entity): boolean => {
            return componentNames.every((componentName: string): boolean => {
                return entity.hasComponent(componentName);
            });
        });
    }
}