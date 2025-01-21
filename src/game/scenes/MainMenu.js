import { EventBus } from "../EventBus";
import { Scene } from "phaser";

export class MainMenu extends Scene {
    logoTween;

    constructor() {
        super("MainMenu");
    }

    create() {
        this.sound.pauseOnBlur = false;
        // animating background
        const background = this.add.sprite(350, 200, "bg");
        background.setScale(0.8);
        if (!this.anims.exists("bg-animation")) {
            this.anims.create({
                key: "bg-animation",
                frames: this.anims.generateFrameNumbers("bg", {
                    start: 0,
                    end: 34,
                }),
                frameRate: 6,
                repeat: -1,
            });
        }
        background.play("bg-animation");

        // this.logo = this.add.image(this.game.renderer.width / 2, (this.game.renderer.height / 2) - 100, 'logo').setDepth(100);

        // Pets and me
        this.add
            .image(
                this.game.renderer.width / 2 - 30,
                this.game.renderer.height / 2 - 50,
                "pets"
            )
            .setDepth(100)
            .setScale(0.8);
        this.add
            .image(
                this.game.renderer.width / 2 + 25,
                this.game.renderer.height / 2 - 75,
                "raf"
            )
            .setDepth(99)
            .setScale(2.5);

        // Menu text
        this.add
            .text(
                this.game.renderer.width / 2,
                this.game.renderer.height / 2 + 50,
                `Raf's Portfolio`,
                {
                    fontFamily: "Karmatic",
                    fontSize: 38,
                    color: "#ffffff",
                    align: "center",
                    shadow: {
                        color: "#000000",
                        offsetX: 4,
                        offsetY: 0,
                        blur: 0,
                        stroke: true,
                        fill: true,
                    }
                    
                }
            )
            .setDepth(100)
            .setOrigin(0.5);

        const startButton = this.add
            .text(
                this.game.renderer.width / 2,
                this.game.renderer.height / 2 + 150,
                `Start`,
                {
                    fontFamily: "Karmatic",
                    fontSize: 24,
                    color: "#ffffff",
                    align: "center",
                    shadow: {
                        color: "#000000",
                        offsetX: 4,
                        offsetY: 0,
                        blur: 0,
                        stroke: true,
                        fill: true,
                    }
                }
            )
            .setDepth(100)
            .setOrigin(0.5);

        startButton.setInteractive();
        startButton.on("pointerdown", () => this.changeScene());
        
        let underline = this.add.rectangle(startButton.x, startButton.y + 20, startButton.width, 4, 0xffffff);
        

        underline.setDepth(100);
        underline.visible = false;

        startButton.on("pointerover", () => {
            // set underline on start button    
            underline.visible = true;
        });
        startButton.on("pointerout", () => {
            underline.visible = false;
        });

        const music = this.sound.add("menu-music");
        music.play({ loop: true });

        EventBus.emit("current-scene-ready", this);
    }

    changeScene() {
        if (this.logoTween) {
            this.logoTween.stop();
            this.logoTween = null;
        }

        this.scene.start("Game");
    }

    moveLogo(reactCallback) {
        if (this.logoTween) {
            if (this.logoTween.isPlaying()) {
                this.logoTween.pause();
            } else {
                this.logoTween.play();
            }
        } else {
            this.logoTween = this.tweens.add({
                targets: this.logo,
                x: { value: 750, duration: 3000, ease: "Back.easeInOut" },
                y: { value: 80, duration: 1500, ease: "Sine.easeOut" },
                yoyo: true,
                repeat: -1,
                onUpdate: () => {
                    if (reactCallback) {
                        reactCallback({
                            x: Math.floor(this.logo.x),
                            y: Math.floor(this.logo.y),
                        });
                    }
                },
            });
        }
    }
}

