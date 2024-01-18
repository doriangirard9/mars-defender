import {Entity, ISystem} from "../../ecsModels.ts";
import * as PIXI from "pixi.js";
import Game from "../../Game.ts";
import EntityManager from "../../EntityManager.ts";
import EventManager from "../../EventManager.ts";

// components
import Click from "../../components/core/Click.ts";
import Tag from "../../components/core/Tag.ts";

export default class ValidateDefenseHandler implements ISystem {
    entityManger: EntityManager;
    eventManager: EventManager;
    app: PIXI.Application;

    constructor() {
        this.entityManger = EntityManager.getInstance();
        this.eventManager = EventManager.getInstance();
        this.app = Game.getInstance().app;
        this.subscribeToEvents();
    }

    subscribeToEvents(): void {
        this.eventManager.subscribe("OnNewEntity", this.OnNewEntity.bind(this));
    }

    OnNewEntity(entity: Entity): void {
        if (entity.hasComponents(["Tag", "Click"])) {
            const tagComponent: Tag = entity.getComponent("Tag") as Tag;
            const clickComponent: Click = entity.getComponent("Click") as Click;

            if (tagComponent.tag !== "buttonValidateDefense") {
                return;
            }

            clickComponent.onPointerDown.push((): void => {
                this.validateDefense(entity);
            });
        }
    }

    update(deltaTime: number): void {}

    validateDefense(entity: Entity): void {
        this.entityManger.removeEntity(entity);
    }
}