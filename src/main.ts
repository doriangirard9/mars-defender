import Game from "./Game.ts";

window.onload = (): void => {
    const game: Game = Game.getInstance();
    game.start();
}