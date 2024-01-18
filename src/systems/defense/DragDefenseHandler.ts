import {Entity, ISystem} from "../../ecsModels.ts";
import EntityManager from "../../EntityManager.ts";
import EventManager from "../../EventManager.ts";

// components
import Tag from "../../components/core/Tag.ts";
import Transform from "../../components/core/Transform.ts";
import Drag from "../../components/core/Drag.ts";

export default class DragDefenseHandler implements ISystem {
    entityManger: EntityManager;
    eventManager: EventManager;

    constructor() {
        this.entityManger = EntityManager.getInstance();
        this.eventManager = EventManager.getInstance();
        this.subscribeToEvents();
    }

    subscribeToEvents(): void {
        this.eventManager.subscribe("OnNewEntity", this.OnNewEntity.bind(this));
    }

    OnNewEntity(entity: Entity): void {
        if (entity.hasComponents(["Drag", "Tag", "Transform"])) {
            const tagComponent: Tag = entity.getComponent("Tag") as Tag;
            const dragComponent: Drag = entity.getComponent("Drag") as Drag;
            const transformComponent: Transform = entity.getComponent("Transform") as Transform;

            if (tagComponent.tag !== "defense") {
                return;
            }

            dragComponent.onPointerMove.push((event: any): void => {
                this.OnDefenseDragged(event, transformComponent);
            });
        }
    }

    update(deltaTime: number): void {}

    OnDefenseDragged(event: any, transformComponent: Transform): void {
        transformComponent.position.x += event.data.originalEvent.movementX;
        transformComponent.position.y += event.data.originalEvent.movementY;
    }
}