import {Entity} from "../ecsModels.ts";
import Vector2 from "../utils/Vector2.ts";
import * as PIXI from "pixi.js";
import {IEnemy} from "../models/models.ts";
import _enemyData from "../models/enemyData.json";
import {randomInt} from "../utils/random.ts";

// components
import GameStates from "../components/singletons/GameStates.ts";
import Transform from "../components/core/Transform.ts";
import Sprite from "../components/core/Sprite.ts";
import Enemy from "../components/Enemy.ts";
import Health from "../components/core/Health.ts";
import Children from "../components/core/Children.ts";

export default class EnemyFactory {
    private static instance: EnemyFactory;

    private constructor() {}

    createEnemy(random: number): Entity {
        if (random <= 0.5) {
            return this.createEnemyFromData(_enemyData.basic);
        }
        else if (random <= 0.7) {
            return this.createEnemyFromData(_enemyData.tank);
        }
        else if (random <= 0.85) {
            return this.createEnemyFromData(_enemyData.fast);
        }
        else {
            return this.createEnemyFromData(_enemyData.strong);
        }
    }

    createEnemyFromData(enemyData: IEnemy): Entity {
        const gameStatesComponent: GameStates = GameStates.getInstance();

        const enemy: Entity = new Entity();

        const randomSpawn: number = randomInt(0, 15);
        let spawn: Vector2;
        let enemySpawn: Vector2;
        if (randomSpawn <= 13) {
             spawn = gameStatesComponent.spawns[0];
            enemySpawn = new Vector2(
                spawn.y * gameStatesComponent.tileSize,
                spawn.x * gameStatesComponent.tileSize + gameStatesComponent.tileSize / 2
            );
        }
        else {
            spawn = gameStatesComponent.spawns[1];
            enemySpawn = new Vector2(
                spawn.y * gameStatesComponent.tileSize + gameStatesComponent.tileSize / 2,
                spawn.x * gameStatesComponent.tileSize
            );
        }

        enemy.addComponent(new Transform(enemy, enemySpawn));
        enemy.addComponent(new Sprite(enemy, PIXI.Sprite.from(enemyData.sprite), new Vector2(-0.12, 0.12)));
        enemy.addComponent(new Enemy(enemy, enemyData.name, spawn));
        enemy.addComponent(new Health(enemy, enemyData.health));
        enemy.addComponent(new Children(enemy));

        return enemy;
    }

    static getInstance(): EnemyFactory {
        if (!EnemyFactory.instance) {
            EnemyFactory.instance = new EnemyFactory();
        }

        return EnemyFactory.instance;
    }
}