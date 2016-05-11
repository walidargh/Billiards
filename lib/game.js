var Ball = require('./ball');

var Game = function () {
	this.balls = [];

	this.populateTable();
};

Game.DIM_X = 1000;
Game.DIM_Y = 1000;
Game.FPS = 32;
Game.BG_COLOR = "#000000";

Game.prototype.populateTable = function (object) {
	var game = this;
		// for (var i = 0; i < 16; i++) {
		// 	var suit;
		// 	if (i === 0) {
		// 		suit = "cue";
		// 	} else if (i < 9 ) {
		// 			suit = "solid";
		// 		} else {
		// 				suit = "striped";
		// 			}
		// 	this.balls.push(new Ball(
		// 		{
		// 			position: [500*Math.random(), 1000*Math.random()],
		// 			velocity: [5*(2*Math.random() - 1), 5*(2*Math.random() - 1)],
		// 			number: i,
		// 			suit: suit,
		// 			game: game
		// 		}

		// 	));
		// }
				suit = "stripe"
				this.balls.push(new Ball(
			{
				position: [0, 0],
				velocity: [2, 2],
				number: 0,
				suit: suit,
				color: "#FF0",
				game: game
			}

		));
						this.balls.push(new Ball(
			{
				position: [0, 150],
				velocity: [2, -2],
				number: 1,
				suit: suit,
				game: game
			}

		));

			this.balls.push(new Ball(
			{
				position: [0, 100],
				velocity: [2, 0],
				number: 2,
				suit: suit,
				game: game
			}

		));
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
	// 				this.balls.push(new Ball(
	// 		{
	// 			position: [0, 100],
	// 			velocity: [2, -2],
	// 			number: 2,
	// 			suit: suit,
	// 			game: game
	// 		}

	// 	));
};

Game.prototype.step = function (deltaTime) {
	this.moveAll(deltaTime);
	this.checkCollisions();
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
 
Game.prototype.checkCollisions = function () {
	var initialVelocities = this.velocities(); 
	var game = this;
	this.balls.forEach(function (ball) {
	});

	this.balls.forEach(function (ball) {
		game.balls.forEach(function (otherBall) {

			if (ball === otherBall) {
				return;
			}

			if (ball.isCollidedWith(otherBall)) {
				debugger
				ball.ballCollision(initialVelocities[otherBall.number]);
			}

		});
	});

};

module.exports = Game;
 

