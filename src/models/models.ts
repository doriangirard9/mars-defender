import _defenseData from "./defenseData.json";
import _enemyData from "./enemyData.json";

export enum SpriteLayer {
    BACKGROUND,
    DEFAULT,
    FOREGROUND,
    UI,
    TEXT,
}

export interface IEnemy {
    name: string;
    sprite: string;
    damage: number;
    speed: number;
    health: number;
    reward: number;
}

export interface IDefense {
    name: string;
    sprite: string;
    price: number;
    damage: number;
    range: number;
    fireRate: number;
    firePoint: number;
    upgrade: string;
    sound: string;
    anchor: {
        "x": number,
        "y": number
    },
    laser: {
        muzzleFlash: string;
        width: number;
    }
}

export const getEnemyData = (type: string): IEnemy => {
    switch (type) {
        case "basic":
            return _enemyData.basic as IEnemy;
        case "fast":
            return _enemyData.fast as IEnemy;
        case "tank":
            return _enemyData.tank as IEnemy;
        case "strong":
            return _enemyData.strong as IEnemy;
        default:
            return _enemyData.basic as IEnemy;
    }
}

export const getDefenseData = (type: string): IDefense => {
    switch (type) {
        case "cannon":
            return _defenseData.cannon as IDefense;
        case "cannon2":
            return _defenseData.cannon2 as IDefense;
        case "machineGun":
            return _defenseData.machineGun as IDefense;
        case "machineGun2":
            return _defenseData.machineGun2 as IDefense;
        case "missileLauncher":
            return _defenseData.missileLauncher as IDefense;
        case "missileLauncher2":
            return _defenseData.missileLauncher2 as IDefense;
        default:
            return _defenseData.cannon as IDefense;
    }
}

export interface IGameData {
    golds: number;
    grid: number[][];
    spawns: {x: number, y: number}[];
    base: {x: number, y: number};
    tileSize: number;
    enemyStart: number;
    enemyIncrease: number;
}