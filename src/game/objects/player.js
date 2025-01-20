import { updatePlayerAnimation } from "../animations/PlayerAnimations";
import Phaser from "phaser";

export class Player {
    playerObj;
    physics;
    cursors;
    camera;

    constructor(x, y, physics) {
        this.x = x;
        this.y = y;
        this.physics = physics;

        this.playerObj = this.physics.add.sprite(x, y, "dude");
        this.playerObj.setDepth(2);
        this.playerObj.body.setSize(16, 16); // Set collision box size
        this.playerObj.setScale(0.75);
        this.playerObj.body.setOffset(24, 40); // Adjust collision box
        this.physics.world.createDebugGraphic();
    }

    valueOf() {
        return this.playerObj;
    }

    getPlayer() {
        return this.playerObj;
    }

    debugMode(val) {
        this.playerObj.body.debugShowBody = val;
        this.playerObj.body.debugShowVelocity = val;
    }

    setControls(cursors, camera, multiplier = 1) {
        this.cursors = cursors;
        this.playerObj.body.setVelocity(0);

        // Horizontal movement
        if (this.cursors.left.isDown) {
            this.playerObj.body.setVelocityX(-100 * multiplier);
        } else if (this.cursors.right.isDown) {
            this.playerObj.body.setVelocityX(100 * multiplier);
        }

        // Vertical movement
        if (this.cursors.up.isDown) {
            this.playerObj.body.setVelocityY(-100 * multiplier);
        } else if (this.cursors.down.isDown) {
            this.playerObj.body.setVelocityY(100 * multiplier);
        }

        // Normalize and scale the velocity so that player can't move faster along a diagonal
        this.playerObj.body.velocity.normalize().scale(125 * multiplier);

        updatePlayerAnimation(this.playerObj);

        camera.centerOn(this.playerObj.x, this.playerObj.y);
    }

    addCollider(layer) {
        this.physics.add.collider(this.playerObj, layer);
    }

    createControls(cursors) {
        return new Phaser.Cameras.Controls.FixedKeyControl({
            left: cursors.left,
            right: cursors.right,
            up: cursors.up,
            down: cursors.down,
            speed: 0.1,
    })
    }

    getX() {
        return this.playerObj.x;
    }

    getY() {
        return this.playerObj.y;
    }
}

