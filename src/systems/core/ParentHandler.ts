import {Entity, ISystem} from "../../ecsModels.ts";
import EntityManager from "../../managers/EntityManager.ts";
import EventManager from "../../managers/EventManager.ts";

// components
import Parent from "../../components/core/Parent.ts";
import Children from "../../components/core/Children.ts";
import Transform from "../../components/core/Transform.ts";

export default class ParentHandler implements ISystem {
    entityManager: EntityManager;
    eventManager: EventManager;

    constructor() {
        this.entityManager = EntityManager.getInstance();
        this.eventManager = EventManager.getInstance();
        this.subscribeToEvents();
    }

    subscribeToEvents(): void {
        this.eventManager.subscribe("OnNewEntity", this.OnNewEntity.bind(this));
    }

    OnNewEntity(entity: Entity): void {
        if (!entity.hasComponents(["Parent", "Transform"])) {
            return;
        }

        const parentComponent: Parent = entity.getComponent("Parent") as Parent;
        const transformComponent: Transform = entity.getComponent("Transform") as Transform;

        const parentEntity: Entity = parentComponent.parent;
        const parentChildrenComponent: Children = parentEntity.getComponent("Children") as Children;
        parentChildrenComponent.children.push(entity);

        if (parentComponent.linkTransform) {
            const parentTransformComponent: Transform = parentEntity.getComponent("Transform") as Transform;
            transformComponent.position = parentTransformComponent.position.add(parentComponent.offset);
        }
    }

    update(deltaTime: number): void {
        const entities: Entity[] = this.entityManager.getEntitiesWithComponents(["Parent", "Transform"]);

        entities.forEach((entity: Entity): void => {
            const parentComponent: Parent = entity.getComponent("Parent") as Parent;
            const transformComponent: Transform = entity.getComponent("Transform") as Transform;

            if (parentComponent.linkTransform) {
                const parentTransformComponent: Transform = parentComponent.parent.getComponent("Transform") as Transform;
                transformComponent.position = parentTransformComponent.position.add(parentComponent.offset);
            }
        });
    }
}