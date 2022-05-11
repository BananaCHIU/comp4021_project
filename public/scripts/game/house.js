const House = function (ctx, gameArea) {

    const { x, y } = gameArea.getCenter();

    const sprite = Sprite(ctx, x, y);

    const sequence =  { x: 0, y: 0, width: 320, height: 240, count: 1, timing: 0, loop: false };

    sprite.setSequence(sequence)
        .setScale(0.5)
        .setShadowScale({ x: 0, y: 0 })
        .useSheet("assets/house.png");

    // const update = () => {
    //     let { x, y } = sprite.getXY();
    //
    //     /* Set the new position if it is within the game area */
    //     if (gameArea.isPointInBox(x, y))
    //         sprite.setXY(x, y);
    //     else
    //         sprite.setScale(0);
    // }

    return {
        getBoundingBox: sprite.getBoundingBox,
        draw: sprite.draw,
    }
}