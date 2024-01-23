import {Entity, ISystem} from "../../ecsModels.ts";
import EntityManager from "../../managers/EntityManager.ts";
import EventManager from "../../managers/EventManager.ts";
import * as PIXI from "pixi.js";
import Vector2 from "../../utils/Vector2.ts";
import SpriteBuilder from "../../managers/SpriteBuilder.ts";

// components
import Text from "../../components/core/Text.ts";
import Transform from "../../components/core/Transform.ts";
import LifeSpan from "../../components/core/LifeSpan.ts";
import Sprite from "../../components/core/Sprite.ts";

export default class DisplayMessageHandler implements ISystem {
    entityManager: EntityManager;
    eventManager: EventManager;

    constructor() {
        this.entityManager = EntityManager.getInstance();
        this.eventManager = EventManager.getInstance();
        this.subscribeToEvents();
    }

    subscribeToEvents(): void {
        this.eventManager.subscribe("OnDisplayErrorMessage", (message: string): void => {
            this.displayMessage(message, "orange", 1000);
        });
        this.eventManager.subscribe("OnDisplayMessage", (message: string): void => {
            this.displayMessage(message, "white", 2000);
        });
    }

    displayMessage(message: string, color: string, lifeSpan: number): void {
        const messageEntity: Entity = new Entity();
        messageEntity.addComponent(new Transform(messageEntity, new Vector2(570, 390)));
        const sprite: Sprite = new SpriteBuilder()
            .addEntity(messageEntity)
            .addSprite(PIXI.Sprite.from("./img/container.png"))
            .addAnchor(new Vector2(0.5, 0.5))
            .addScale(new Vector2(0.8, 0.3))
            .build();
        messageEntity.addComponent(sprite);
        messageEntity.addComponent(new Text(messageEntity, new PIXI.Text(message), new Vector2(1, 1), color));
        messageEntity.addComponent(new LifeSpan(messageEntity, lifeSpan));
        this.entityManager.addEntity(messageEntity);
    }

    update(deltaTime: number): void {}
}