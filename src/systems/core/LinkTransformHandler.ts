import {Entity, ISystem} from "../../ecsModels.ts";
import EntityManager from "../../EntityManager.ts";
import EventManager from "../../EventManager.ts";

// components
import Transform from "../../components/core/Transform.ts";
import LinkTransform from "../../components/core/LinkTransform.ts";

export default class LinkTransformHandler implements ISystem {
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
        if (entity.hasComponents(["Transform", "LinkTransform"])) {
            const transformComponent: Transform = entity.getComponent("Transform") as Transform;
            const linkTransformComponent: LinkTransform = entity.getComponent("LinkTransform") as LinkTransform;

            const entityToLink: Entity | undefined = this.entityManager.getEntityById(linkTransformComponent.entityID);

            if (entityToLink) {
                const entityTransformComponent: Transform = entityToLink.getComponent("Transform") as Transform;
                this.setTransformPosition(entityTransformComponent, transformComponent, linkTransformComponent);
            }
        }
    }

    update(deltaTime: number): void {
        const entities: Entity[] = this.entityManager.getEntitiesWithComponents(["Transform", "LinkTransform"]);

        entities.forEach((entity: Entity): void => {
            const transformComponent: Transform = entity.getComponent("Transform") as Transform;
            const linkTransformComponent: LinkTransform = entity.getComponent("LinkTransform") as LinkTransform;

            const entityToLink: Entity | undefined = this.entityManager.getEntityById(linkTransformComponent.entityID);

            if (entityToLink) {
                const entityTransformComponent: Transform = entityToLink.getComponent("Transform") as Transform;
                this.setTransformPosition(entityTransformComponent, transformComponent, linkTransformComponent);
            }
        });
    }

    setTransformPosition(sourceTransform: Transform, linkedTransform: Transform, linkTransformComponent: LinkTransform): void {
        linkedTransform.position = sourceTransform.position.add(linkTransformComponent.offset);
    }

    setTransformRotation(sourceTransform: LinkTransform, linkedTransform: Transform): void {
        // TODO
    }
}