function shoot() {
    var x = document.getElementById('cue_x').value; 
    var y = document.getElementById('cue_y').value; 
    var velocity = document.getElementById('cue_velocity').value; 
    var cue_ball = ballList.balls[0];
    cue_ball.velocity.x = x * velocity;
    cue_ball.velocity.y = y * velocity;
    ballList.showGhostBall = false;
    ballList.balls[0] = cue_ball;
}
