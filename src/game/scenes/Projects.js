import Phaser, { Scene } from "phaser";
import { Player } from "../objects/player";
import { createPlayerAnimations } from "../animations/PlayerAnimations";
import { fadeIn, fadeOut } from "../animations/Scenes";
import { createTooltip } from "../utils/tooltip";
import { createZone } from "../utils/CreateZone";
import { createDialog, setDialogMobileControls } from "../utils/CreateDialog";
import { SimpleGamepad } from "../utils/SimpleGamepad";

export class Projects extends Scene {
    constructor() {
        super("Projects");
    }

    fadingOut = false;

    init() {
        this.fadingOut = false;
    }

    preload() {
        // Load assets here (images, sprites, audio, etc.)
    }

    create() {
        // Create game objects, set up the scene
        // create map
        const map = this.make.tilemap({ key: "projectsMap" });

        // set tileset
        const tileset = map.addTilesetImage("interiorTiles", "interiorTiles");

        if (!tileset) {
            console.error("Failed to load tileset - check names match!");
        }

        // create layers
        const homeLayer = map.createLayer("Background", tileset, 0, 0);
        homeLayer.setDepth(0);

        const groundLayer = map.createLayer("World", tileset, 0, 0);
        groundLayer.setDepth(1);

        groundLayer.setCollisionByProperty({ collision: true });
        homeLayer.setCollisionByProperty({ collision: true });
        groundLayer.setCollisionFromCollisionGroup();

        fadeIn;
        // create player
        const spawnPoint = map.findObject("Spawn", (obj) => obj);
        this.player = new Player(spawnPoint.x, spawnPoint.y, this.physics);
        this.player.getPlayer().setScale(0.5);
        createPlayerAnimations(this.anims);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.controls = this.player.createControls(this.cursors);
        this.player.addCollider(groundLayer);
        this.player.addCollider(homeLayer);

        // apply collisions layer

        const collisionLayer = map.getObjectLayer("Collisions");

        // Replace 'Collisions' with your object layer name
        if (collisionLayer) {
            const collisionObjects = collisionLayer.objects;
            this.physics.world.enableBody(this.player.getPlayer());

            collisionObjects.forEach((collisionObject) => {
                const rectangle = this.add.rectangle(
                    collisionObject.x + collisionObject.width / 2,
                    collisionObject.y + collisionObject.height / 2,
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
        //   const debugGraphics = this.add.graphics().setAlpha(0.75).setDepth(10);

        //   groundLayer.renderDebug(debugGraphics, {
        //       tileColor: null,
        //       collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
        //       faceColor: new Phaser.Display.Color(40, 39, 37, 255),
        //       showCollisionObjects: true,
        //   });

        const outside = map.findObject(
            "Interactions",
            (obj) => obj.name === "door"
        );
        if (outside) {
            const outsideZone = this.add.zone(
                outside.x + outside.width / 2,
                outside.y + outside.height / 2,
                outside.width,
                outside.height
            );
            this.physics.world.enable(outsideZone);
            this.physics.add.overlap(
                this.player.getPlayer(),
                outsideZone,
                () => {
                    if (!this.fadingOut) {
                        this.fadingOut = true;
                        fadeOut(this.cameras.main, 500, this.scene, "Game", {
                            spawn: "Projects spawn",
                        });
                    }
                }
            );
        }

        const airclawIcon = map.findObject(
            "Icons",
            (obj) => obj.name === "airclaw"
        );
        if (airclawIcon) {
            this.add
                .image(airclawIcon.x + 1, airclawIcon.y - 4, "airclawIcon")
                .setScale(0.2)
                .setDepth(5);

            this.add
                .circle(airclawIcon.x + 0.5, airclawIcon.y - 5, 7, 0x000000)
                .setDepth(4);
        }

        this.tooltip = createTooltip(
            this,
            "Interactions",
            airclawIcon.x,
            airclawIcon.y
        );
        this.tooltip.setScale(0.5);

        this.airclawZone = createZone.bind(this)(
            map,
            "Interactions",
            "airclaw",
            () => {
                this.tooltip.setVisible(true);
                this.tooltip.setText("Press E to open page");
                this.tooltip.setPosition(
                    this.player.getX() - this.tooltip.width / 4,
                    this.player.getY() - this.tooltip.height
                );
            }
        );

        const nbaIcon = map.findObject("Icons", (obj) => obj.name === "nba");
        if (nbaIcon) {
            this.add
                .image(nbaIcon.x + 1, nbaIcon.y - 4, "nbaIcon")
                .setScale(0.02)
                .setDepth(5);

            this.add
                .circle(nbaIcon.x + 0.5, nbaIcon.y - 5, 7, 0xffffff)
                .setDepth(4);
        }

        this.nbaZone = createZone.bind(this)(map, "Interactions", "nba", () => {
            this.tooltip.setVisible(true);
            this.tooltip.setText("Press E to open page");
            this.tooltip.setPosition(
                this.player.getX() - this.tooltip.width / 4,
                this.player.getY() - this.tooltip.height
            );
        });

        const mentrIcon = map.findObject(
            "Icons",
            (obj) => obj.name === "mentr"
        );
        if (mentrIcon) {
            this.add
                .image(mentrIcon.x + 1, mentrIcon.y - 4, "mentrIcon")
                .setScale(0.2)
                .setDepth(5);

            this.add
                .circle(mentrIcon.x + 0.5, mentrIcon.y - 5, 7, 0x000000)
                .setDepth(4);
        }

        this.mentrZone = createZone.bind(this)(
            map,
            "Interactions",
            "mentr",
            () => {
                this.tooltip.setVisible(true);
                this.tooltip.setText("Press E to open page");
                this.tooltip.setPosition(
                    this.player.getX() - this.tooltip.width / 4,
                    this.player.getY() - this.tooltip.height
                );
            }
        );

        const airclawTexts = [
            "Airclaw\nPress SPACE to continue...",
            "I built with a decentralized VPN application with...",
            "a couple of friends to support the DewiCats NFT Project",
            "We used React, Rust, Supabase, and Go to build the app.",
        ];

        const nbaTexts = [
            "NBA Total Scores\nPress SPACE to continue...",
            "I built a website that web scrapes daily NBA statistics and...",
            "displays them in a clean and easy to read format to help with sports betting.",
            "I used NextJS, GCP, and Postgres to build the site.",
        ];

        const mentrTexts = [
            "Mentr\nPress SPACE to continue...",
            "I built a website that allows creators to...",
            "create whitelabeled educational content and sell it to their audience.",
            "I used NextJS, Postgres, Cloudinary and CDNs to build the site.",
        ];

        const mentrUrl = "http://www.emprende.inc";
        const nbaUrl = "http://www.nbatotalscores.com";
        const airclawUrl = "http://www.airclaw.xyz";

        this.enterKey = this.input.keyboard.addKey("E");
        this.enterKey.on("down", () => {
            this.setupInteractiveZone(this.airclawZone, airclawTexts, airclawUrl);
            this.setupInteractiveZone(this.nbaZone, nbaTexts, nbaUrl);
            this.setupInteractiveZone(this.mentrZone, mentrTexts, mentrUrl);
        });

        const prevGamepadAState = 0;

        this.events.on("update", () => {
            const gamepadState = SimpleGamepad.getState();

            // Check if 'a' button was just pressed (transition from 0 to 1)
            if (gamepadState.a === 1 && prevGamepadAState === 0) {
                this.setupInteractiveZone(this.airclawZone, airclawTexts, airclawUrl);

                this.setupInteractiveZone(this.nbaZone, nbaTexts, nbaUrl);

                this.setupInteractiveZone(this.mentrZone, mentrTexts, mentrUrl);
            }

            setDialogMobileControls.bind(this)(prevGamepadAState, this.airclawZone);
            setDialogMobileControls.bind(this)(prevGamepadAState, this.nbaZone);
            setDialogMobileControls.bind(this)(prevGamepadAState, this.mentrZone);
        });
    }

    setupInteractiveZone(zone, dialogTexts, url) {
        if (this.physics.overlap(this.player.getPlayer(), zone)) {
            createDialog.bind(this)(dialogTexts, () => {
                window.open(url, "_blank");
            });
        }
    }

    update(time, delta) {
        this.controls.update(delta);

        if (this.fadingOut) {
            return;
        }

        this.player.setControls(this.cursors, this.camera, 0.5);

        if (
            !this.physics.overlap(this.player.getPlayer(), this.airclawZone) &&
            !this.physics.overlap(this.player.getPlayer(), this.nbaZone) &&
            !this.physics.overlap(this.player.getPlayer(), this.mentrZone)
        ) {
            this.tooltip.setVisible(false);
        }
    }
}

export default Projects;

