import {Entity, ISystem} from "../../ecsModels.ts";
import * as PIXI from "pixi.js";
import Vector2 from "../../utils/Vector2.ts";
import EntityManager from "../../managers/EntityManager.ts";
import EventManager from "../../managers/EventManager.ts";
import {SpriteLayer, IDefense} from "../../models/models.ts";
import {getDefenseData} from "../../models/models.ts";

// components
import Click from "../../components/core/Click.ts";
import Tag from "../../components/core/Tag.ts";
import Sprite from "../../components/core/Sprite.ts";
import Transform from "../../components/core/Transform.ts";
import Parent from "../../components/core/Parent.ts";
import Text from "../../components/core/Text.ts";
import Game from "../../Game.ts";
import GameStates from "../../components/singletons/GameStates.ts";
import DefenseFactory from "../../managers/DefenseFactory.ts";

export default class CreateDefenseHandler implements ISystem {
    entityManager: EntityManager;
    eventManager: EventManager;

    constructor() {
        this.entityManager = EntityManager.getInstance();
        this.eventManager = EventManager.getInstance();
        this.subscribeToEvents();
    }

    subscribeToEvents(): void {
        this.eventManager.subscribe("OnCreateDefense", this.OnCreateDefense.bind(this));
    }

    update(deltaTime: number): void {}

    OnCreateDefense(type: string): void {
        const defenseData: IDefense = getDefenseData(type);
        if (!this.checkCanCreateDefense(defenseData)) {
            this.eventManager.notify("OnDisplayErrorMessage", "Not enough golds");
            return;
        }

        this.createDefense(defenseData);
    }

    checkCanCreateDefense(defenseType: IDefense): boolean {
        const gameStatesComponent: GameStates = GameStates.getInstance();
        if (gameStatesComponent.golds < defenseType.price) {
            return false;
        }
        return true;
    }

    createDefense(defenseData: IDefense): void {
        const defenseFactory: DefenseFactory = DefenseFactory.getInstance();
        const defense: Entity = defenseFactory.createDefense(defenseData);
        this.entityManager.addEntity(defense);

        const defenseBase: Entity = defenseFactory.createDefenseBase(defense);
        this.entityManager.addEntity(defenseBase);

        this.createValidationButton(defense);

        Game.getInstance().app.stage.sortChildren();
    }

    createValidationButton(defense: Entity): void {
        // defense validate button
        const defenseValidateButton: Entity = new Entity();
        defenseValidateButton.addComponent(new Tag(defenseValidateButton, "buttonValidateDefense"));
        defenseValidateButton.addComponent(
            new Transform(
                defenseValidateButton,
                new Vector2(0, 0)
            )
        );
        const text: PIXI.Text = new PIXI.Text("Validate");
        text.zIndex = SpriteLayer.UI;
        defenseValidateButton.addComponent(
            new Text(
                defenseValidateButton,
                text,
                new Vector2(0.4, 0.4)
            )
        );
        const buttonSprite: PIXI.Sprite = PIXI.Sprite.from("img/button.png");
        buttonSprite.zIndex = SpriteLayer.UI;
        defenseValidateButton.addComponent(
            new Sprite(
                defenseValidateButton,
                buttonSprite
            ),
        );
        defenseValidateButton.addComponent(
            new Parent(
                defenseValidateButton,
                defense,
                true,
                false,
                new Vector2(0, -70)
            )
        );
        defenseValidateButton.addComponent(new Click(defenseValidateButton));
        this.entityManager.addEntity(defenseValidateButton);
    }
}