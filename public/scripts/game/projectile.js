//TODO: Get the facing direction of player (Left === -1, Right === 1)
const Projectile = (ctx, player, gameArea, direction) => {

    const speed = 500;

    const { x, y } = player.getBoundingBox().getCenter();
    console.log(x, y)

    const sprite = Sprite(ctx, x, y);

    const sequence = {
        left: { x: 0, y: 0, width: 16, height: 16, count: 1, timing: 0, loop: false },
        right: { x: 0, y: 16, width: 16, height: 16, count: 1, timing: 0, loop: false },
    };

    sprite.setSequence(direction === 1 ? sequence.right : sequence.left)
        .setScale(0.5)
        .setShadowScale({ x: 0, y: 0 })
        .useSheet("assets/bullet_sprites.png");

    const update = () => {
        let { x, y } = sprite.getXY();

        /* Move the bullet */
        x += (speed * direction) / 60

        /* Set the new position if it is within the game area */
        if (gameArea.isPointInBox(x, y))
            sprite.setXY(x, y);
        else
            sprite.setScale(0);
    }

    return {
        getBoundingBox: sprite.getBoundingBox,
        draw: sprite.draw,
        update: update
    }
}