export const createPlayerAnimations = (anims) => {
    // Walking animations
    anims.create({
        key: 'walk-down',
        frames: anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 8,
        repeat: -1
    });

    anims.create({
        key: 'walk-left',
        frames: anims.generateFrameNumbers('dude', { start: 4, end: 7 }),
        frameRate: 8,
        repeat: -1
    });

    anims.create({
        key: 'walk-right',
        frames: anims.generateFrameNumbers('dude', { start: 8, end: 11 }),
        frameRate: 8,
        repeat: -1
    });

    anims.create({
        key: 'walk-up',
        frames: anims.generateFrameNumbers('dude', { start: 12, end: 15 }),
        frameRate: 8,
        repeat: -1
    });

    // Idle animations
    anims.create({
        key: 'idle-down',
        frames: [{ key: 'dude', frame: 0 }],
        frameRate: 1
    });

    anims.create({
        key: 'idle-left',
        frames: [{ key: 'dude', frame: 4 }],
        frameRate: 1
    });

    anims.create({
        key: 'idle-right',
        frames: [{ key: 'dude', frame: 8 }],
        frameRate: 1
    });

    anims.create({
        key: 'idle-up',
        frames: [{ key: 'dude', frame: 12 }],
        frameRate: 1
    });
};

// Helper function to handle animation updates
export const updatePlayerAnimation = (player) => {
    if (player.body.velocity.x === 0 && player.body.velocity.y === 0) {
        // Get the current animation key and extract the direction
        const currentAnim = player.anims.currentAnim;
        if (currentAnim) {
            // Convert walk-* to idle-*
            const currentDirection = currentAnim.key.replace('walk-', 'idle-');
            player.anims.play(currentDirection, true);
        } else {
            // Default to idle-down if no animation is playing
            player.anims.play('idle-down', true);
        }
        return;
    }

    // Determine animation based on velocity
    if (Math.abs(player.body.velocity.x) > Math.abs(player.body.velocity.y)) {
        // Moving horizontally
        if (player.body.velocity.x < 0) {
            player.anims.play('walk-left', true);
        } else {
            player.anims.play('walk-right', true);
        }
    } else {
        // Moving vertically
        if (player.body.velocity.y < 0) {
            player.anims.play('walk-up', true);
        } else {
            player.anims.play('walk-down', true);
        }
    }
}; 