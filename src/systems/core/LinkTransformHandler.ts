import {Entity, ISystem} from "../../ecsModels.ts";
import Game from "../../Game.ts";

// components
import Transform from "../../components/core/Transform.ts";
import LinkTransform from "../../components/core/LinkTransform.ts";

export default class LinkTransformHandler implements ISystem {
    game: Game;

    constructor() {
        this.game = Game.getInstance();
        this.subscribeToEvents();
    }

    subscribeToEvents(): void {
        this.game.eventManager.subscribe("OnNewEntity", this.OnNewEntity.bind(this));
    }

    OnNewEntity(entity: Entity): void {
        if (this.checkComponents(entity)) {
            const transformComponent: Transform = entity.getComponent("Transform") as Transform;
            const linkTransformComponent: LinkTransform = entity.getComponent("LinkTransform") as LinkTransform;

            if (linkTransformComponent.transform !== null) {
                this.setTransformPosition(linkTransformComponent, transformComponent);
            }
        }
    }

    update(deltaTime: number): void {
        const entities: Entity[] = this.game.entities.filter((entity: Entity): boolean => {
            return this.checkComponents(entity);
        });

        entities.forEach((entity: Entity): void => {
            const transformComponent: Transform = entity.getComponent("Transform") as Transform;
            const linkTransformComponent: LinkTransform = entity.getComponent("LinkTransform") as LinkTransform;

            if (linkTransformComponent.transform !== null) {
                this.setTransformPosition(linkTransformComponent, transformComponent);
            }
        });
    }

    checkComponents(entity: Entity): boolean {
        return entity.hasComponent("Transform") && entity.hasComponent("LinkTransform");
    }

    setTransformPosition(sourceTransform: LinkTransform, linkedTransform: Transform): void {
        linkedTransform.position = sourceTransform.transform.position.add(sourceTransform.offset);
    }
}