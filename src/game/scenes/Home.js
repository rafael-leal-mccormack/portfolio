import Phaser, { Scene } from "phaser";
import { Player } from "../objects/player";
import { createPlayerAnimations } from "../animations/PlayerAnimations";

export class Home extends Scene {
    constructor() {
        super("Home");
    }

    preload() {
        // Load assets here (images, sprites, audio, etc.)
    }

    create() {
        // create map
        const map = this.make.tilemap({ key: "homeMap" });

        // set tileset
        const tileset = map.addTilesetImage("interiorTiles", "interiorTiles");

        if (!tileset) {
            console.error("Failed to load tileset - check names match!");
        }

        // create layers
        const homeLayer = map.createLayer("Background", tileset, 0, 0);
        homeLayer.setDepth(0);

        const groundLayer = map.createLayer("Ground", tileset, 0, 0);
        groundLayer.setDepth(1);

        groundLayer.setCollisionByProperty({ collision: true });
        groundLayer.setCollisionFromCollisionGroup();

        // create player
        const spawnPoint = map.findObject("Spawn", (obj) => obj);
        this.player = new Player(spawnPoint.x, spawnPoint.y, this.physics);
        this.player.getPlayer().setScale(0.5);
        createPlayerAnimations(this.anims);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.controls = this.player.createControls(this.cursors);
        this.player.addCollider(groundLayer);

        // create camera
        const camera = this.cameras.main;
        this.camera = camera;
        this.camera.setZoom(2);
        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        camera.centerOn(this.player.getX(), this.player.getY());

        // create debug graphics
        const debugGraphics = this.add.graphics().setAlpha(0.75).setDepth(10);

        groundLayer.renderDebug(debugGraphics, {
            tileColor: null,
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
            faceColor: new Phaser.Display.Color(40, 39, 37, 255),
            showCollisionObjects: true,
        });

        const outside = map.findObject("Interactions", (obj) => obj.name === "outside");
        if (outside) {
            const outsideZone = this.add.zone(outside.x, outside.y, outside.width, outside.height);
            this.physics.world.enable(outsideZone);
            this.physics.add.overlap(this.player.getPlayer(), outsideZone, () => {
                this.scene.start('Game', {
                    spawn: 'Spawn'
                });
            });
        }
    }

    update(time, delta) {
        this.controls.update(delta);
        this.player.setControls(this.cursors, this.camera);

        // Game loop, runs continuously
    }
}

export default Home;

