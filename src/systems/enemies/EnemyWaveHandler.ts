import {Entity, ISystem} from "../../ecsModels.ts";
import EventManager from "../../managers/EventManager.ts";
import EntityManager from "../../managers/EntityManager.ts";
import Vector2 from "../../utils/Vector2.ts";
import * as PIXI from "pixi.js";
import {randomFloat, randomInt} from "../../utils/random.ts";
import EnemyFactory from "../../managers/EnemyFactory.ts";

// components
import EnemyWaves from "../../components/singletons/EnemyWaves.ts";
import Transform from "../../components/core/Transform.ts";
import Sprite from "../../components/core/Sprite.ts";
import Parent from "../../components/core/Parent.ts";
import Tag from "../../components/core/Tag.ts";

export default class EnemyWaveHandler implements ISystem {
    eventManager: EventManager;
    entityManager: EntityManager;

    constructor() {
        this.eventManager = EventManager.getInstance();
        this.entityManager = EntityManager.getInstance();
        this.subscribeToEvents();
    }

    subscribeToEvents(): void {
        this.eventManager.subscribe("OnWaveStart", this.startWave.bind(this));
        this.eventManager.subscribe("OnEnemyDeath", this.OnEnemyDeath.bind(this));
    }

    OnEnemyDeath(): void {
        const enemyWavesComponent: EnemyWaves = EnemyWaves.getInstance();
        enemyWavesComponent.enemiesAlive--;
        if (enemyWavesComponent.enemiesAlive === 0) {
            setTimeout(this.startWave.bind(this), 1000);
        }
    }

    startWave(): void {
        const enemyWavesComponent: EnemyWaves = EnemyWaves.getInstance();

        enemyWavesComponent.enemiesToSpawn = enemyWavesComponent.enemyStart + enemyWavesComponent.wave * enemyWavesComponent.enemyIncrease;
        enemyWavesComponent.enemiesAlive = 0;
        enemyWavesComponent.wave++;
        this.eventManager.notify("OnUpdateWaveText", enemyWavesComponent.wave);

        this.eventManager.notify("OnDisplayMessage", `Wave ${enemyWavesComponent.wave}`);

        setTimeout(this.enemySpawnLoop.bind(this), 3000);
    }

    enemySpawnLoop(): void {
        const enemyWavesComponent: EnemyWaves = EnemyWaves.getInstance();

        if (enemyWavesComponent.enemiesToSpawn > 0) {
            const randomEnemy: number = randomFloat(0, 1);
            this.createEnemy(randomEnemy);

            enemyWavesComponent.enemiesAlive++;
            enemyWavesComponent.enemiesToSpawn--;

            const randomDelay: number = randomInt(500, 1500);
            setTimeout(this.enemySpawnLoop.bind(this), randomDelay);
        }
    }

    createEnemy(randomEnemy: number): void {
        const enemyFactory: EnemyFactory = EnemyFactory.getInstance();
        const enemy: Entity = enemyFactory.createEnemy(randomEnemy);
        this.entityManager.addEntity(enemy);

        // enemy health bar
        const enemyBarBackground: Entity = new Entity();
        enemyBarBackground.addComponent(new Transform(enemyBarBackground));
        enemyBarBackground.addComponent(
            new Sprite(
                enemyBarBackground,
                PIXI.Sprite.from("img/barBackground.png"),
                new Vector2(0.05, 0.05),
            )
        );
        enemyBarBackground.addComponent(
            new Parent(
                enemyBarBackground,
                enemy,
                true,
                false,
                new Vector2(0, -30)
            )
        );
        this.entityManager.addEntity(enemyBarBackground);
        const enemyBar: Entity = new Entity();
        enemyBar.addComponent(new Transform(enemyBar));
        enemyBar.addComponent(new Tag(enemyBar, "enemyHealthBar"));
        enemyBar.addComponent(
            new Sprite(
                enemyBar,
                PIXI.Sprite.from("img/redBar.png"),
                new Vector2(0.05, 0.05),
                new Vector2(0, 0.5),
            )
        );
        enemyBar.addComponent(
            new Parent(
                enemyBar,
                enemy,
                true,
                false,
                new Vector2(-25, -30)
            )
        );
        this.entityManager.addEntity(enemyBar);
    }

    update(deltaTime: number): void {}
}