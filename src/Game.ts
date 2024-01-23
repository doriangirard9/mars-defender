import * as PIXI from 'pixi.js';
import { ISystem, Entity } from "./ecsModels.ts";
import Vector2 from "./utils/Vector2.ts";
import EventManager from "./managers/EventManager.ts";
import EntityManager from "./managers/EntityManager.ts";
import _gameData from "./models/gameData.json";
import SpriteBuilder from "./managers/SpriteBuilder.ts";
import {IGameData} from "./models/models.ts";
import {Howl} from "howler";

// components
import GameStates from "./components/singletons/GameStates.ts";
import Transform from "./components/core/Transform.ts";
import Sprite from "./components/core/Sprite.ts";
import Text from "./components/core/Text.ts";
import Click from "./components/core/Click.ts";
import Tag from "./components/core/Tag.ts";
import Health from "./components/core/Health.ts";
import Shape from "./components/core/Shape.ts";

// systems
import SpriteRenderer from "./systems/core/rendering/SpriteRenderer.ts";
import TextRendererSystem from "./systems/core/rendering/TextRenderer.ts";
import ClickHandler from "./systems/core/ClickHandler.ts";
import CreateDefenseHandler from "./systems/defense/CreateDefenseHandler.ts";
import DragHandler from "./systems/core/DragHandler.ts";
import HoverHandler from "./systems/core/HoverHandler.ts";
import DragDefenseHandler from "./systems/defense/DragDefenseHandler.ts";
import ParentHandler from "./systems/core/ParentHandler.ts";
import ValidateDefenseHandler from "./systems/defense/ValidateDefenseHandler.ts";
import ClickDefenseHandler from "./systems/defense/ClickDefenseHandler.ts";
import SpriteDestroyHandler from "./systems/core/destroy/SpriteDestroyHandler.ts";
import TextDestroyHandler from "./systems/core/destroy/TextDestroyHandler.ts";
import ChildrenDestroyHandler from "./systems/core/destroy/ChildrenDestroyHandler.ts";
import EnemyMovementHandler from "./systems/enemies/EnemyMovementHandler.ts";
import ShootingHandler from "./systems/defense/ShootingHandler.ts";
import HealthHandler from "./systems/core/HealthHandler.ts";
import EnemyDeathHandler from "./systems/enemies/EnemyDeathHandler.ts";
import EnemyHealthBar from "./systems/enemies/EnemyHealthBar.ts";
import ShapeRenderer from "./systems/core/rendering/ShapeRenderer.ts";
import ShapeDestroyHandler from "./systems/core/destroy/ShapeDestroyHandler.ts";
import LifeSpanHandler from "./systems/core/LifeSpanHandler.ts";
import GoldTextHandler from "./systems/gameStates/GoldTextHandler.ts";
import GameHealthHandler from "./systems/gameStates/GameHealthHandler.ts";
import DisplayMessageHandler from "./systems/core/DisplayMessageHandler.ts";
import EnemyWaveHandler from "./systems/enemies/EnemyWaveHandler.ts";
import EnemyWaves from "./components/singletons/EnemyWaves.ts";
import WaveTextHandler from "./systems/gameStates/WaveTextHandler.ts";
import HoverDefenseHandler from "./systems/defense/HoverDefenseHandler.ts";
import CreateDefenseButtonHandler from "./systems/gameStates/CreateDefenseButtonHandler.ts";
import UpgradeDefenseHandler from "./systems/defense/UpgradeDefenseHandler.ts";
import PortalHandler from "./systems/gameStates/PortalHandler.ts";
import Parent from "./components/core/Parent.ts";
import Children from "./components/core/Children.ts";

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
        new Howl({
            src: ["audio/backgroundMusic.wav"],
            loop: true,
            volume: 0.1
        }).play();

        this.createApp();

        // create systems
        this.systems.push(new ParentHandler());
        this.systems.push(new SpriteRenderer());
        this.systems.push(new TextRendererSystem());
        this.systems.push(new ClickHandler());
        this.systems.push(new CreateDefenseHandler());
        this.systems.push(new ValidateDefenseHandler());
        this.systems.push(new DragHandler());
        this.systems.push(new HoverHandler());
        this.systems.push(new DragDefenseHandler());
        this.systems.push(new ClickDefenseHandler());
        this.systems.push(new SpriteDestroyHandler());
        this.systems.push(new TextDestroyHandler());
        this.systems.push(new ChildrenDestroyHandler());
        this.systems.push(new EnemyMovementHandler());
        this.systems.push(new ShootingHandler());
        this.systems.push(new HealthHandler());
        this.systems.push(new EnemyDeathHandler());
        this.systems.push(new EnemyHealthBar());
        this.systems.push(new ShapeRenderer());
        this.systems.push(new ShapeDestroyHandler());
        this.systems.push(new LifeSpanHandler());
        this.systems.push(new GoldTextHandler());
        this.systems.push(new GameHealthHandler());
        this.systems.push(new DisplayMessageHandler());
        this.systems.push(new EnemyWaveHandler());
        this.systems.push(new WaveTextHandler());
        this.systems.push(new HoverDefenseHandler());
        this.systems.push(new CreateDefenseButtonHandler());
        this.systems.push(new UpgradeDefenseHandler());
        this.systems.push(new PortalHandler());

        this.initScene();

        this.eventManager.subscribe("OnGameOver", this.OnGameOver.bind(this));

        const entity: Entity = new Entity();
        entity.addComponent(new Transform(entity, new Vector2(-300, 0)));
        const backgroundSprite: Sprite = new SpriteBuilder()
            .addEntity(entity)
            .addSprite(PIXI.Sprite.from("img/marsBackground.jpeg"))
            .addScale(new Vector2(4, 3))
            .addAnchor(new Vector2(0, 0))
            .build();
        entity.addComponent(backgroundSprite);
        this.entityManager.addEntity(entity);

        // create path tiles
        const tile: Entity = new Entity();
        const tileGraphics: PIXI.Graphics = new PIXI.Graphics();
        const gameStatesComponent: GameStates = GameStates.getInstance();
        gameStatesComponent.grid.forEach((row: number[], rowIndex: number): void => {
            row.forEach((col: number, colIndex: number): void => {
                if (col === 1) {
                    tileGraphics.beginFill(0xc97208, 0.3);
                    tileGraphics.drawRect(
                        colIndex * gameStatesComponent.tileSize,
                        rowIndex * gameStatesComponent.tileSize,
                        gameStatesComponent.tileSize,
                        gameStatesComponent.tileSize
                    );
                    tileGraphics.endFill();
                }
                else {
                    tileGraphics.beginFill(0x000000, 0.2);
                    tileGraphics.drawRect(
                        colIndex * gameStatesComponent.tileSize,
                        rowIndex * gameStatesComponent.tileSize,
                        gameStatesComponent.tileSize,
                        gameStatesComponent.tileSize
                    );
                    tileGraphics.endFill();
                }
            });
        });
        tile.addComponent(new Shape(tile, tileGraphics));
        this.entityManager.addEntity(tile);

        // create portals
        gameStatesComponent.spawns.forEach((spawn: Vector2): void => {
            const portal: Entity = new Entity();
            const portalPosition: Vector2 = new Vector2(
                spawn.y * gameStatesComponent.tileSize + gameStatesComponent.tileSize / 2,
                spawn.x * gameStatesComponent.tileSize + gameStatesComponent.tileSize / 2
            );
            portal.addComponent(new Transform(portal, portalPosition));
            portal.addComponent(new Tag(portal, "portal"));
            const portalSprite: Sprite = new SpriteBuilder()
                .addEntity(portal)
                .addSprite(PIXI.Sprite.from("img/portal.png"))
                .addScale(new Vector2(0.2, 0.2))
                .addAnchor(new Vector2(0.5, 0.5))
                .build();
            portal.addComponent(portalSprite);
            this.entityManager.addEntity(portal);
        });

        // create base
        const base: Entity = new Entity();
        const basePosition: Vector2 = new Vector2(
            gameStatesComponent.base.y * gameStatesComponent.tileSize + gameStatesComponent.tileSize / 2,
            gameStatesComponent.base.x * gameStatesComponent.tileSize + gameStatesComponent.tileSize / 2
        );
        base.addComponent(new Transform(base, basePosition));
        base.addComponent(new Children(base));
        const baseSprite: Sprite = new SpriteBuilder()
            .addEntity(base)
            .addSprite(PIXI.Sprite.from("img/dome.png"))
            .addScale(new Vector2(0.15, 0.2))
            .addAnchor(new Vector2(0.5, 0.5))
            .build();
        base.addComponent(baseSprite);
        this.entityManager.addEntity(base);

        // create base text
        const baseText: Entity = new Entity();
        baseText.addComponent(new Transform(baseText, new Vector2(0, 0)));
        baseText.addComponent(new Parent(baseText, base, true, false, new Vector2(0, -40)))
        baseText.addComponent(new Text(baseText, new PIXI.Text("Base"), new Vector2(0.7, 0.7)));
        this.entityManager.addEntity(baseText);

        // create gold panel
        const goldPanel: Entity = new Entity();
        goldPanel.addComponent(new Transform(goldPanel, new Vector2(1080, 30)));
        goldPanel.addComponent(
            new Sprite(
                goldPanel,
                PIXI.Sprite.from("img/panel.png"),
                new Vector2(1.2, 1)
            )
        );
        this.entityManager.addEntity(goldPanel);

        // create gold icon
        const goldIcon: Entity = new Entity();
        goldIcon.addComponent(new Transform(goldIcon, new Vector2(1050, 30)));
        goldIcon.addComponent(
            new Sprite(
                goldIcon,
                PIXI.Sprite.from("img/coins.png"),
                new Vector2(0.5, 0.5)
            )
        );
        this.entityManager.addEntity(goldIcon);

        // create gold text
        const goldText: Entity = new Entity();
        goldText.addComponent(new Transform(goldText, new Vector2(1090, 30)));
        goldText.addComponent(new Text(goldText, new PIXI.Text("0"), new Vector2(0.7, 0.7)));
        goldText.addComponent(new Tag(goldText, "goldText"));
        this.entityManager.addEntity(goldText);

        // create health panel
        const healthPanel: Entity = new Entity();
        healthPanel.addComponent(new Transform(healthPanel, new Vector2(1080, 80)));
        healthPanel.addComponent(
            new Sprite(
                healthPanel,
                PIXI.Sprite.from("img/panel.png"),
                new Vector2(1.2, 1)
            )
        );
        this.entityManager.addEntity(healthPanel);

        // create health icon
        const healthIcon: Entity = new Entity();
        healthIcon.addComponent(new Transform(healthIcon, new Vector2(1050, 80)));
        healthIcon.addComponent(
            new Sprite(
                healthIcon,
                PIXI.Sprite.from("img/health.png"),
                new Vector2(0.5, 0.5)
            )
        );
        this.entityManager.addEntity(healthIcon);

        // create health text
        const healthText: Entity = new Entity();
        healthText.addComponent(new Transform(healthText, new Vector2(1090, 80)));
        healthText.addComponent(new Text(healthText, new PIXI.Text("100"), new Vector2(0.7, 0.7)));
        healthText.addComponent(new Health(healthText, 100));
        healthText.addComponent(new Tag(healthText, "gameHealth"));
        this.entityManager.addEntity(healthText);

        // create wave panel
        const wavePanel: Entity = new Entity();
        wavePanel.addComponent(new Transform(wavePanel, new Vector2(1080, 130)));
        wavePanel.addComponent(
            new Sprite(
                wavePanel,
                PIXI.Sprite.from("img/panel.png"),
                new Vector2(1.2, 1)
            )
        );
        this.entityManager.addEntity(wavePanel);

        // create wave icon
        const waveIcon: Entity = new Entity();
        waveIcon.addComponent(new Transform(waveIcon, new Vector2(1050, 130)));
        waveIcon.addComponent(
            new Sprite(
                waveIcon,
                PIXI.Sprite.from("img/level.png"),
                new Vector2(0.5, 0.5)
            )
        );
        this.entityManager.addEntity(waveIcon);

        // create wave text
        const waveText: Entity = new Entity();
        waveText.addComponent(new Transform(waveText, new Vector2(1090, 130)));
        waveText.addComponent(new Text(waveText, new PIXI.Text("0"), new Vector2(0.7, 0.7)));
        waveText.addComponent(new Tag(waveText, "waveText"));
        this.entityManager.addEntity(waveText);

        // create defense button
        const defenseButton: Entity = new Entity();
        defenseButton.addComponent(new Transform(defenseButton, new Vector2(70, 30)));
        defenseButton.addComponent(new Sprite(defenseButton, PIXI.Sprite.from("img/button.png"), new Vector2(1.1, 1.2)));
        defenseButton.addComponent(new Click(defenseButton));
        defenseButton.addComponent(new Tag(defenseButton, "buttonCreateDefense"));
        defenseButton.addComponent(new Text(defenseButton, new PIXI.Text("Create defense"), new Vector2(0.6, 0.6)));
        this.entityManager.addEntity(defenseButton);

        setTimeout((): void => {
            this.eventManager.notify("OnWaveStart");
        }, 5000);

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
            width: 1140,
            height: 780,
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

    initScene(): void {
        // @ts-ignore
        const gameData: IGameData = _gameData as IGameData;

        const gameStatesComponent: GameStates = GameStates.getInstance();
        gameStatesComponent.golds = gameData.golds;
        gameStatesComponent.grid = gameData.grid;
        gameData.spawns.forEach((spawn: { x: number, y: number }): void => {
            gameStatesComponent.spawns.push(new Vector2(spawn.x, spawn.y));
        });
        gameStatesComponent.base = new Vector2(gameData.base.x, gameData.base.y);
        gameStatesComponent.tileSize = gameData.tileSize;

        const enemyWaves: EnemyWaves = EnemyWaves.getInstance();
        enemyWaves.enemyStart = gameData.enemyStart;
        enemyWaves.enemyIncrease = gameData.enemyIncrease;
        enemyWaves.wave = 0;
    }

    OnGameOver(): void {
        this.eventManager.notify("OnDisplayMessage", "Game Over");
        this.clearScene();
    }

    clearScene(): void {
        this.systems = [];
        this.entityManager.deleteAllEntities();
        this.eventManager.deleteAllListeners();
    }
}