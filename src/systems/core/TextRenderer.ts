import {Entity, ISystem} from "../../ecsModels.ts";
import * as PIXI from "pixi.js";
import Game from "../../Game.ts";

// components
import Text from "../../components/core/Text.ts";
import Transform from "../../components/core/Transform.ts";
import EventManager from "../../EventManager.ts";
import EntityManager from "../../EntityManager.ts";

export default class SpriteRendererSystem implements ISystem {
    eventManager: EventManager;
    entityManger: EntityManager;
    app: PIXI.Application;

    constructor() {
        this.eventManager = EventManager.getInstance();
        this.entityManger = EntityManager.getInstance();
        this.app = Game.getInstance().app;
        this.subscribeToEvents();
    }

    subscribeToEvents(): void {
        this.eventManager.subscribe("OnNewEntity", this.OnNewEntity.bind(this));
    }

    OnNewEntity(entity: Entity): void {
        if (entity.hasComponents(["Text", "Transform"])) {
            const textComponent: Text = entity.getComponent("Text") as Text;
            const transformComponent: Transform = entity.getComponent("Transform") as Transform;

            textComponent.value.anchor.set(0.5, 0.5);

            this.setTextPosition(textComponent, transformComponent);
            this.setTextScale(textComponent);

            this.app.stage.addChild(textComponent.value);
        }
    }

    update(deltaTime: number): void {
        const entities: Entity[] = this.entityManger.getEntitiesWithComponents(["Text", "Transform"]);

        // update all texts
        entities.forEach((entity: Entity): void => {
            const textComponent: Text = entity.getComponent("Text") as Text;
            const transformComponent: Transform = entity.getComponent("Transform") as Transform;

            this.setTextPosition(textComponent, transformComponent);
            this.setTextScale(textComponent);
        });
    }

    setTextPosition(textComponent: Text, transformComponent: Transform): void {
        textComponent.value.x = transformComponent.position.x;
        textComponent.value.y = transformComponent.position.y;
    }

    setTextScale(textComponent: Text): void {
        textComponent.value.scale.set(textComponent.scale.x, textComponent.scale.y);
    }
}