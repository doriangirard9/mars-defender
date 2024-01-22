import Vector2 from "../../utils/Vector2.ts";

export default class GameStates {
    private static instance: GameStates;

    grid!: number[][];
    golds!: number;
    spawns: Vector2[] = [];
    base!: Vector2;
    tileSize!: number;

    private constructor() {}

    static getInstance(): GameStates {
        if (!GameStates.instance) {
            GameStates.instance = new GameStates();
        }

        return GameStates.instance;
    }
}