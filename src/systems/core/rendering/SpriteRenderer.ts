import {Entity, ISystem} from "../../../ecsModels.ts";
import * as PIXI from "pixi.js";
import EntityManager from "../../../managers/EntityManager.ts";
import EventManager from "../../../managers/EventManager.ts";
import Game from "../../../Game.ts";

// components
import Sprite from "../../../components/core/Sprite.ts";
import Transform from "../../../components/core/Transform.ts";

export default class SpriteRenderer implements ISystem {
    eventManager: EventManager;
    entityManager: EntityManager;
    app: PIXI.Application;

    constructor() {
        this.eventManager = EventManager.getInstance();
        this.entityManager = EntityManager.getInstance();
        this.app = Game.getInstance().app;
        this.subscribeToEvents();
    }

    subscribeToEvents(): void {
        this.eventManager.subscribe("OnNewEntity", this.OnNewEntity.bind(this));
    }

    OnNewEntity(entity: Entity): void {
        if (entity.hasComponents(["Sprite", "Transform"])) {
            const spriteComponent: Sprite = entity.getComponent("Sprite") as Sprite;
            const transformComponent: Transform = entity.getComponent("Transform") as Transform;

            this.setSpriteAnchor(spriteComponent);
            this.setSpritePosition(spriteComponent, transformComponent);
            this.setSpriteRotation(spriteComponent, transformComponent);
            this.setSpriteScale(spriteComponent);

            this.app.stage.addChild(spriteComponent.sprite);
        }
    }

    update(deltaTime: number): void {
        const entities: Entity[] = this.entityManager.getEntitiesWithComponents(["Sprite", "Transform"]);

        // update all sprites
        entities.forEach((entity: Entity): void => {
            const spriteComponent: Sprite = entity.getComponent("Sprite") as Sprite;
            const transformComponent: Transform = entity.getComponent("Transform") as Transform;

            this.setSpritePosition(spriteComponent, transformComponent);
            this.setSpriteRotation(spriteComponent, transformComponent);
            this.setSpriteScale(spriteComponent);
        });
    }

    setSpriteAnchor(spriteComponent: Sprite): void {
        spriteComponent.sprite.anchor.set(spriteComponent.anchor.x, spriteComponent.anchor.y);
    }

    setSpritePosition(spriteComponent: Sprite, transformComponent: Transform): void {
        spriteComponent.sprite.x = transformComponent.position.x;
        spriteComponent.sprite.y = transformComponent.position.y;
    }

    setSpriteRotation(spriteComponent: Sprite, transformComponent: Transform): void {
        spriteComponent.sprite.rotation = transformComponent.rotation + spriteComponent.rotationOffset;
    }

    setSpriteScale(spriteComponent: Sprite): void {
        spriteComponent.sprite.scale.set(spriteComponent.scale.x, spriteComponent.scale.y);
    }
}