// This function defines the Player module.
// - `ctx` - A canvas context for drawing
// - `x` - The initial x position of the player
// - `y` - The initial y position of the player
// - `gameArea` - The bounding box of the game area
const Player = function(ctx, x, y, gameArea) {

    // This is the sprite sequences of the player facing different directions.
    // It contains the idling sprite sequences `idleLeft`, `idleUp`, `idleRight` and `idleDown`,
    // and the moving sprite sequences `moveLeft`, `moveUp`, `moveRight` and `moveDown`.
    const sequences = {
        /* Idling sprite sequences for facing different directions */
        idleLeft:       { x: 0, y: 0, width: 112.5, height: 112.5, rotate: 180, count: 1, timing: 2000, loop: false },
        idleLeftUp:     { x: 0, y: 0, width: 112.5, height: 112.5, rotate: 225, count: 1, timing: 2000, loop: false },
        idleUp:         { x: 0, y: 0, width: 112.5, height: 112.5, rotate: 270, count: 1, timing: 2000, loop: false },
        idleRightUp:    { x: 0, y: 0, width: 112.5, height: 112.5, rotate: 315, count: 1, timing: 2000, loop: false },
        idleRight:      { x: 0, y: 0, width: 112.5, height: 112.5, rotate: 0, count: 1, timing: 2000, loop: false },
        idleRightDown:  { x: 0, y: 0, width: 112.5, height: 112.5, rotate: 45, count: 1, timing: 2000, loop: false },
        idleDown:       { x: 0, y: 0, width: 112.5, height: 112.5, rotate: 90, count: 1, timing: 2000, loop: false },
        idleLeftDown:   { x: 0, y: 0, width: 112.5, height: 112.5, rotate: 135, count: 1, timing: 2000, loop: false },

        /* Moving sprite sequences for facing different directions */
        moveLeft:       { x: 0, y: 0, width: 112.5, height: 112.5, rotate: 180, count: 4, timing: 100, loop: true },
        moveLeftUp:     { x: 0, y: 0, width: 112.5, height: 112.5, rotate: 225, count: 4, timing: 100, loop: true },
        moveUp:         { x: 0, y: 0, width: 112.5, height: 112.5, rotate: 270, count: 4, timing: 100, loop: true },
        moveRightUp:    { x: 0, y: 0, width: 112.5, height: 112.5, rotate: 315, count: 4, timing: 100, loop: true },
        moveRight:      { x: 0, y: 0, width: 112.5, height: 112.5, rotate: 0, count: 4, timing: 100, loop: true },
        moveRightDown:  { x: 0, y: 0, width: 112.5, height: 112.5, rotate: 45, count: 4, timing: 100, loop: true },
        moveDown:       { x: 0, y: 0, width: 112.5, height: 112.5, rotate: 90, count: 4, timing: 100, loop: true },
        moveLeftDown:   { x: 0, y: 0, width: 112.5, height: 112.5, rotate: 135, count: 4, timing: 100, loop: true },
    };

    let speed = 60;

    // This is the sprite object of the player created from the Sprite module.
    const character = Character(ctx, x, y, gameArea, sequences, speed);

    // The methods are returned as an object here.
    return {
        move: character.move,
        stop: character.stop,
        speedUp: character.speedUp,
        slowDown: character.slowDown,
        getBoundingBox: character.getBoundingBox,
        draw: character.draw,
        update: character.update
    };
};
