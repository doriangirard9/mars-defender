import {Entity, ISystem} from "../../ecsModels.ts";
import EntityManager from "../../managers/EntityManager.ts";
import EventManager from "../../managers/EventManager.ts";
import Vector2 from "../../utils/Vector2.ts";
import * as PIXI from "pixi.js";
import {getDefenseData, IDefense} from "../../models/models.ts";

// components
import Tag from "../../components/core/Tag.ts";
import Click from "../../components/core/Click.ts";
import Transform from "../../components/core/Transform.ts";
import Parent from "../../components/core/Parent.ts";
import Text from "../../components/core/Text.ts";
import Sprite from "../../components/core/Sprite.ts";
import Defense from "../../components/Defense.ts";
import Children from "../../components/core/Children.ts";

export default class ClickDefenseHandler implements ISystem {
    entityManager: EntityManager;
    eventManager: EventManager;

    constructor() {
        this.entityManager = EntityManager.getInstance();
        this.eventManager = EventManager.getInstance();
        this.subscribeToEvents();
    }

    subscribeToEvents(): void {
        this.eventManager.subscribe("OnNewEntity", this.OnNewEntity.bind(this));
    }

    OnNewEntity(entity: Entity): void {
        if (entity.hasComponents(["Tag", "Click", "Defense"])) {
            const tagComponent: Tag = entity.getComponent("Tag") as Tag;
            const clickComponent: Click = entity.getComponent("Click") as Click;
            const defenseComponent: Defense = entity.getComponent("Defense") as Defense;

            if (tagComponent.tag !== "defense") {
                return;
            }

            clickComponent.onPointerDown.push((): void => {
                this.showDefenseInfo(entity, defenseComponent);
            });
        }
    }

    update(deltaTime: number): void {}

    showDefenseInfo(entity: Entity, defenseComponent: Defense): void {
        if (defenseComponent.isUIActive) {
            this.deleteDefenseInfoUI(entity);
            defenseComponent.isUIActive = false;
            return;
        }

        const defenseData: IDefense = getDefenseData(defenseComponent.type);
        this.createDefenseInfoUI(entity, defenseData);
        defenseComponent.isUIActive = true;
    }

