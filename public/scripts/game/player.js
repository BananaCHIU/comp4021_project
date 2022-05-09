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
        idleLeft:  { x: 0, y: 25, width: 24, height: 25, count: 3, timing: 2000, loop: false },
        idleUp:    { x: 0, y: 50, width: 24, height: 25, count: 1, timing: 2000, loop: false },
        idleRight: { x: 0, y: 75, width: 24, height: 25, count: 3, timing: 2000, loop: false },
        idleDown:  { x: 0, y:  0, width: 24, height: 25, count: 3, timing: 2000, loop: false },

        /* Moving sprite sequences for facing different directions */
        moveLeft:  { x: 0, y: 125, width: 24, height: 25, count: 10, timing: 50, loop: true },
        moveUp:    { x: 0, y: 150, width: 24, height: 25, count: 10, timing: 50, loop: true },
        moveRight: { x: 0, y: 175, width: 24, height: 25, count: 10, timing: 50, loop: true },
        moveDown:  { x: 0, y: 100, width: 24, height: 25, count: 10, timing: 50, loop: true }
    };

    let speed = 150;

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
