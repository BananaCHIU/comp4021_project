const Projectile = (ctx, player, gameArea) => {

    const speed = 500;
    const diagonal_speed = 354;

    const direction = player.getDirection();

    const { x, y } = player.getBoundingBox().getCenter();

    const sprite = Sprite(ctx, x, y);

    const sequence = {
        moveUp:         { x: 0, y: 0, width: 16, height: 16, count: 1, timing: 0, loop: false },
        moveRightUp:    { x: 0, y: 16, width: 16, height: 16, count: 1, timing: 0, loop: false },
        moveRight:      { x: 0, y: 32, width: 16, height: 16, count: 1, timing: 0, loop: false },
        moveRightDown:  { x: 0, y: 48, width: 16, height: 16, count: 1, timing: 0, loop: false },
        moveDown:       { x: 0, y: 64, width: 16, height: 16, count: 1, timing: 0, loop: false },
        moveLeftDown:   { x: 0, y: 80, width: 16, height: 16, count: 1, timing: 0, loop: false },
        moveLeft:       { x: 0, y: 96, width: 16, height: 16, count: 1, timing: 0, loop: false },
        moveLeftUp:     { x: 0, y: 112, width: 16, height: 16, count: 1, timing: 0, loop: false }
    };

    sprite.setSequence(sequence.moveRight)
        .setScale(0.5)
        .setShadowScale({ x: 0, y: 0 })
        .useSheet("assets/bullet_sprites.png");

    const draw = () => {
        switch (direction) {
            case 1: sprite.setSequence(sequence.moveLeft); break;
            case 2: sprite.setSequence(sequence.moveLeftUp); break;
            case 3: sprite.setSequence(sequence.moveUp); break;
            case 4: sprite.setSequence(sequence.moveRightUp); break;
            case 5: sprite.setSequence(sequence.moveRight); break;
            case 6: sprite.setSequence(sequence.moveRightDown); break;
            case 7: sprite.setSequence(sequence.moveDown); break;
            case 8: sprite.setSequence(sequence.moveLeftDown); break;
        }
        sprite.draw();
    }

    const update = () => {
        let { x, y } = sprite.getXY();

        /* Move the bullet */
        switch (direction) {
            case 1: x -= speed / 60; break;
            case 2: x -= diagonal_speed / 60; y -= diagonal_speed / 60; break;
            case 3: y -= speed / 60; break;
            case 4: x += diagonal_speed / 60; y -= diagonal_speed / 60; break;
            case 5: x += speed / 60; break;
            case 6: x += diagonal_speed / 60; y += diagonal_speed / 60; break;
            case 7: y += speed / 60; break;
            case 8: x -= diagonal_speed / 60; y += diagonal_speed / 60; break;
        }

        /* Set the new position if it is within the game area */
        sprite.setXY(x, y);
    }

    const getPlayer = () => {
        return player;
    }

    return {
        getBoundingBox: sprite.getBoundingBox,
        draw: draw,
        update: update,
        getXY: sprite.getXY,
        getPlayer: getPlayer,
    }
}