import { updatePlayerAnimation } from "../animations/PlayerAnimations";
import Phaser from "phaser";
import { SimpleGamepad } from "../utils/SimpleGamepad";

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
    }

    valueOf() {
        return this.playerObj;
    }

    getPlayer() {
        return this.playerObj;
    }

    debugMode(val = false) {
        if (val) {
            this.physics.world.createDebugGraphic();
        }
        this.playerObj.body.debugShowBody = val;
        this.playerObj.body.debugShowVelocity = val;
    }

    setControls(cursors, camera, multiplier = 1) {
        this.cursors = cursors;
        this.playerObj.body.setVelocity(0);

        // Get gamepad state
        const gamepadState = SimpleGamepad.getState();

        // Horizontal movement - check both keyboard and gamepad
        if (this.cursors.left.isDown || gamepadState['x-axis'] < -0.2) {
            this.playerObj.body.setVelocityX(-100 * multiplier);
        } else if (this.cursors.right.isDown || gamepadState['x-axis'] > 0.2) {
            this.playerObj.body.setVelocityX(100 * multiplier);
        }

        // Vertical movement - check both keyboard and gamepad
        if (this.cursors.up.isDown || gamepadState['y-axis'] < -0.2) {
            this.playerObj.body.setVelocityY(-100 * multiplier);
        } else if (this.cursors.down.isDown || gamepadState['y-axis'] > 0.2) {
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

