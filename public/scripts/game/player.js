// This function defines the Player module.
// - `ctx` - A canvas context for drawing
// - `x` - The initial x position of the player
// - `y` - The initial y position of the player
// - `gameArea` - The bounding box of the game area
const Player = function(ctx, x, y, gameArea, playerNum) {

    // This is the sprite sequences of the player facing different directions.
    // It contains the idling sprite sequences `idleLeft`, `idleUp`, `idleRight` and `idleDown`,
    // and the moving sprite sequences `moveLeft`, `moveUp`, `moveRight` and `moveDown`.
    const sequences1 = {
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
        moveLeft:       { x: 0, y: 0, width: 112.5, height: 112.5, rotate: 180, count: 4, timing: 200, loop: true },
        moveLeftUp:     { x: 0, y: 0, width: 112.5, height: 112.5, rotate: 225, count: 4, timing: 200, loop: true },
        moveUp:         { x: 0, y: 0, width: 112.5, height: 112.5, rotate: 270, count: 4, timing: 200, loop: true },
        moveRightUp:    { x: 0, y: 0, width: 112.5, height: 112.5, rotate: 315, count: 4, timing: 200, loop: true },
        moveRight:      { x: 0, y: 0, width: 112.5, height: 112.5, rotate: 0, count: 4, timing: 200, loop: true },
        moveRightDown:  { x: 0, y: 0, width: 112.5, height: 112.5, rotate: 45, count: 4, timing: 200, loop: true },
        moveDown:       { x: 0, y: 0, width: 112.5, height: 112.5, rotate: 90, count: 4, timing: 200, loop: true },
        moveLeftDown:   { x: 0, y: 0, width: 112.5, height: 112.5, rotate: 135, count: 4, timing: 200, loop: true },
    };
    const sequences2 = {
        /* Idling sprite sequences for facing different directions */
        idleLeft:       { x: 450, y: 112.5, width: 112.5, height: 112.5, rotate: 180, count: 1, timing: 2000, loop: false },
        idleLeftUp:     { x: 450, y: 112.5, width: 112.5, height: 112.5, rotate: 225, count: 1, timing: 2000, loop: false },
        idleUp:         { x: 450, y: 112.5, width: 112.5, height: 112.5, rotate: 270, count: 1, timing: 2000, loop: false },
        idleRightUp:    { x: 450, y: 112.5, width: 112.5, height: 112.5, rotate: 315, count: 1, timing: 2000, loop: false },
        idleRight:      { x: 450, y: 112.5, width: 112.5, height: 112.5, rotate: 0, count: 1, timing: 2000, loop: false },
        idleRightDown:  { x: 450, y: 112.5, width: 112.5, height: 112.5, rotate: 45, count: 1, timing: 2000, loop: false },
        idleDown:       { x: 450, y: 112.5, width: 112.5, height: 112.5, rotate: 90, count: 1, timing: 2000, loop: false },
        idleLeftDown:   { x: 450, y: 112.5, width: 112.5, height: 112.5, rotate: 135, count: 1, timing: 2000, loop: false },

        /* Moving sprite sequences for facing different directions */
        moveLeft:       { x: 450, y: 112.5, width: 112.5, height: 112.5, rotate: 180, count: 4, timing: 200, loop: true },
        moveLeftUp:     { x: 450, y: 112.5, width: 112.5, height: 112.5, rotate: 225, count: 4, timing: 200, loop: true },
        moveUp:         { x: 450, y: 112.5, width: 112.5, height: 112.5, rotate: 270, count: 4, timing: 200, loop: true },
        moveRightUp:    { x: 450, y: 112.5, width: 112.5, height: 112.5, rotate: 315, count: 4, timing: 200, loop: true },
        moveRight:      { x: 450, y: 112.5, width: 112.5, height: 112.5, rotate: 0, count: 4, timing: 200, loop: true },
        moveRightDown:  { x: 450, y: 112.5, width: 112.5, height: 112.5, rotate: 45, count: 4, timing: 200, loop: true },
        moveDown:       { x: 450, y: 112.5, width: 112.5, height: 112.5, rotate: 90, count: 4, timing: 200, loop: true },
        moveLeftDown:   { x: 450, y: 112.5, width: 112.5, height: 112.5, rotate: 135, count: 4, timing: 200, loop: true },
    };

    const dieSequence = {
        moveLeft:       { x: 0, y: 112.5, width: 112.5, height: 112.5, rotate: 180, count: 4, timing: 200, loop: false },
        moveLeftUp:     { x: 0, y: 112.5, width: 112.5, height: 112.5, rotate: 225, count: 4, timing: 200, loop: false },
        moveUp:         { x: 0, y: 112.5, width: 112.5, height: 112.5, rotate: 270, count: 4, timing: 200, loop: false },
        moveRightUp:    { x: 0, y: 112.5, width: 112.5, height: 112.5, rotate: 315, count: 4, timing: 200, loop: false },
        moveRight:      { x: 0, y: 112.5, width: 112.5, height: 112.5, rotate: 0, count: 4, timing: 200, loop: false },
        moveRightDown:  { x: 0, y: 112.5, width: 112.5, height: 112.5, rotate: 45, count: 4, timing: 200, loop: false },
        moveDown:       { x: 0, y: 112.5, width: 112.5, height: 112.5, rotate: 90, count: 4, timing: 200, loop: false },
        moveLeftDown:   { x: 0, y: 112.5, width: 112.5, height: 112.5, rotate: 135, count: 4, timing: 200, loop: false },
    }

    let speed = 50;
    let dead = false;
    // This is the sprite object of the player created from the Sprite module.
    const character = new Character(ctx, x, y, gameArea, playerNum === 1? sequences1: sequences2, speed);

    const die = () => {
        dead = true;
        character.stop();
        character.setSequence(Object.values(dieSequence)[character.getDirection()-1]);
    }
    const getDead = () => {
        return dead;
    }
    const getPlayerNum = () => {
        return playerNum;
    }
    // The methods are returned as an object here.
    return {
        move: character.move,
        stop: character.stop,
        die: die,
        getDead: getDead,
        getXY: character.getXY,
        setXY: character.setXY,
        speedUp: character.speedUp,
        slowDown: character.slowDown,
        getBoundingBox: character.getBoundingBox,
        getDirection: character.getDirection,
        draw: character.draw,
        update: character.update,
        getPlayerNum: getPlayerNum,
    };
};
