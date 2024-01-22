import {Entity, ISystem} from "../../ecsModels.ts";
import EntityManager from "../../managers/EntityManager.ts";
import EventManager from "../../managers/EventManager.ts";
import {getDefenseData, IDefense} from "../../models/models.ts";
import DefenseFactory from "../../managers/DefenseFactory.ts";

// components
import Defense from "../../components/Defense.ts";
import GameStates from "../../components/singletons/GameStates.ts";
import Game from "../../Game.ts";

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

        Game.getInstance().app.stage.sortChildren();
    }

    update(deltaTime: number): void {}
}