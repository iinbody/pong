//Feburary 17th 2017, original
$(document).ready(function(){

	var canvas = $("#canvas")[0];
	var ctx = canvas.getContext("2d");
	var w = $("#canvas").width();
	var h = $("#canvas").height();
	var pi = Math.PI;
	var tickRate = 60;
	var ph = 40;
	var pw = 5;
	var paddles = [];
	var paddleSpeed = tickRate/6;
	paddles.push(new newPaddle(20, h/2));
	paddles.push(new newPaddle(w-20, h/2));
	var ballRadius = 10;
	var ballSpeed = 5;
	var balls = [];
	var startDirection = Math.floor(Math.random()*2)*pi;
	var dirMod = 0;
	var leftScore = 0; var rightScore = 0;
	

	var startScreen = function(){
		ctx.strokeStyle = "black";
        ctx.strokeRect(0, 0, w, h);
		drawRectangle(w/2-50,h/2-25,100,50,10);
	}

	var startGame = function(){
		restartGame();
		game_loop = setInterval(paintGame, tickRate);
		paintGame();
	}

	var restartGame = function(){
		for(var i=0; i<paddles.length; i++){
			paddles[i].y = h/2-ph/2;
		}
		balls = [];
		balls.push(new newBall(w/2, h/2, ballSpeed, startDirection)) //need direction based on last score
	}

	var paintGame = function(){
		console.log("paint");
		paintBackground();
		paintBall(0); //currently hardcoded for 1 ball
		paintPaddle();
		moveBalls();

		if(map[87]){ //paddle one up
			if(paddles[0].y >= 0){
				paddles[0].y -= paddleSpeed;
			}
		}else if(map[83]){ //paddle one down
			if(paddles[0].y <= h-ph){
				paddles[0].y += paddleSpeed;
			}
		}
		if(map[38]){ //paddle two up
			if(paddles[1].y >= 0){
				paddles[1].y -= paddleSpeed;
			}
		}else if(map[40]){ //paddle two down
			if(paddles[1].y <= h-ph){
				paddles[1].y += paddleSpeed;
			}		}
	}

	var drawRectangle = function(x,y,width,height,corner){
		ctx.fillStyle = "grey";
		ctx.beginPath();
		ctx.moveTo(x+corner, y);
		ctx.arc(x+width-corner, y+corner, corner, 3*pi/2, 0);
		ctx.arc(x+width-corner, y+height-corner, corner, 0, pi/2);
		ctx.arc(x+corner, y+height-corner, corner, pi/2, pi);
		ctx.arc(x+corner, y+corner, corner, pi, 3*pi/2);
		ctx.fill();
		ctx.fillStyle = "white";
		ctx.font="30px sans-serif";
		ctx.fillText("Start",x+corner,y+height/2);
	}

	var paintScores = function(){
		
	}

	 function newBall(x,y,speed,direction){
		this.x = x;
		this.y = y;
		this.speed = speed;
		this.direction = direction;
		this.addSpeed = function(){
			this.speed += 1;
		}
		this.moveBall = function(){
			this.x += this.speed * Math.cos(this.direction);
			this.y += this.speed * Math.sin(this.direction);
			this.hitPaddle();
			this.hitWall();
			this.outOfBounds();
		}
		this.hitPaddle = function(){//check if ball is in either paddle area
			if(this.x < (paddles[0].x + pw + ballRadius) && this.x > (paddles[0].x - ballRadius) && this.y > (paddles[0].y - ballRadius) && this.y < (paddles[0].y + ph + ballRadius)){
				dirMod=0;
				if(map[87]){
					dirMod = pi/32;
				}else if(map[83]){
					dirMod = -pi/32;
				}

				this.direction = pi - this.direction - dirMod * Math.random();
				this.addSpeed();
			}
			if(this.x < (paddles[1].x + pw + ballRadius) && this.x > (paddles[1].x - ballRadius) && this.y > (paddles[1].y - ballRadius) && this.y < (paddles[1].y + ph + ballRadius)){
				dirMod=0;
				if(map[38]){
					dirMod = -pi/32;
				}else if(map[40]){
					dirMod = pi/32;
				}
				this.direction = pi - this.direction - dirMod * Math.random();
				this.addSpeed();
			}
		}
		this.hitWall = function(){
			if(this.y > h - ballRadius || this.y < 0 + ballRadius){
				this.direction = (-this.direction);
				//console.log(this.direction);
			}
		}
		this.outOfBounds = function(){
			if(this.x > w){//left scores
				startDirection = 0;
				restartGame();
			}else if(this.x < 0){//right scores
				startDirection = pi;
				restartGame();
			}
		}
	}

	function newPaddle (x, y){
		this.x = x;
		this.y = y;
	}

	var paintBackground = function(){
		ctx.strokeStyle = "white";
		ctx.fillStyle = "grey";
		ctx.fillRect(0, 0, w, h);
        ctx.strokeRect(0, 0, w, h);
	}

	var paintPaddle = function(x,y){
		ctx.fillStyle = "white";
		for(var i = 0; i<paddles.length; i++){
			ctx.fillRect(paddles[i].x, paddles[i].y, pw, ph);
		}
	}

	var paintBall = function(number){
		ctx.fillStyle = "red";
		ctx.beginPath();
		ctx.arc(balls[number].x,balls[number].y, ballRadius, 0, 2*pi);
		ctx.fill();
	}

	var moveBalls = function(){
		balls[0].moveBall(); //hardcoded for 1 ball currently
	}

	var map = []; // You could also use an array
	onkeydown = onkeyup = function(e){
    	e = e || event; // to deal with IE
    	map[e.keyCode] = e.type == 'keydown';
    	//console.log(map);
    	/*if(map[87]){ //paddle one up
			paddles[0].y -= 1;
		}else if(map[83]){ //paddle one down
			paddles[0].y += 1;
		}
		if(map[38]){ //paddle two up
			paddles[1].y -= 1;
		}else if(map[40]){ //paddle two down
			paddles[1].y += 1;
		}*/
	}

	//startScreen();
	startGame();

})