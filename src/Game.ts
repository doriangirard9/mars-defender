import * as PIXI from 'pixi.js';

import { ISystem, Entity } from "./ecsModels.ts";
import Vector2 from "./utils/Vector2.ts";
import EventManager from "./EventManager.ts";
import EntityManager from "./EntityManager.ts";

// components
import Transform from "./components/core/Transform.ts";
import Sprite from "./components/core/Sprite.ts";
import Text from "./components/core/Text.ts";
import Click from "./components/core/Click.ts";
import Tag from "./components/core/Tag.ts";

// systems
import SpriteRenderer from "./systems/core/SpriteRenderer.ts";
import TextRendererSystem from "./systems/core/TextRenderer.ts";
import ClickHandler from "./systems/core/ClickHandler.ts";
import CreateDefenseHandler from "./systems/defense/CreateDefenseHandler.ts";
import DragHandler from "./systems/core/DragHandler.ts";
import DragDefenseHandler from "./systems/defense/DragDefenseHandler.ts";
import LinkTransformHandler from "./systems/core/LinkTransformHandler.ts";
import ValidateDefenseHandler from "./systems/defense/ValidateDefenseHandler.ts";

export default class Game {
    private static instance: Game;

    // game variables
    systems: ISystem[] = [];
    eventManager: EventManager = EventManager.getInstance();
    entityManager: EntityManager = EntityManager.getInstance();

    // PIXI
    app!: PIXI.Application;

    lastTime: number = 0;

    private constructor() {}

    static getInstance(): Game {
        if (!Game.instance) {
            Game.instance = new Game();
        }

        return Game.instance;
    }

    start(): void {
        this.createApp();

        // create systems
        this.systems.push(new LinkTransformHandler());
        this.systems.push(new SpriteRenderer());
        this.systems.push(new TextRendererSystem());
        this.systems.push(new ClickHandler());
        this.systems.push(new CreateDefenseHandler());
        this.systems.push(new ValidateDefenseHandler());
        this.systems.push(new DragHandler());
        this.systems.push(new DragDefenseHandler());

        // create entities
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                const entity: Entity = new Entity();
                entity.addComponent(new Transform(entity, new Vector2(100 + i * 53, 100 + j * 53)));
                entity.addComponent(new Sprite(entity, PIXI.Sprite.from("img/marsGround.png"), new Vector2(0.2, 0.2)));
                this.entityManager.addEntity(entity);
            }
        }

        // create defense button
        const defenseButton: Entity = new Entity();
        defenseButton.addComponent(new Transform(defenseButton, new Vector2(100, 100)));
        defenseButton.addComponent(new Sprite(defenseButton, PIXI.Sprite.from("img/button.png"), new Vector2(0.05, 0.05)));
        defenseButton.addComponent(new Click(defenseButton));
        defenseButton.addComponent(new Tag(defenseButton, "buttonCreateDefense"));
        defenseButton.addComponent(new Text(defenseButton, new PIXI.Text("Create defense"), new Vector2(0.5, 0.5)));
        this.entityManager.addEntity(defenseButton);

        requestAnimationFrame(this.update.bind(this));
    }

    update(time: number): void {
        const deltaTime: number = this.getDeltaTime(time);

        // update systems
        this.systems.forEach((system: ISystem): void => {
            system.update(deltaTime);
        });

        requestAnimationFrame(this.update.bind(this));
    }

    createApp(): void {
        this.app = new PIXI.Application({
            width: 800,
            height: 600,
            backgroundColor: 0xaaaaaa
        });

        document.body.appendChild(this.app.view as HTMLCanvasElement);
    }

    getDeltaTime(time: number): number {
        if (this.lastTime === 0) {
            this.lastTime = time;
        }

        const deltaTime: number = (time - this.lastTime) / 1000;
        this.lastTime = time;

        return deltaTime;
    }
}