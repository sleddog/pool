function colliding(b1, b2) {
    //if potted, no collision possible
    if(b1.potted || b2.potted) {
        return false;
    }

    //compare if this ball "hits" the other
    var ball1 = ballList.balls[b1];
    var ball2 = ballList.balls[b2];

    var dx = ball1.position.x - ball2.position.x;
    var dy = ball1.position.y - ball2.position.y;
    var distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < ball1.radius + ball1.radius) {
	return true;
    }
    return false;
}