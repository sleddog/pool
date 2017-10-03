function potted(b) {
    var ball = ballList.balls[b];

    //check each pocket
    var pockets = [
        new Vector(30,20), //top left
        new Vector(X_MAX/2,10), //top middle
        new Vector(X_MAX-30,20), //top right
        new Vector(30,Y_MAX-20), //bottom left
        new Vector(X_MAX/2,Y_MAX-10), //bottom middle
        new Vector(X_MAX-30,Y_MAX-20), //bottom right
    ];

    for(var p=0;p<pockets.length; p++) {
	var pocket = pockets[p];
        var dx = ball.position.x - pocket.x;
        var dy = ball.position.y - pocket.y;
        var distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < ball.radius + 25) {
            console.log('POTTED in pocket: '+ p + '!!!!');
	    return true;
        }
    }
    return false;
}