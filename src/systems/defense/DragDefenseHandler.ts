import {Entity, ISystem} from "../../ecsModels.ts";
import Game from "../../Game.ts";

// components
import Tag from "../../components/core/Tag.ts";
import Transform from "../../components/core/Transform.ts";
import Drag from "../../components/core/Drag.ts";

export default class DragDefenseHandler implements ISystem {
    game: Game;

    constructor() {
        this.game = Game.getInstance();
    }

    update(deltaTime: number): void {
        const entities: Entity[] = this.game.entities.filter((entity: Entity): boolean => {
            return this.checkComponents(entity);
        });

        entities.forEach((entity: Entity): void => {
            const tagComponent: Tag = entity.getComponent("Tag") as Tag;
            const dragComponent: Drag = entity.getComponent("Drag") as Drag;
            const transformComponent: Transform = entity.getComponent("Transform") as Transform;

            if (tagComponent.tag !== "defense") {
                return;
            }

            if (dragComponent.isDragged) {
                transformComponent.position = transformComponent.position.add(dragComponent.movement);
                dragComponent.movement.x = 0;
                dragComponent.movement.y = 0;
            }
        });
    }

    checkComponents(entity: Entity): boolean {
        return entity.hasComponent("Drag")
            && entity.hasComponent("Transform")
            && entity.hasComponent("Tag");
    }
}