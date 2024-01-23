import {Entity, ISystem} from "../../ecsModels.ts";
import * as PIXI from "pixi.js";
import Game from "../../Game.ts";
import EntityManager from "../../managers/EntityManager.ts";
import EventManager from "../../managers/EventManager.ts";
import SpriteBuilder from "../../managers/SpriteBuilder.ts";

// components
import Click from "../../components/core/Click.ts";
import Tag from "../../components/core/Tag.ts";
import Parent from "../../components/core/Parent.ts";
import Drag from "../../components/core/Drag.ts";
import Defense from "../../components/Defense.ts";
import GameStates from "../../components/singletons/GameStates.ts";
import Transform from "../../components/core/Transform.ts";
import {getDefenseData, IDefense} from "../../models/models.ts";
import Sprite from "../../components/core/Sprite.ts";
import Vector2 from "../../utils/Vector2.ts";
import LifeSpan from "../../components/core/LifeSpan.ts";

export default class ValidateDefenseHandler implements ISystem {
    entityManager: EntityManager;
    eventManager: EventManager;
    app: PIXI.Application;

    constructor() {
        this.entityManager = EntityManager.getInstance();
        this.eventManager = EventManager.getInstance();
        this.app = Game.getInstance().app;
        this.subscribeToEvents();
    }

    subscribeToEvents(): void {
        this.eventManager.subscribe("OnNewEntity", this.OnNewEntity.bind(this));
    }

    OnNewEntity(entity: Entity): void {
        if (entity.hasComponents(["Tag", "Click", "Parent"])) {
            const tagComponent: Tag = entity.getComponent("Tag") as Tag;
            const clickComponent: Click = entity.getComponent("Click") as Click;
            const parentComponent: Parent = entity.getComponent("Parent") as Parent;

            if (tagComponent.tag !== "buttonValidateDefense") {
                return;
            }

            clickComponent.onPointerDown.push((): void => {
                this.OnPointerDown(entity, parentComponent);
            });
        }
    }

    update(deltaTime: number): void {}

    OnPointerDown(entity: Entity, parentComponent: Parent): void {
        const defense: Entity = parentComponent.parent;
        const defenseTransformComponent: Transform = defense.getComponent("Transform") as Transform;
        const gameStatesComponent: GameStates = GameStates.getInstance();

        if (!this.checkCanValidateDefense(defenseTransformComponent, gameStatesComponent)) {
            this.eventManager.notify("OnDisplayErrorMessage", "Can't place here");
            return;
        }

        const x: number = (defenseTransformComponent.position.x - gameStatesComponent.tileSize / 2) / gameStatesComponent.tileSize;
        const y: number = (defenseTransformComponent.position.y - gameStatesComponent.tileSize / 2) / gameStatesComponent.tileSize;
        gameStatesComponent.grid[y][x] = 2;
        this.validateDefense(entity, defense);
        this.createAnimation(defense);
    }

    checkCanValidateDefense(transformComponent: Transform, gameStatesComponent: GameStates): boolean {
        const x: number = (transformComponent.position.x - gameStatesComponent.tileSize / 2) / gameStatesComponent.tileSize;
        const y: number = (transformComponent.position.y - gameStatesComponent.tileSize / 2) / gameStatesComponent.tileSize;
        if (gameStatesComponent.grid[y][x] !== 0) {
            return false;
        }
        return true;
    }

    validateDefense(entity: Entity, defense: Entity): void {
        const defenseDragComponent: Drag = defense.getComponent("Drag") as Drag;
        const defenseClickComponent: Click = defense.getComponent("Click") as Click;
        const defenseComponent: Defense = defense.getComponent("Defense") as Defense;
        const defenseData: IDefense = getDefenseData(defenseComponent.type);

        this.eventManager.notify("OnUpdateGold", -defenseData.price);

        defenseDragComponent.isEnable = false;
        defenseClickComponent.isEnable = true;
        defenseComponent.isPlaced = true;

        this.entityManager.removeEntity(entity);
    }

    createAnimation(defense: Entity): void {
        const defenseTransformComponent: Transform = defense.getComponent("Transform") as Transform;

        const animation: Entity = new Entity();
        animation.addComponent(new Transform(animation, defenseTransformComponent.position));
        animation.addComponent(new LifeSpan(animation, 500));
        let frames: string[] = [];
        for (let i: number = 0; i < 11; i++) {
            frames.push(`img/animations/shield/0${i}.png`);
        }
        let animationSprite: PIXI.AnimatedSprite = PIXI.AnimatedSprite.fromFrames(frames);
        animationSprite.animationSpeed = 0.2;
        const sprite: Sprite = new SpriteBuilder()
            .addSprite(animationSprite)
            .addEntity(animation)
            .addAnchor(new Vector2(0.5, 0.5))
            .addScale(new Vector2(0.3, 0.3))
            .build();
        animation.addComponent(sprite);
        this.entityManager.addEntity(animation);
        animationSprite.play();
    }
}