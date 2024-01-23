import {Entity, ISystem} from "../../ecsModels.ts";
import EntityManager from "../../managers/EntityManager.ts";

// components
import Tag from "../../components/core/Tag.ts";
import Transform from "../../components/core/Transform.ts";

export default class PortalHandler implements ISystem {
    entityManager: EntityManager;

    constructor() {
        this.entityManager = EntityManager.getInstance();
    }

    update(deltaTime: number): void {
        const entities: Entity[] = this.entityManager.getEntitiesWithComponents(["Tag", "Transform"]);

        entities.forEach((entity: Entity): void => {
            const tagComponent: Tag = entity.getComponent("Tag") as Tag;
            const transformComponent: Transform = entity.getComponent("Transform") as Transform;

            if (tagComponent.tag !== "portal") {
                return;
            }

            transformComponent.rotation -= 0.01;
            if (transformComponent.rotation > 360) {
                transformComponent.rotation = 0;
            }
        });
    }
}