import {Entity, ISystem} from "../../ecsModels.ts";
import EntityManager from "../../managers/EntityManager.ts";
import EventManager from "../../managers/EventManager.ts";
import {getDefenseData, IDefense} from "../../models/models.ts";
import DefenseFactory from "../../managers/DefenseFactory.ts";

// components
import Defense from "../../components/Defense.ts";
import GameStates from "../../components/singletons/GameStates.ts";
import Game from "../../Game.ts";
import Transform from "../../components/core/Transform.ts";
import LifeSpan from "../../components/core/LifeSpan.ts";
import * as PIXI from "pixi.js";
import Sprite from "../../components/core/Sprite.ts";
import SpriteBuilder from "../../managers/SpriteBuilder.ts";
import Vector2 from "../../utils/Vector2.ts";

export default class UpgradeDefenseHandler implements ISystem {
    entityManager: EntityManager;
    eventManager: EventManager;

    constructor() {
        this.entityManager = EntityManager.getInstance();
        this.eventManager = EventManager.getInstance();
        this.subscribeToEvents();
    }

    subscribeToEvents(): void {
        this.eventManager.subscribe("OnUpgradeDefense", this.OnUpgradeDefense.bind(this));
    }

    OnUpgradeDefense(defense: Entity): void {
        const defenseComponent: Defense = defense.getComponent("Defense") as Defense;
        const defenseData: IDefense = getDefenseData(defenseComponent.type);
        const defenseUpgradeData: IDefense = getDefenseData(defenseData.upgrade);

        if (!this.checkCanUpgradeDefense(defenseUpgradeData)) {
            this.eventManager.notify("OnDisplayErrorMessage", "Not enough golds");
            return;
        }

        this.eventManager.notify("OnUpdateGold", -defenseUpgradeData.price);
        this.upgradeDefense(defense, defenseUpgradeData);
    }

    checkCanUpgradeDefense(defenseData: IDefense): boolean {
        const gameStatesComponent: GameStates = GameStates.getInstance();
        if (gameStatesComponent.golds < defenseData.price) {
            return false;
        }
        return true;
    }

    upgradeDefense(defense: Entity, defenseData: IDefense): void {
        const defenseFactory: DefenseFactory = DefenseFactory.getInstance();

        const newDefense: Entity = defenseFactory.createUpgradedDefense(defenseData, defense);
        this.entityManager.removeEntity(defense);
        this.entityManager.addEntity(newDefense);

        const defenseBase: Entity = defenseFactory.createDefenseBase(newDefense);
        this.entityManager.addEntity(defenseBase);

        this.createAnimation(newDefense);

        Game.getInstance().app.stage.sortChildren();
    }

    createAnimation(defense: Entity): void {
        const defenseTransformComponent: Transform = defense.getComponent("Transform") as Transform;

        const animation: Entity = new Entity();
        animation.addComponent(new Transform(animation, defenseTransformComponent.position));
        animation.addComponent(new LifeSpan(animation, 500));
        let frames: string[] = [];
        for (let i: number = 0; i < 20; i++) {
            frames.push(`img/animations/shield2/${i}.png`);
        }
        let animationSprite: PIXI.AnimatedSprite = PIXI.AnimatedSprite.fromFrames(frames);
        animationSprite.animationSpeed = 0.2;
        const sprite: Sprite = new SpriteBuilder()
            .addSprite(animationSprite)
            .addEntity(animation)
            .addAnchor(new Vector2(0.5, 0.5))
            .addScale(new Vector2(0.2, 0.2))
            .build();
        animation.addComponent(sprite);
        this.entityManager.addEntity(animation);
        animationSprite.play();
    }

    update(deltaTime: number): void {}
}