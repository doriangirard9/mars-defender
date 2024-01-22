import {Entity, ISystem} from "../../ecsModels.ts";
import EntityManager from "../../managers/EntityManager.ts";
import EventManager from "../../managers/EventManager.ts";
import Vector2 from "../../utils/Vector2.ts";

// components
import Transform from "../../components/core/Transform.ts";
import Drag from "../../components/core/Drag.ts";
import GameStates from "../../components/singletons/GameStates.ts";

export default class DragDefenseHandler implements ISystem {
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
        if (entity.hasComponents(["Drag", "Defense", "Transform", "Hover"])) {
            const dragComponent: Drag = entity.getComponent("Drag") as Drag;
            const transformComponent: Transform = entity.getComponent("Transform") as Transform;

            dragComponent.onPointerMove.push((event: any): void => {
                this.OnDefenseDragged(event, transformComponent);
            });

            dragComponent.onPointerUp.push((): void => {
                this.OnDefenseDraggedEnd(transformComponent);
            });
        }
    }

    update(deltaTime: number): void {}

    OnDefenseDragged(event: any, transformComponent: Transform): void {
        transformComponent.position.x += event.data.originalEvent.movementX;
        transformComponent.position.y += event.data.originalEvent.movementY;
    }

    OnDefenseDraggedEnd(transformComponent: Transform): void {
        const gameStatesComponent: GameStates = GameStates.getInstance();
        const tileSize: number = gameStatesComponent.tileSize;
        transformComponent.position = new Vector2(
            Math.round((transformComponent.position.x - tileSize / 2) / tileSize) * tileSize + tileSize / 2,
            Math.round((transformComponent.position.y - tileSize / 2) / tileSize) * tileSize + tileSize / 2
        );
    }
}