    createDefenseInfoUI(defense: Entity, defenseData: IDefense): void {
        const defenseUI: Entity = new Entity();
        defenseUI.addComponent(new Tag(defenseUI, "defenseUI"));
        defenseUI.addComponent(new Transform(defenseUI, new Vector2(0, 0)));
        defenseUI.addComponent(new Parent(defenseUI, defense, true, false, new Vector2(0, -130)));
        defenseUI.addComponent(new Children(defenseUI));
        defenseUI.addComponent(
            new Sprite(
                defenseUI,
                PIXI.Sprite.from("img/container.png"),
                new Vector2(0.3, 0.3)
            )
        )
        this.entityManager.addEntity(defenseUI);

        // create damage text
        const damageText: Entity = new Entity();
        damageText.addComponent(new Transform(damageText));
        damageText.addComponent(new Parent(damageText, defenseUI, true, false, new Vector2(0, -33)));
        damageText.addComponent(new Text(damageText, new PIXI.Text(defenseData.damage), new Vector2(0.5, 0.5)));
        this.entityManager.addEntity(damageText);

        // create damage icon
        const damageIcon: Entity = new Entity();
        damageIcon.addComponent(new Transform(damageIcon));
        damageIcon.addComponent(new Parent(damageIcon, defenseUI, true, false, new Vector2(-25, -33)));
        damageIcon.addComponent(new Sprite(damageIcon, PIXI.Sprite.from("img/icons/damage.png"), new Vector2(0.5, 0.5)));
        this.entityManager.addEntity(damageIcon);

        // create fire rate text
        const fireRateText: Entity = new Entity();
        fireRateText.addComponent(new Transform(fireRateText));
        fireRateText.addComponent(new Parent(fireRateText, defenseUI, true, false, new Vector2(0, 0)));
        fireRateText.addComponent(new Text(fireRateText, new PIXI.Text(defenseData.fireRate), new Vector2(0.5, 0.5)));
        this.entityManager.addEntity(fireRateText);

        // create fire rate icon
        const fireRateIcon: Entity = new Entity();
        fireRateIcon.addComponent(new Transform(fireRateIcon));
        fireRateIcon.addComponent(new Parent(fireRateIcon, defenseUI, true, false, new Vector2(-25, 0)));
        fireRateIcon.addComponent(new Sprite(fireRateIcon, PIXI.Sprite.from("img/icons/fireRate.png"), new Vector2(0.5, 0.5)));
        this.entityManager.addEntity(fireRateIcon);

        // create range text
        const rangeText: Entity = new Entity();
        rangeText.addComponent(new Transform(rangeText));
        rangeText.addComponent(new Parent(rangeText, defenseUI, true, false, new Vector2(0, 33)));
        rangeText.addComponent(new Text(rangeText, new PIXI.Text(defenseData.range), new Vector2(0.5, 0.5)));
        this.entityManager.addEntity(rangeText);

        // create range icon
        const rangeIcon: Entity = new Entity();
        rangeIcon.addComponent(new Transform(rangeIcon));
        rangeIcon.addComponent(new Parent(rangeIcon, defenseUI, true, false, new Vector2(-25, 33)));
        rangeIcon.addComponent(new Sprite(rangeIcon, PIXI.Sprite.from("img/icons/range.png"), new Vector2(0.5, 0.5)));
        this.entityManager.addEntity(rangeIcon);

        const upgradeData: IDefense = getDefenseData(defenseData.upgrade);

        // create upgrade button
        const upgradeButton: Entity = new Entity();
        upgradeButton.addComponent(new Tag(upgradeButton, "upgradeButton"));
        upgradeButton.addComponent(new Transform(upgradeButton));
        upgradeButton.addComponent(new Parent(upgradeButton, defenseUI, true, false, new Vector2(0, 72)));
        upgradeButton.addComponent(new Sprite(upgradeButton, PIXI.Sprite.from("img/button.png"), new Vector2(0.9, 0.8)));

        if (defenseData.upgrade !== "none") {

            upgradeButton.addComponent(new Click(upgradeButton));
            upgradeButton.addComponent(new Text(upgradeButton, new PIXI.Text(upgradeData.price), new Vector2(0.5, 0.5)));
            this.entityManager.addEntity(upgradeButton);

            const clickComponent: Click = upgradeButton.getComponent("Click") as Click;
            clickComponent.onPointerDown.push((): void => {
                this.eventManager.notify("OnUpgradeDefense", defense);
            });

            // create upgrade icon
            const upgradeIcon: Entity = new Entity();
            upgradeIcon.addComponent(new Transform(upgradeIcon));
            upgradeIcon.addComponent(new Parent(upgradeIcon, defenseUI, true, false, new Vector2(-25, 72)));
            upgradeIcon.addComponent(new Sprite(upgradeIcon, PIXI.Sprite.from("img/coins.png"), new Vector2(0.5, 0.5)));
            this.entityManager.addEntity(upgradeIcon);
        }
        else {
            upgradeButton.addComponent(new Text(upgradeButton, new PIXI.Text("no upgrade"), new Vector2(0.5, 0.5)));
            this.entityManager.addEntity(upgradeButton);
        }
    }

    deleteDefenseInfoUI(defense: Entity): void {
        const childrenComponent: Children = defense.getComponent("Children") as Children;

        for (let i: number = childrenComponent.children.length - 1; i >= 0; i--) {
            const child: Entity = childrenComponent.children[i];

            if (!child.hasComponents(["Tag"])) {
                continue;
            }

            const tagComponent: Tag = child.getComponent("Tag") as Tag;
            if (tagComponent.tag === "defenseUI") {
                // delete defenseUI
                this.entityManager.removeEntity(child);
                childrenComponent.children.splice(i, 1);
            }
        }
    }
}