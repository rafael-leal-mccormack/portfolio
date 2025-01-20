import { Boot } from "./scenes/Boot";
import { Game } from "./scenes/Game";
import { MainMenu } from "./scenes/MainMenu";
import Phaser from "phaser";
import { Preloader } from "./scenes/Preloader";
import Work from "./scenes/Work";
import Home from "./scenes/Home";
import Projects from "./scenes/Projects";

// Find out more information about the Game Config at:
// https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.NONE,
        parent: "game-container",
        width: 600,
        height: 400,
    },
    backgroundColor: "#028af8",
    autoFocus: true,
    render: {
        pixelArt: true,
        antialias: true,
        roundPixels: false,
    },
    scene: [Boot, Preloader, MainMenu, Game, Work, Home, Projects],
    physics: {
        default: "arcade",
        fps: 24,
        arcade: {
            gravity: { y: 0 }, // Top down game, so no gravity
        },
    },
    fps: {
        min: 24,
        target: 24,
        forceSetTimeOut: false,
        smoothStep: true,
    },
};

const StartGame = (parent) => {
    return new Phaser.Game({ ...config, parent });
};

export default StartGame;

