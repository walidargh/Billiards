var Ball = require('./ball');
var Util = require('./util');
var Cue =  require('./cue');
var Weapon = require('./weapon');

var Game = function () {
	this.balls = [];

	this.populateTable();
	this.cue = new Cue ();
	this.cue.listen();
	// this.weapons = [];
	// this.getWeapons();
	// this.weaponAction();
	// setInterval(this.addBalls, )
};

Game.DIM_X = 1000;
Game.DIM_Y = 1000;
Game.FPS = 32;
Game.BG_COLOR = "#000000";

Game.prototype.findBall = function (value) {
	return this.balls[value].position;
};

Game.prototype.getWeapons = function () {
	var types = ['Bomb'];
	this.weapons.push(new Weapon({
		type: types[0],
		game: this
	}
	));
};

Game.prototype.populateTable = function () {
	var game = this;
		for (var i = 0; i < 16; i++) {
			var suit;
			var color = null;
			if (i === 0) {
				suit = "cue";
				color = "#FFFFFF";
			} else if (i < 9 ) {
					suit = "solid";
				} else {
						suit = "striped";
					}
			this.balls.push(new Ball(
				{
					position: [1000*Math.random() - 10, 1000*Math.random() - 10],
					velocity: [1*(2*Math.random() - 1), 1*(2*Math.random() - 1)],
					number: i,
					suit: suit,
					game: game,
					color: color
				}

			));
		}
		// 		suit = "stripe"
		// 		this.balls.push(new Ball(
		// 	{
		// 		position: [100, 100],
		// 		velocity: [10, 0],
		// 		number: 0,
		// 		suit: suit,
		// 		color: "#FF0",
		// 		game: game
		// 	}

		// ));
		// 				this.balls.push(new Ball(
		// 	{
		// 		position: [900, 100],
		// 		velocity: [-10, 0],
		// 		number: 1,
		// 		suit: suit,
		// 		game: game
		// 	}

		// ));

		// 	this.balls.push(new Ball(
		// 	{
		// 		position: [0, 100],
		// 		velocity: [2, 0],
		// 		number: 2,
		// 		suit: suit,
		// 		game: game
		// 	}

		// ));
	// var suit = "striped";
	// 		this.balls.push(new Ball(
	// 		{
	// 			position: [0, 0],
	// 			velocity: [2, 2],
	// 			number: 1,
	// 			suit: suit,
	// 			game: game
	// 		}

	// 	));
		// 			this.balls.push(new Ball(
		// 	{
		// 		position: [0, 100],
		// 		velocity: [2, -2],
		// 		number: 1,
		// 		suit: suit,
		// 		game: game
		// 	}

		// ));
};

Game.prototype.isOutOfBounds = function(ball) {
	if (ball.position[0] > Game.DIM_X - ball.radius) {
		// var vectorDifference = Util.subtract(Game.DIM_Y - ball.radius - ball.position[0]);
		// var distance = Util.distance(this.position[0])
		this.backInFrame( ball, [ball.position[0] - Game.DIM_X + ball.radius, 0] );
		return [-1, 1];
	}
	else if (ball.position[0] < ball.radius) {
		this.backInFrame( ball, [ball.radius - ball.position[0], 0] );
		return [-1, 1];
	}	
	else if (ball.position[1] > Game.DIM_Y - ball.radius) {
		this.backInFrame( ball, [0, ball.position[1] - Game.DIM_Y + ball.radius] );
		return [1, -1];
	}
	else if (ball.position[1] < ball.radius) {
		this.backInFrame(ball, [0, ball.radius - ball.position[1]]);
		return [1, -1];
	}
	else {
		return false;
	}
};

Game.prototype.step = function (deltaTime) {
	this.moveAll(deltaTime);
	this.checkCollisions();
	if (this.allStopped()) {
		this.cue.place();
	}
};

Game.prototype.moveAll = function (deltaTime) {
	this.balls.forEach(function (ball) {
		ball.move(deltaTime);
	});
};


Game.prototype.draw = function (ctx) {
	ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
	ctx.fillStyle = Game.BG_COLOR;
	ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);

	this.balls.forEach(function (ball) {
		ball.draw(ctx);
	});
};

Game.prototype.velocities = function () {
	var velocities = [];
	this.balls.forEach(function (ball) {
		velocities.push(ball.velocity);
	});
	return velocities;
};

Game.prototype.positions = function () {
	var positions = [];
	this.balls.forEach(function (ball) {
		positions.push(ball.position);
	});
	return positions;
};
 
Game.prototype.checkCollisions = function () {
	var initialVelocities = this.velocities();
	var initialPositions = this.positions();
	var game = this;
	this.balls.forEach(function (ball) {
	});

	this.balls.forEach(function (ball) {
		game.balls.forEach(function (otherBall) {

			if (ball === otherBall) {
				return;
			}

			if (ball.isCollidedWith(otherBall)) {
				ball.ballCollision(initialVelocities[otherBall.number], initialPositions[otherBall.number]);
			}

		});
	});

};

Game.prototype.allStopped = function () {
	var balls = this.balls;
	for (var i = balls.length - 1; i >= 0; i--) {
		var ballSpeed = Util.norm(balls[i].velocity);
		if (ballSpeed !== 0) {
			return false;
		}
	}
	return true;
};

Game.prototype.weaponAction = function () {
	var selectedWeapon = 
		this.weapons[Math.floor(Math.random() * this.weapons.length)];
	selectedWeapon.place();
};

Game.prototype.backInFrame = function (ball, distance) {
	var scaledVelocity;
	if (distance[0]) {
		scaledVelocity = Util.scale(ball.velocity, distance[0]/Math.abs(ball.velocity[0]));
	} else {
		scaledVelocity = Util.scale(ball.velocity, distance[1]/Math.abs(ball.velocity[1]));
	}
	ball.position = Util.subtract(ball.position, scaledVelocity);
};

module.exports = Game;
 

