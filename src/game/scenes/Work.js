import Phaser, { Scene } from "phaser";
import { Player } from "../objects/player";
import { createPlayerAnimations } from "../animations/PlayerAnimations";

export class Work extends Scene {
    constructor() {
        super("Work");
    }

    preload() {
        // Load assets here (images, sprites, audio, etc.)
    }

    create() {
        // create map
        const map = this.make.tilemap({ key: "workMap" });

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

        // apply collisions layer

        const collisionLayer = map.getObjectLayer('Collisions'); 
        
        // Replace 'Collisions' with your object layer name
        if (collisionLayer) {
            const collisionObjects = collisionLayer.objects;
            this.physics.world.enableBody(this.player.getPlayer());
            
            collisionObjects.forEach(collisionObject => {
                const rectangle = this.add.rectangle(
                    collisionObject.x + (collisionObject.width / 2),
                    collisionObject.y + (collisionObject.height / 2),
                    collisionObject.width,
                    collisionObject.height
                );
                this.physics.add.existing(rectangle, true);
                this.physics.add.collider(this.player.getPlayer(), rectangle);
            });
        }

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
    }

    update(time, delta) {
        // Game loop, runs continuously
        this.controls.update(delta);
        this.player.setControls(this.cursors, this.camera);
    }
}

export default Work;

