// This function defines the Player module.
// - `ctx` - A canvas context for drawing
// - `x` - The initial x position of the player
// - `y` - The initial y position of the player
// - `gameArea` - The bounding box of the game area
const Zombie = function(ctx, x, y, gameArea, zomNum = 0) {

    // This is the sprite sequences of the player facing different directions.
    // It contains the idling sprite sequences `idleLeft`, `idleUp`, `idleRight` and `idleDown`,
    // and the moving sprite sequences `moveLeft`, `moveUp`, `moveRight` and `moveDown`.
    const sequences = [{
        /* Moving sprite sequences for facing different directions */
        idleDown:       { x: 0, y: 225, width: 112.5, height: 112.5, rotate: 180, count: 1, timing: 200, loop: false },

        moveLeft:       { x: 0, y: 225, width: 112.5, height: 112.5, rotate: 180, count: 4, timing: 200, loop: true },
        moveLeftUp:     { x: 0, y: 225, width: 112.5, height: 112.5, rotate: 225, count: 4, timing: 200, loop: true },
        moveUp:         { x: 0, y: 225, width: 112.5, height: 112.5, rotate: 270, count: 4, timing: 200, loop: true },
        moveRightUp:    { x: 0, y: 225, width: 112.5, height: 112.5, rotate: 315, count: 4, timing: 200, loop: true },
        moveRight:      { x: 0, y: 225, width: 112.5, height: 112.5, rotate: 0, count: 4, timing: 200, loop: true },
        moveRightDown:  { x: 0, y: 225, width: 112.5, height: 112.5, rotate: 45, count: 4, timing: 200, loop: true },
        moveDown:       { x: 0, y: 225, width: 112.5, height: 112.5, rotate: 90, count: 4, timing: 200, loop: true },
        moveLeftDown:   { x: 0, y: 225, width: 112.5, height: 112.5, rotate: 135, count: 4, timing: 200, loop: true },
    },{
        idleDown:       { x: 450, y: 225, width: 112.5, height: 112.5, rotate: 180, count: 1, timing: 200, loop: false },

        moveLeft:       { x: 450, y: 225, width: 112.5, height: 112.5, rotate: 180, count: 4, timing: 200, loop: true },
        moveLeftUp:     { x: 450, y: 225, width: 112.5, height: 112.5, rotate: 225, count: 4, timing: 200, loop: true },
        moveUp:         { x: 450, y: 225, width: 112.5, height: 112.5, rotate: 270, count: 4, timing: 200, loop: true },
        moveRightUp:    { x: 450, y: 225, width: 112.5, height: 112.5, rotate: 315, count: 4, timing: 200, loop: true },
        moveRight:      { x: 450, y: 225, width: 112.5, height: 112.5, rotate: 0, count: 4, timing: 200, loop: true },
        moveRightDown:  { x: 450, y: 225, width: 112.5, height: 112.5, rotate: 45, count: 4, timing: 200, loop: true },
        moveDown:       { x: 450, y: 225, width: 112.5, height: 112.5, rotate: 90, count: 4, timing: 200, loop: true },
        moveLeftDown:   { x: 450, y: 225, width: 112.5, height: 112.5, rotate: 135, count: 4, timing: 200, loop: true },
    },{
        idleDown:       { x: 0, y: 450, width: 112.5, height: 112.5, rotate: 180, count: 1, timing: 200, loop: false },

        moveLeft:       { x: 0, y: 450, width: 112.5, height: 112.5, rotate: 180, count: 4, timing: 200, loop: true },
        moveLeftUp:     { x: 0, y: 450, width: 112.5, height: 112.5, rotate: 225, count: 4, timing: 200, loop: true },
        moveUp:         { x: 0, y: 450, width: 112.5, height: 112.5, rotate: 270, count: 4, timing: 200, loop: true },
        moveRightUp:    { x: 0, y: 450, width: 112.5, height: 112.5, rotate: 315, count: 4, timing: 200, loop: true },
        moveRight:      { x: 0, y: 450, width: 112.5, height: 112.5, rotate: 0, count: 4, timing: 200, loop: true },
        moveRightDown:  { x: 0, y: 450, width: 112.5, height: 112.5, rotate: 45, count: 4, timing: 200, loop: true },
        moveDown:       { x: 0, y: 450, width: 112.5, height: 112.5, rotate: 90, count: 4, timing: 200, loop: true },
        moveLeftDown:   { x: 0, y: 450, width: 112.5, height: 112.5, rotate: 135, count: 4, timing: 200, loop: true },
    }];

    const dieSequences = [{
        /* Moving sprite sequences for facing different directions */
        moveLeft:       { x: 0, y: 337.5, width: 112.5, height: 112.5, rotate: 180, count: 4, timing: 200, loop: false },
        moveLeftUp:     { x: 0, y: 337.5, width: 112.5, height: 112.5, rotate: 225, count: 4, timing: 200, loop: false },
        moveUp:         { x: 0, y: 337.5, width: 112.5, height: 112.5, rotate: 270, count: 4, timing: 200, loop: false },
        moveRightUp:    { x: 0, y: 337.5, width: 112.5, height: 112.5, rotate: 315, count: 4, timing: 200, loop: false },
        moveRight:      { x: 0, y: 337.5, width: 112.5, height: 112.5, rotate: 0, count: 4, timing: 200, loop: false },
        moveRightDown:  { x: 0, y: 337.5, width: 112.5, height: 112.5, rotate: 45, count: 4, timing: 200, loop: false },
        moveDown:       { x: 0, y: 337.5, width: 112.5, height: 112.5, rotate: 90, count: 4, timing: 200, loop: false },
        moveLeftDown:   { x: 0, y: 337.5, width: 112.5, height: 112.5, rotate: 135, count: 4, timing: 200, loop: false },
    },{
        moveLeft:       { x: 450, y: 337.5, width: 112.5, height: 112.5, rotate: 180, count: 4, timing: 200, loop: false },
        moveLeftUp:     { x: 450, y: 337.5, width: 112.5, height: 112.5, rotate: 225, count: 4, timing: 200, loop: false },
        moveUp:         { x: 450, y: 337.5, width: 112.5, height: 112.5, rotate: 270, count: 4, timing: 200, loop: false },
        moveRightUp:    { x: 450, y: 337.5, width: 112.5, height: 112.5, rotate: 315, count: 4, timing: 200, loop: false },
        moveRight:      { x: 450, y: 337.5, width: 112.5, height: 112.5, rotate: 0, count: 4, timing: 200, loop: false },
        moveRightDown:  { x: 450, y: 337.5, width: 112.5, height: 112.5, rotate: 45, count: 4, timing: 200, loop: false },
        moveDown:       { x: 450, y: 337.5, width: 112.5, height: 112.5, rotate: 90, count: 4, timing: 200, loop: false },
        moveLeftDown:   { x: 450, y: 337.5, width: 112.5, height: 112.5, rotate: 135, count: 4, timing: 200, loop: false },
    },{
        moveLeft:       { x: 0, y: 562.5, width: 112.5, height: 112.5, rotate: 180, count: 4, timing: 200, loop: false },
        moveLeftUp:     { x: 0, y: 562.5, width: 112.5, height: 112.5, rotate: 225, count: 4, timing: 200, loop: false },
        moveUp:         { x: 0, y: 562.5, width: 112.5, height: 112.5, rotate: 270, count: 4, timing: 200, loop: false },
        moveRightUp:    { x: 0, y: 562.5, width: 112.5, height: 112.5, rotate: 315, count: 4, timing: 200, loop: false },
        moveRight:      { x: 0, y: 562.5, width: 112.5, height: 112.5, rotate: 0, count: 4, timing: 200, loop: false },
        moveRightDown:  { x: 0, y: 562.5, width: 112.5, height: 112.5, rotate: 45, count: 4, timing: 200, loop: false },
        moveDown:       { x: 0, y: 562.5, width: 112.5, height: 112.5, rotate: 90, count: 4, timing: 200, loop: false },
        moveLeftDown:   { x: 0, y: 562.5, width: 112.5, height: 112.5, rotate: 135, count: 4, timing: 200, loop: false },
    }];

    let speed = 20;
    let zombieNum = zomNum;
    let dead = false;
    // This is the sprite object of the player created from the Sprite module.
    const character = Character(ctx, x, y, gameArea, sequences[zombieNum], speed);

    const selectTarget = (player1, player2, x, y) => {
        const player1XY = player1.getBoundingBox().getCenter();
        const player2XY = player2.getBoundingBox().getCenter();
        const distance1 = Math.sqrt((player1XY.x - x)**2 + (player1XY.y - y)**2)
        const distance2 = Math.sqrt((player2XY.x - x)**2 + (player2XY.y - y)**2)
        return distance1 <= distance2 ? (player1.getDead() ? player2XY : player1XY) : (player2.getDead() ? player1XY : player2XY)
    }

    //calculate angle towards the target of the zombie
    const calculateAngle = (player1, player2, x, y) => {
        const targetXY = selectTarget(player1, player2, x, y);
        const dy = targetXY.y - y;
        const dx = targetXY.x - x;
        return Math.atan2(dy, dx);
    }

    const move = (angle) => {
        if(!dead){
            let direction;
            const pi = Math.PI;

            if(angle <= (-11)*pi/12 || angle >= 11*pi/12) direction = 1;
            else if(angle <= (-7)*pi/12 && angle >= (-11)*pi/12) direction = 2;
            else if(angle <= (-5)*pi/12 && angle >= (-7)*pi/12) direction = 3;
            else if(angle <= (-1)*pi/12 && angle >= (-5)*pi/12) direction = 4;
            else if(angle <= (1)*pi/12 && angle >= (-1)*pi/12) direction = 5;
            else if(angle <= (5)*pi/12 && angle >= (1)*pi/12) direction = 6;
            else if(angle <= (7)*pi/12 && angle >= (5)*pi/12) direction = 7;
            else if(angle <= (11)*pi/12 && angle >= (7)*pi/12) direction = 8;

            character.move(direction);
        }
    }

    const update = (time, player1, player2) => {
        let { x, y } = character.getXY();
        const angle = calculateAngle(player1, player2, x, y)
        move(angle);

        //calculate the speed
        const dx = speed * Math.cos(angle) / 60;
        const dy = speed * Math.sin(angle) / 60;
        x += dx; y += dy;

        if (gameArea.isPointInBox(x, y)) character.setXY(x, y);

        character.updateSprite(time);
    }

    const die = () => {
        dead = true;
        speed = 0;
        character.setSequence(Object.values(dieSequences[zombieNum])[character.getDirection()-1]);
    }

    const getDead = () => {
        return dead;
    }

    const getZombieNum = () => {
        return zombieNum
    }

    // The methods are returned as an object here.
    return {
        move: move,
        //stop: character.stop,
        die: die,
        getDead: getDead,
        getXY: character.getXY,
        setXY: character.setXY,
        speedUp: character.speedUp,
        slowDown: character.slowDown,
        getBoundingBox: character.getBoundingBox,
        getDirection: character.getDirection,
        draw: character.draw,
        update: update,
        calculateAngle: calculateAngle,
        getZombieNum: getZombieNum,
    };
};