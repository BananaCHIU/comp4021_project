// This function defines the Player module.
// - `ctx` - A canvas context for drawing
// - `x` - The initial x position of the player
// - `y` - The initial y position of the player
// - `gameArea` - The bounding box of the game area
const Character = function(ctx, x, y, gameArea, sequences, speed) {
    // This is the sprite object of the player created from the Sprite module.
    const sprite = Sprite(ctx, x, y);

    // The sprite object is configured for the player sprite here.
    sprite.setSequence(sequences.idleDown)
        .setScale(1)
        .useSheet("assets/character_sprites.png")
        .setShadowScale({ x: 0.5, y: 0.5 });

    // This is the moving direction, which can be a number from 0 to 4:
    // - `0` - not moving
    // - `1` - moving left
    // - `2` - moving left-up
    // - `3` - moving up
    // - `4` - moving right-up
    // - `5` - moving right
    // - `6` - moving right-down
    // - `7` - moving down
    // - `8` - moving left-down
    let direction = 0;
    let facingDirection = 7;

    // This function sets the player's moving direction.
    // - `dir` - the moving direction (1: Left, 2: Up, 3: Right, 4: Down)
    const move = function(dir) {
        if (dir >= 1 && dir <= 8 && dir !== direction) {
            switch (dir) {
                case 1: sprite.setSequence(sequences.moveLeft); break;
                case 2: sprite.setSequence(sequences.moveLeftUp); break;
                case 3: sprite.setSequence(sequences.moveUp); break;
                case 4: sprite.setSequence(sequences.moveRightUp); break;
                case 5: sprite.setSequence(sequences.moveRight); break;
                case 6: sprite.setSequence(sequences.moveRightDown); break;
                case 7: sprite.setSequence(sequences.moveDown); break;
                case 8: sprite.setSequence(sequences.moveLeftDown); break;
            }
            direction = dir;
            facingDirection = dir;
        }
    };

    // This function stops the player from moving.
    // - `dir` - the moving direction when the player is stopped (1: Left, 2: Up, 3: Right, 4: Down)
    const stop = function() {
        switch (direction) {
            case 1: sprite.setSequence(sequences.idleLeft); break;
            case 2: sprite.setSequence(sequences.idleLeftUp); break;
            case 3: sprite.setSequence(sequences.idleUp); break;
            case 4: sprite.setSequence(sequences.idleRightUp); break;
            case 5: sprite.setSequence(sequences.idleRight); break;
            case 6: sprite.setSequence(sequences.idleRightDown); break;
            case 7: sprite.setSequence(sequences.idleDown); break;
            case 8: sprite.setSequence(sequences.idleLeftDown); break;
        }
        direction = 0;
    };

    // This function speeds up the player.
    const speedUp = function() {
        speed = 250;
    };

    // This function slows down the player.
    const slowDown = function() {
        speed = 150;
    };

    // This function updates the player depending on his movement.
    // - `time` - The timestamp when this function is called
    const update = function(time) {
        /* Update the player if the player is moving */
        if (direction !== 0) {
            let { x, y } = sprite.getXY();

            /* Move the player */
            switch (direction) {
                case 1: x -= speed / 60; break;
                case 2: x -= speed / 90; y -= speed / 90; break;
                case 3: y -= speed / 60; break;
                case 4: x += speed / 90; y -= speed / 90; break;
                case 5: x += speed / 60; break;
                case 6: x += speed / 90; y += speed / 90; break;
                case 7: y += speed / 60; break;
                case 8: x -= speed / 90; y += speed / 90; break;
            }

            /* Set the new position if it is within the game area */
            if (gameArea.isPointInBox(x, y))
                sprite.setXY(x, y);
        }

        /* Update the sprite object */
        sprite.update(time);
    };

    const getDirection = () => {
      return facingDirection;
    }

    // The methods are returned as an object here.
    return {
        move: move,
        stop: stop,
        speedUp: speedUp,
        slowDown: slowDown,
        getBoundingBox: sprite.getBoundingBox,
        getDirection: getDirection,
        draw: sprite.draw,
        update: update
    };
};
