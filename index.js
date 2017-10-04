// Function to play sound depending on what was passed through.
//To add a sound add an audio tag in the area marked below the canvas and give it a //relevant id. Add the audio into the sound folder and link to it in the audio tag.
function playSound(sound){
  switch(sound){
    case 'ball_potted':
      document.getElementById('ball_potted').play();
      break;
    default:
      break;

  }
}

function changeColor(selectedObject) {
   var color = selectedObject.value;
   var canvas = document.getElementById("canvas");
   canvas.style.backgroundColor = color;
};
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
            playSound('ball_potted');
	    return true;
        }
    }
    return false;
}
function onloadHandler()
{
   // get the canvas DOM element
   var canvas = document.getElementById('canvas'),
       ctx = canvas.getContext("2d"),
       width = canvas.width,
       height = canvas.height;

   document.getElementById('felt_color').onchange = getFeltColor;

   // data structures - generate initial balls
   ballList = new BallList();
   ballList.balls = getRack();

   function getRack() {
       var radius = BALL_RADIUS;
       var xFactor = 1.73205;
       var x = 800;
       var y = 320;

       return [
          new Ball(0, WHITE, CUE, 200, y,  radius),

          new Ball(1, YELLOW, SOLID, x-4, y,  radius),

          new Ball(2, BLUE, SOLID, x+radius*xFactor-3, y-radius,  radius),
          new Ball(3, RED, SOLID, x+radius*xFactor-3, y+radius,  radius),

          new Ball(4, PURPLE, SOLID, x+2*radius*xFactor-2, y-radius*2,  radius),
          new Ball(8, BLACK, SOLID, x+2*radius*xFactor-2, y,  radius),
          new Ball(6, GREEN, SOLID, x+2*radius*xFactor-2, y+radius*2,  radius),

          new Ball(7, MAROON, SOLID, x+3*radius*xFactor-1, y-radius*3,  radius),
          new Ball(5, ORANGE, SOLID, x+3*radius*xFactor-1, y+radius*3,  radius),
          new Ball(9, YELLOW, STRIPE, x+3*radius*xFactor-1, y-radius,  radius),
          new Ball(10, BLUE, STRIPE, x+3*radius*xFactor-1, y+radius,  radius),

          new Ball(11, RED, STRIPE, x+4*radius*xFactor, y-radius*4,  radius),
          new Ball(12, PURPLE, STRIPE, x+4*radius*xFactor, y-radius*2,  radius),
          new Ball(13, ORANGE, STRIPE, x+4*radius*xFactor, y,  radius),
          new Ball(14, GREEN, STRIPE, x+4*radius*xFactor, y+radius*2,  radius),
          new Ball(15, MAROON, STRIPE, x+4*radius*xFactor, y+radius*4,  radius),
       ];
    }

   function getFeltColor()
   {
     FELT_COLOR = this.value;
   }

   function drawText(x, y, text, color)
   {
     ctx.fillStyle = color;
     ctx.fillText(text, x, y);
   };

   function drawDisc(x, y, rad, color)
   {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, rad, 0, TWOPI, true);
      ctx.fill();
   };

   function drawPockets() {
      ctx.fillStyle = BLACK;

      //top left
      ctx.beginPath();
      ctx.arc(30, 20, 30, 0, TWOPI, true);
      ctx.fill();

      //top middle
      ctx.beginPath();
      ctx.arc(X_MAX/2, 10, 30, 0, TWOPI, true);
      ctx.fill();

      //top right
      ctx.beginPath();
      ctx.arc(X_MAX-30, 20, 30, 0, TWOPI, true);
      ctx.fill();

      //bottom left
      ctx.beginPath();
      ctx.arc(30, Y_MAX-20, 30, 0, TWOPI, true);
      ctx.fill();

      //bottom middle
      ctx.beginPath();
      ctx.arc(X_MAX/2, Y_MAX-10, 30, 0, TWOPI, true);
      ctx.fill();

      //bottom right
      ctx.beginPath();
      ctx.arc(X_MAX-30, Y_MAX-20, 30, 0, TWOPI, true);
      ctx.fill();
   }

   function drawBumpers() {
      //green bumpers
      ctx.fillStyle = FELT_COLOR;
      //top left
      ctx.beginPath();
      ctx.moveTo(50,10);
      ctx.lineTo(X_MAX/2-20, 10);
      ctx.lineTo(X_MAX/2-40, 35);
      ctx.lineTo(75,35);
      ctx.fill();

      //top right
      ctx.beginPath();
      ctx.moveTo(X_MAX/2+20, 10);
      ctx.lineTo(X_MAX-50, 10);
      ctx.lineTo(X_MAX-75, 35);
      ctx.lineTo(X_MAX/2+40,35);
      ctx.fill();

      //bottom left
      ctx.beginPath();
      ctx.moveTo(50,Y_MAX-10);
      ctx.lineTo(X_MAX/2-20, Y_MAX-10);
      ctx.lineTo(X_MAX/2-40, Y_MAX-35);
      ctx.lineTo(75,Y_MAX-35);
      ctx.fill();

      //bottom right
      ctx.beginPath();
      ctx.moveTo(X_MAX/2+20, Y_MAX-10);
      ctx.lineTo(X_MAX-50, Y_MAX-10);
      ctx.lineTo(X_MAX-75, Y_MAX-35);
      ctx.lineTo(X_MAX/2+40,Y_MAX-35);
      ctx.fill();

      //left
      ctx.beginPath();
      ctx.moveTo(20, 50);
      ctx.lineTo(20, Y_MAX-50);
      ctx.lineTo(35, Y_MAX-70);
      ctx.lineTo(35,70);
      ctx.fill();

      //right
      ctx.beginPath();
      ctx.moveTo(X_MAX-20, 50);
      ctx.lineTo(X_MAX-20, Y_MAX-50);
      ctx.lineTo(X_MAX-35, Y_MAX-70);
      ctx.lineTo(X_MAX-35,70);
      ctx.fill();

      //wooden rails
      ctx.fillStyle = BROWN;

      //top rail
      ctx.beginPath();
      ctx.rect(0,0,X_MAX, 20);
      ctx.fill();

      //right rail
      ctx.beginPath();
      ctx.rect(X_MAX-20,0,X_MAX-20, Y_MAX);
      ctx.fill();

      //bottom rail
      ctx.beginPath();
      ctx.rect(0,Y_MAX-20,X_MAX, Y_MAX);
      ctx.fill();

      //left rail
      ctx.beginPath();
      ctx.rect(0,0,20, Y_MAX);
      ctx.fill();


      //background behind tracks
      ctx.fillStyle = GREY;
      ctx.beginPath();
      ctx.rect(X_MAX,0,70,Y_MAX);
      ctx.fill();

      //potted ball tracks
      ctx.fillStyle = DARK_GREY;
      ctx.beginPath();
      ctx.rect(X_MAX+20,100,10,Y_MAX);
      ctx.fill();
      ctx.beginPath();
      ctx.rect(X_MAX+40,100,10,Y_MAX);
      ctx.fill();

      //little curve tracks
      ctx.beginPath();
      ctx.strokeStyle = DARK_GREY;
      ctx.lineWidth = 10;
      ctx.arc(X_MAX+5, 100, 20, 1.5*PI, 0, false);
      ctx.stroke();
      ctx.beginPath();
      ctx.lineWidth = 10;
      ctx.arc(X_MAX+5, 100, 40, 1.5*PI, 0, false);
      ctx.stroke();

      //small little horizontal tracks
      ctx.beginPath();
      ctx.rect(X_MAX,55,5,10);
      ctx.fill();
      ctx.beginPath();
      ctx.rect(X_MAX,75,5,10);
      ctx.fill();

   }

   // event handlers
   var mouseClick = function(e)
   {
      ballList.mousex = e.clientX - offsetx;
      ballList.mousey = e.clientY - offsety;
      ballList.showGhostBall = !ballList.showGhostBall;
      //normalize ghostball
      var cue_ball = ballList.balls[0];
      var dx = ballList.mousex - (cue_ball.position.x);
      var dy = ballList.mousey - (cue_ball.position.y);
      var length = Math.sqrt(dx * dx + dy * dy);
      var newVelX = dx / length;
      var newVelY = dy / length;
      document.getElementById('cue_x').value = newVelX;
      document.getElementById('cue_y').value = newVelY;
      document.getElementById('cue_velocity').value = length / 30;
   };
   canvas.addEventListener("click", mouseClick, false);

   var offsetx = 0, offsety = 0;

   // init main animation loop
   requestAnimFrame(loop);
   function loop()
   {
      // compute canvas offset within parent window including page view position
      var el = canvas;
      offsetx = offsety = 0;
      do
      {
         offsetx += el.offsetLeft;
         offsety += el.offsetTop;
      } while (el = el.offsetParent);
      offsetx = offsetx - window.pageXOffset;
      offsety = offsety - window.pageYOffset;

      ctx.save();

      // clear the left side of the card
      // the right hand side is already rendered with fixed text
      ctx.clearRect(0, 0, width, height);

      // perform initial one time rendering of text etc.
      /*
      ctx.save();
      ctx.font = "Bold 40pt Arial";
      drawText(320,080,"Pool - by Devin Gray", WHITE);
      ctx.restore();
      */

      drawBumpers();
      drawPockets();

      // render each edge ball - which react to mouse movement
      ctx.globalCompositeOperation = 'darker';
      ballList.update();
      ballList.render();

      ctx.restore();

      requestAnimFrame(loop);
   };

   // data structures
   function BallList()
   {
      this.mousex = this.mousey = 0;
      this.balls = [];
      this.showGhostBall = false;

      this.update = function()
      {
	 //collison detection
	 //check for potted balls
         for (var i = 0; i < this.balls.length; i++)
         {
	     if(potted(i)) {
	         ball = this.balls[i];
		 if(ball.type == CUE) {
		     console.log("SCRATCH - auto respawning...");
		     ball.velocity.x = 0;
         	     ball.velocity.y = 0;
         	     ball.position.x = 200;
		     ball.position.y = 320;
		     ball.potted = false;
		     continue;
		 }

		 //TODO draw animation for ball to drop in pocket
		 // for now... just put the ball in the tracks based on number potted
		 pottedBalls.push(ball);
		 ball.potted = true;
		 ball.position.x = X_MAX+35;
		 ball.position.y = Y_MAX-(ball.radius*2 * pottedBalls.length);
		 ball.velocity.x = 0;
		 ball.velocity.y = 0;

             }
	 }

	 //now check bumpers
         for (var i = 0; i < this.balls.length; i++)
         {
            ball = this.balls[i];

	    //if potted, no collision with bumper
	    if(ball.potted) {
                continue;
	    }

	    if(ball.position.x > X_MAX-BUMPER_WIDTH-ball.radius || ball.position.x < 0+BUMPER_WIDTH+ball.radius) {
                ball.velocity.x *= -1;
	    }
	    if(ball.position.y > Y_MAX-BUMPER_WIDTH-ball.radius || ball.position.y < 0+BUMPER_WIDTH+ball.radius) {
                ball.velocity.y *= -1;
	    }

            ball.update();
         }

	 //now check balls
         for (var b1 = 0; b1 < this.balls.length; b1++)
         {
             for (var b2 = b1 + 1; b2 < this.balls.length; b2++)
             {
                 if(colliding(b1, b2)) {
		     resolveCollision(b1, b2);
		 }
             }
         }
      };

      this.render = function()
      {
         for (var i = 0; i < this.balls.length; i++)
         {
            ctx.save();
            this.balls[i].render();
            ctx.restore();
         }

	 if(this.showGhostBall) {
	     //draw the ghost ball
             ctx.fillStyle = GHOST_WHITE;
             ctx.strokeStyle = GHOST_WHITE;
	     ctx.lineWidth = 1;
             ctx.beginPath();
             ctx.arc(this.mousex, this.mousey, BALL_RADIUS, 0, TWOPI, true);
             ctx.fill();
	     //draw the ghost line
	     ctx.beginPath();
	     ctx.moveTo(this.balls[0].position.x, this.balls[0].position.y);
	     ctx.lineTo(this.mousex, this.mousey);
	     ctx.stroke();
	 }
      };
   };

   function Ball(num, color, type, x, y, radius)
   {
      this.num = num;
      this.color = color;
      this.type = type;
      this.origin = new Vector(x,y);
      this.position = new Vector(x,y);
      this.radius = radius;
      this.velocity = new Vector(0,0);
      this.friction = 0.991;
      this.potted = false;

      this.update = function()
      {
         this.velocity.x *= this.friction;
         this.position.x += this.velocity.x;

         this.velocity.y *= this.friction;
         this.position.y += this.velocity.y;
      };

      this.render = function()
      {
	 //if(this.potted) {
	 //    return;
	 //}
         ctx.fillStyle = this.color;
         ctx.beginPath();
         ctx.arc(this.position.x, this.position.y, this.radius, 0, TWOPI, true);
         ctx.fill();

         //draw inner circle
	 if(this.type != CUE) {
             ctx.fillStyle = WHITE;
             ctx.beginPath();
             ctx.arc(this.position.x, this.position.y, this.radius/2, 0, TWOPI, true);
             ctx.fill();
         }

	 //draw the stripe
	 if(this.type == STRIPE) {
             ctx.fillStyle = WHITE;
             ctx.beginPath();
             ctx.arc(this.position.x, this.position.y, this.radius, 1.5*PI-0.8, 1.5*PI+0.8, false);
             ctx.fill();
             ctx.beginPath();
             ctx.arc(this.position.x, this.position.y, this.radius, 0.5*PI-0.8, 0.5*PI+0.8, false);
             ctx.fill();
	 }

	 // draw the little curved line below the 6 and 9 ball
	 if(this.num == 6 || this.num == 9) {
             ctx.strokeStyle = BLACK;
             ctx.beginPath();
             ctx.lineWidth = 1;
             ctx.arc(this.position.x, this.position.y, this.radius/3, 0.5*PI-0.5, 0.5*PI+0.5, false);
             ctx.stroke();
	 }

         // draw the ball number text
	 if(this.type != CUE) {
             ctx.save();
	     var fontSize = this.radius / 2;
             ctx.font = "Bold " + fontSize + "pt Arial";
             var textFudge = this.num > 9 ? 2.9 : 1.3;
             drawText(this.position.x-textFudge*3,this.position.y+textFudge+3.1, this.num, BLACK);
             ctx.restore();
	 }

	 // draw cue ball's little red dots
	 if(this.type == CUE) {
             ctx.fillStyle = RED;
             ctx.beginPath();
             ctx.arc(this.position.x, this.position.y, this.radius/6, 0, TWOPI, true);
             ctx.fill();
	 }
      };
   };

   document.addEventListener("keydown", keyDownEvent, false);

   function keyDownEvent(e) {
       var keyCode = e.keyCode;
       if(keyCode == 32) { //space bar
           shoot();
       }
   }
}
// requestAnimFrame shim
window.requestAnimFrame = (function()
{
   return  window.requestAnimationFrame       ||
           window.webkitRequestAnimationFrame ||
           window.mozRequestAnimationFrame    ||
           window.oRequestAnimationFrame      ||
           window.msRequestAnimationFrame     ||
           function(callback, element)
           {
               window.setTimeout(callback, 1000 / 60);
           };
})();