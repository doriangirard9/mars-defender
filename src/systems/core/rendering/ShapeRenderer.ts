import {Entity, ISystem} from "../../../ecsModels.ts";
import * as PIXI from "pixi.js";
import EventManager from "../../../managers/EventManager.ts";
import Game from "../../../Game.ts";

// components
import Shape from "../../../components/core/Shape.ts";

export default class ShapeRenderer implements ISystem {
    eventManager: EventManager;
    app: PIXI.Application;

    constructor() {
        this.eventManager = EventManager.getInstance();
        this.app = Game.getInstance().app;
        this.subscribeToEvents();
    }

    subscribeToEvents(): void {
        this.eventManager.subscribe("OnNewEntity", this.OnNewEntity.bind(this));
    }

    OnNewEntity(entity: Entity): void {
        if (!entity.hasComponents(["Shape"])) {
            return;
        }

        const shapeComponent: Shape = entity.getComponent("Shape") as Shape;

        this.app.stage.addChild(shapeComponent.shape);
    }

    update(deltaTime: number): void {}
}