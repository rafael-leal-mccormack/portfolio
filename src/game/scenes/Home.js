import Phaser, { Scene } from "phaser";
import { Player } from "../objects/player";
import { createPlayerAnimations } from "../animations/PlayerAnimations";
import { fadeIn, fadeOut } from "../animations/Scenes";
import { EventBus } from "../EventBus";
import { SimpleGamepad } from "../utils/SimpleGamepad";
import { createZone } from "../utils/CreateZone";
import { createDialog, setDialogMobileControls } from "../utils/CreateDialog";

export class Home extends Scene {
    constructor() {
        super("Home");
    }

    fadingOut;

    init() {
        this.fadingOut = false;
    }

    pictureType = null;

    preload() {
        // Load assets here (images, sprites, audio, etc.)
    }

    create() {
        // Add this line near the start of create()

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

        fadeIn(this.cameras.main, 500);

        // create player
        const spawnPoint = map.findObject("Spawn", (obj) => !!obj);
        this.player = new Player(spawnPoint.x, spawnPoint.y, this.physics);
        this.player.getPlayer().setScale(0.5);
        createPlayerAnimations(this.anims);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.controls = this.player.createControls(this.cursors);
        this.player.addCollider(groundLayer);

        // create camera
        const camera = this.cameras.main;
        this.camera = camera;
        this.camera.setZoom(1.5);
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
            (obj) => obj.name === "outside"
        );
        if (outside) {
            const outsideZone = this.add.zone(
                outside.x + 8,
                outside.y + 8,
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
                            spawn: "Spawn",
                        });
                    }
                }
            );
        }

        this.tooltip = this.add
            .text(0, 0, "", {
                font: "16px monospace",
                padding: { x: 10, y: 5 },
                backgroundColor: "#000000",
                color: "#ffffff",
                alpha: 0.8,
            })
            .setDepth(300)
            .setVisible(false)
            .setScale(0.5);

        const picture = map.findObject(
            "Interactions",
            (obj) => obj.name === "picture"
        );
        if (picture) {
            this.pictureZone = this.add.zone(
                picture.x + 16,
                picture.y + 8,
                picture.width,
                picture.height
            );
            
            this.physics.world.enable(this.pictureZone);
            this.pictureZone.body.debugShowBody = false;
            this.physics.add.overlap(
                this.player.getPlayer(),
                this.pictureZone,
                () => {
                    this.tooltip.setVisible(true);
                    this.tooltip.setText("Press E to view picture");
                    this.tooltip.setPosition(
                        this.player.getX() - this.tooltip.width / 4,
                        this.player.getY() - this.tooltip.height
                    );

                    // Add key listener for 'E' key
                    this.pictureType = "people/wedding.jpg";
                },
                undefined,
                this
            );
        }


        this.fridgeZone = createZone.bind(this)(
            map,
            "Interactions",
            "fridge",
            () => {
                console.log("entering zone")
                this.tooltip.setVisible(true);
                this.tooltip.setText("Press E to interact");
                this.tooltip.setPosition(
                    this.player.getX() - this.tooltip.width / 4,
                    this.player.getY() - this.tooltip.height
                );
            }
        );

        this.bookcaseZone = createZone.bind(this)(
            map,
            "Interactions",
            "bookcase",
            () => {
                this.tooltip.setVisible(true);
                this.tooltip.setText("Press E to interact");
                this.tooltip.setPosition(
                    this.player.getX() - this.tooltip.width / 4,
                    this.player.getY() - this.tooltip.height
                );
            }
        );

        this.bedZone = createZone.bind(this)(map, "Interactions", "bed", () => {
            this.tooltip.setVisible(true);
            this.tooltip.setText("Press E to interact");
            this.tooltip.setPosition(
                this.player.getX() - this.tooltip.width / 4,
                this.player.getY() - this.tooltip.height
            );
        });


        const fridgeText = [
            "Hmmm... what to cook for dinner? Maybe Carne con papa?",
        ];

        const bookcaseTexts = [
            "There's programming books and manga sprawled about...",
        ];

        const bedTexts = [
            "A nap would be great but it's probably not the best time...",
        ];



        const keyE = this.input.keyboard.addKey("E");
        
        // Track previous gamepad state to detect button press
        let prevGamepadAState = 0;
        
        // TODO: optimize with gamepad and keyboard
        // Create an update listener for the gamepad
        this.events.on('update', () => {
            const gamepadState = SimpleGamepad.getState();
            
            // Check if 'a' button was just pressed (transition from 0 to 1)
            if (gamepadState.a === 1 && prevGamepadAState === 0) {
                if (this.tooltip.visible) {
                    EventBus.emit("show-picture", this.pictureType);
                }

                this.setupInteractiveZone(this.fridgeZone, fridgeText);
                this.setupInteractiveZone(this.bookcaseZone, bookcaseTexts);
                this.setupInteractiveZone(this.bedZone, bedTexts);
            }

            setDialogMobileControls.bind(this)(prevGamepadAState, this.fridgeZone)
            setDialogMobileControls.bind(this)(prevGamepadAState, this.bookcaseZone)
            setDialogMobileControls.bind(this)(prevGamepadAState, this.bedZone)

            prevGamepadAState = gamepadState.a;
        });

        // Keep existing keyboard listener
        keyE.on("down", () => {
            if (this.tooltip.visible && this.physics.overlap(this.player.getPlayer(), this.pictureZone)) {
                EventBus.emit("show-picture", this.pictureType);
            }

            this.setupInteractiveZone(this.fridgeZone, fridgeText);
            this.setupInteractiveZone(this.bookcaseZone, bookcaseTexts);
            this.setupInteractiveZone(this.bedZone, bedTexts);
        });

        const pets = map.findObject(
            "Interactions",
            (obj) => obj.name === "pets"
        );
        if (pets) {
            this.petsZone = this.add.zone(
                pets.x + 16,
                pets.y + 8,
                pets.width,
                pets.height
            );
            this.physics.world.enable(this.petsZone);
            this.petsZone.body.debugShowBody = false;
            this.physics.add.overlap(
                this.player.getPlayer(),
                this.petsZone,
                () => {
                    this.tooltip.setVisible(true);
                    this.tooltip.setPosition(
                        this.player.getX() - this.tooltip.width / 4,
                        this.player.getY() - this.tooltip.height
                    );
                    this.tooltip.setText("Press E to view pets");
                    this.pictureType = "pets/pets.png";
                }
            );
        }

        const olaf = map.findObject("Pets", (obj) => obj.name === "olaf");
        if (olaf) {
            const olafSprite = this.add.sprite(olaf.x, olaf.y - 16, "olaf");
            olafSprite.setDepth(1);
            olafSprite.setScale(1.2);
            // Create the animation in this scene before playing it
            this.anims.create({
                key: "olaf-animation",
                frames: this.anims.generateFrameNumbers("olaf", {
                    start: 0,
                    end: 3,
                }),
                frameRate: 1,
                repeat: -1,
            });

            olafSprite.anims.play("olaf-animation", true);
        }

        const smodes = map.findObject("Pets", (obj) => obj.name === "smodes");
        if (smodes) {
            const smodesSprite = this.add.sprite(
                smodes.x,
                smodes.y - 16,
                "asmodeus"
            );
            smodesSprite.setDepth(1);
            smodesSprite.setScale(0.5);

            this.anims.create({
                key: "asmodeus-animation",
                frames: this.anims.generateFrameNumbers("asmodeus", {
                    start: 0,
                    end: 3,
                }),
                frameRate: 1,
                repeat: -1,
            });

            smodesSprite.anims.play("asmodeus-animation", true);
        }

        const neptune = map.findObject("Pets", (obj) => obj.name === "neptune");
        if (neptune) {
            const neptuneSprite = this.add.sprite(
                neptune.x - 2,
                neptune.y - 16,
                "neptune"
            );
            neptuneSprite.setScale(0.5);
            neptuneSprite.setDepth(1);

            this.anims.create({
                key: "neptune-animation",
                frames: this.anims.generateFrameNumbers("neptune", {
                    start: 0,
                    end: 3,
                }),
                frameRate: 1,
                repeat: -1,
            });

            neptuneSprite.anims.play("neptune-animation", true);
        }
    }


    setupInteractiveZone(zone, dialogTexts) {
        if (this.physics.overlap(this.player.getPlayer(), zone)) {
            createDialog.bind(this)(dialogTexts);
        }
    }

    update(time, delta) {
        this.controls.update(delta);
        if (this.fadingOut) {
            return;
        }
        this.player.setControls(this.cursors, this.camera, 0.5);

        if (
            this.pictureZone &&
            !this.physics.overlap(this.player.getPlayer(), this.pictureZone) &&
            !this.physics.overlap(this.player.getPlayer(), this.petsZone) && !this.physics.overlap(this.player.getPlayer(), this.bookcaseZone) &&
            !this.physics.overlap(this.player.getPlayer(), this.bedZone) &&
            !this.physics.overlap(this.player.getPlayer(), this.fridgeZone)
        ) {
            this.tooltip.setVisible(false);
        }
    }
}

export default Home;

