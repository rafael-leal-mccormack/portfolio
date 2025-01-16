import { EventBus } from "../EventBus";
import Phaser, { Scene } from "phaser";
import { Player } from "../objects/player";
import { createPlayerAnimations } from "../animations/PlayerAnimations";

export class Game extends Scene {
    constructor() {
        super("Game");
    }
    player;
    cursors;
    tooltip;
    worldLayer;
    camera;

    create() {
        const map = this.make.tilemap({ key: "map" });
        const spawnPoint = map.findObject(
            "Spawn",
            (obj) => obj.name === "Spawn"
        );

        const tileset = map.addTilesetImage("tuxmon-sample-32px", "tiles");

        // Parameters: layer name (or index) from Tiled, tileset, x, y
        const belowLayer = map.createLayer("Ground", tileset, 0, 0);
        belowLayer.setDepth(1);

        const worldLayer = map.createLayer("World", tileset, 0, 0);
        this.worldLayer = worldLayer;
        worldLayer.setDepth(2);

        const aboveLayer = map.createLayer("Roof", tileset, 0, 0);
        aboveLayer.setDepth(3);

        const interactionLayer = map.createLayer("Interactions", tileset, 0, 0);
        interactionLayer.setDepth(4);

        worldLayer.setCollisionByProperty({ collision: true });
        aboveLayer.setCollisionByProperty({ collision: true });
        interactionLayer.setCollisionByProperty({ interaction: true });

        this.player = new Player(spawnPoint.x, spawnPoint.y, this.physics);
        createPlayerAnimations(this.anims);

        this.player.addCollider(worldLayer);
        this.player.addCollider(aboveLayer);

        const debugGraphics = this.add.graphics().setAlpha(1).setDepth(10);

        // worldLayer.renderDebug(debugGraphics, {
        //     tileColor: null,
        //     collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
        //     faceColor: new Phaser.Display.Color(40, 39, 37, 255),
        // });

        // aboveLayer.renderDebug(debugGraphics, {
        //     tileColor: null,
        //     collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
        //     faceColor: new Phaser.Display.Color(40, 39, 37, 255),
        // });

        // interactionLayer.renderDebug(debugGraphics, {
        //     tileColor: "red",
        //     collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
        //     faceColor: new Phaser.Display.Color(40, 39, 37, 255),
        // });

        // Phaser supports multiple cameras, but you can access the default camera like this:
        const camera = this.cameras.main;
        this.camera = camera;

        // Set up the arrows to control the camera
        this.cursors = this.input.keyboard.createCursorKeys();
        this.controls = this.player.createControls(this.cursors);

        // Constrain the camera so that it isn't allowed to move outside the width/height of tilemap
        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        camera.centerOn(this.player.getX(), this.player.getY());

        // Help text that has a "fixed" position on the screen
        this.add
            .text(16, 16, "Arrow keys to scroll", {
                font: "18px monospace",
                fill: "#ffffff",
                padding: { x: 20, y: 10 },
                backgroundColor: "#000000",
            })
            .setScrollFactor(0);

        // Create animations once

        // Create tooltip text (hidden by default)
        this.tooltip = this.add
            .text(0, 0, "", {
                font: "16px monospace",
                fill: "#ffffff",
                padding: { x: 10, y: 5 },
                backgroundColor: "#000000",
                alpha: 0.8,
            })
            .setDepth(300)
            .setVisible(false);

        this.enterKey = this.input.keyboard.addKey("E");

        // Create overlap for door detection
        this.physics.add.overlap(
            this.player.getPlayer(),
            worldLayer,
            (player, tile) => {
                if (tile.properties.door) {
                    // Show tooltip above the player
                    this.tooltip.setVisible(true);
                    this.tooltip.setText("Press E to enter");
                    this.tooltip.setPosition(
                        player.x - this.tooltip.width / 2,
                        player.y - player.height - this.tooltip.height
                    );

                    if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
                        if (tile.properties.home) {
                            console.log("Loading home scene");
                            this.scene.start("Home");
                        } else if (tile.properties.work) {
                            console.log("Loading work scene");
                            this.scene.start("Work");
                        } else if (tile.properties.projects) {
                            console.log("Loading projects scene");
                            this.scene.start("Projects");
                        }
                    }
                }

                if (tile.properties.interaction) {
                    this.tooltip.setVisible(true);
                    this.tooltip.setText(tile.properties.text);
                    this.tooltip.setPosition(
                        player.x - this.tooltip.width / 2,
                        player.y - player.height - this.tooltip.height
                    );
                }
            },
            null,
            this
        );

        EventBus.emit("current-scene-ready", this);
    }

    update(time, delta) {
        this.controls.update(delta);

        this.player.setControls(this.cursors, this.camera);

        // Check if player is near any interactive objects
        const tile = this.worldLayer.getTileAtWorldXY(
            this.player.getX(),
            this.player.getY() + 8
        );
        if (!tile || (!tile.properties.door && !tile.properties.interaction)) {
            // Hide tooltip if not near a door
            this.tooltip.setVisible(false);
        }
    }

    changeScene() {
        this.scene.start("GameOver");
    }
}

