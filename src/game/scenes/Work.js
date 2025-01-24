import Phaser, { Scene } from "phaser";
import { Player } from "../objects/player";
import { createPlayerAnimations } from "../animations/PlayerAnimations";
import { fadeIn, fadeOut } from "../animations/Scenes";
import { createTooltip } from "../utils/tooltip";
import { SimpleGamepad } from "../utils/SimpleGamepad";
import { createDialog, setDialogMobileControls } from "../utils/CreateDialog";
import { createZone } from "../utils/CreateZone";

export class Work extends Scene {
    constructor() {
        super("Work");
    }

    fadingOut = false;

    init() {
        this.fadingOut = false;
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

        fadeIn(this.cameras.main, 500);

        // create player
        const spawnPoint = map.findObject("Spawn", (obj) => obj);
        this.player = new Player(spawnPoint.x, spawnPoint.y, this.physics);
        this.player.getPlayer().setScale(0.5);
        createPlayerAnimations(this.anims);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.controls = this.player.createControls(this.cursors);
        this.player.addCollider(groundLayer);

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
                const obj = this.physics.add.existing(rectangle, true);
                obj.body.debugShowBody = false;
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
        // const debugGraphics = this.add.graphics().setAlpha(0.75).setDepth(10);

        // groundLayer.renderDebug(debugGraphics, {
        //     tileColor: null,
        //     collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
        //     faceColor: new Phaser.Display.Color(40, 39, 37, 255),
        //     showCollisionObjects: true,
        // });

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
            outsideZone.body.debugShowBody = false;
            this.physics.add.overlap(
                this.player.getPlayer(),
                outsideZone,
                () => {
                    if (!this.fadingOut) {
                        this.fadingOut = true;
                        fadeOut(this.cameras.main, 500, this.scene, "Game", {
                            spawn: "Work spawn",
                        });
                    }
                }
            );
        }

        const ukgIcon = map.findObject("Icons", (obj) => obj.name === "ukg");
        if (ukgIcon) {
            this.add
                .image(ukgIcon.x + 1, ukgIcon.y - 2, "ukgIcon")
                .setScale(0.2)
                .setDepth(5);
            // add a white circle behind the image
            this.add
                .circle(ukgIcon.x + 0.5, ukgIcon.y - 3, 7, 0xffffff)
                .setDepth(4);
        }

        this.tooltip = createTooltip(this, "UKG", ukgIcon.x, ukgIcon.y);
        this.tooltip.setScale(0.5);

        const ukgArea = map.findObject(
            "Interactions",
            (obj) => obj.name === "ukg"
        );
        if (ukgArea) {
            this.ukgZone = this.add.zone(
                ukgArea.x + ukgArea.width / 2,
                ukgArea.y + ukgArea.height / 2,
                ukgArea.width,
                ukgArea.height
            );
            this.physics.world.enable(this.ukgZone);
            this.ukgZone.body.debugShowBody = false;
            this.physics.add.overlap(
                this.player.getPlayer(),
                this.ukgZone,
                () => {
                    this.tooltip.setVisible(true);
                    this.tooltip.setText("Press E to interact");
                    this.tooltip.setPosition(
                        this.player.getX() - this.tooltip.width / 4,
                        this.player.getY() - this.tooltip.height
                    );
                }
            );
        }

        // Track previous gamepad state to detect button press
        let prevGamepadAState = 0;
        // Create an update listener for the gamepad
        this.events.on("update", () => {
            const gamepadState = SimpleGamepad.getState();

            // Check if 'a' button was just pressed (transition from 0 to 1)
            if (gamepadState.a === 1 && prevGamepadAState === 0) {
                this.setupUkgZone();
            }

            setDialogMobileControls.bind(this)(prevGamepadAState, this.ukgZone);
        });

        // if E is pressed, create a dialog box
        this.enterKey = this.input.keyboard.addKey("E");
        this.enterKey.on("down", () => {
            this.setupUkgZone();
        });
    }

    setupUkgZone() {
        if (this.physics.overlap(this.player.getPlayer(), this.ukgZone)) {
            createDialog.bind(this)([
                "UKG\nPress SPACE to continue...",
                "I've worked here as a Software Engineer from 2018 to now.",
                "I grew from an intern to a Lead Engineer on the Design System team.",
                "I built a design system component library that is used by...",
                "thousands of employees and millions of customers.",
                "I'm now an engineer on the Recruiting and Talent Acquisition team.",
                "We are improving the hiring process for our customers and recruiters!",
            ]);
        }
    }
    
    update(time, delta) {
        // Game loop, runs continuously
        this.controls.update(delta);

        if (this.fadingOut) {
            return;
        }

        this.player.setControls(this.cursors, this.camera, 0.5);

        if (
            !this.physics.overlap(this.player.getPlayer(), this.ukgZone) &&
            !this.physics.overlap(this.player.getPlayer(), this.bookcaseZone) &&
            !this.physics.overlap(this.player.getPlayer(), this.bedZone) &&
            !this.physics.overlap(this.player.getPlayer(), this.fridgeZone)
        ) {
            this.tooltip.setVisible(false);
        }
    }
}

export default Work;

