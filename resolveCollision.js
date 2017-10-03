function resolveCollision(b1, b2) {
    var ball1 = ballList.balls[b1];
    var ball2 = ballList.balls[b2];

    // get the mtd
    var pos1 = ball1.position.clone();
    var pos2 = ball2.position.clone();
    var delta = pos1.sub(ball2.position);
    var d = delta.length();
    
    // minimum translation distance to push balls apart after intersecting
    var tmp = ((ball1.radius + ball2.radius)-d) / d;
    var mtd = delta.scale(tmp);

    // resolve intersection --
    // inverse mass quantities
    var im1 = 1 / BALL_MASS;
    var im2 = 1 / BALL_MASS;

    // push-pull them apart based off their mass
    //TODO may need...
    //var newPos1 = pos1.add(mtd.scale(im1 / (im1 + im2)));
    //var newPos2 = pos2.sub(mtd.scale(im2 / (im1 + im2)));

    // impact speed
    var vel1 = ball1.velocity.clone();
    var vel2 = ball2.velocity.clone();
    var v = vel1.sub(vel2);
    var mtdn = mtd.norm();
    var vn = v.dot(mtd.norm());

    // sphere intersecting but moving away from each other already
    if(vn > 0.0) {
        return;
    }

    // collision impulse
    var i = (-(1.0 + RESTITUTION) * vn) / (im1 + im2);
    var impulse = mtd.scale(i);

    // change in momentum
    var newVel1 = vel1.add(impulse.scale(im1)); 
    var newVel2 = vel2.sub(impulse.scale(im2)); 
    ball1.velocity = newVel1;
    ball1.update();
    ball2.velocity = newVel2;
    ball2.update();
}
