export default class EnemyWaves {
    private static instance: EnemyWaves;

    enemiesAlive!: number;
    enemiesToSpawn!: number;
    wave!: number;
    enemyStart!: number;
    enemyIncrease!: number;

    private constructor() {}

    static getInstance(): EnemyWaves {
        if (!EnemyWaves.instance) {
            EnemyWaves.instance = new EnemyWaves();
        }

        return EnemyWaves.instance;
    }
}