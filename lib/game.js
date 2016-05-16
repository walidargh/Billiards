var Ball = require('./ball');
var Util = require('./util');
var Cue =  require('./cue');
var Weapon = require('./weapon');

var Game = function () {
	this.balls = {};

	this.populateTable();
	this.cue = new Cue ();
	this.over = false;
	this.weapons = [];
	this.getWeapons();
	this.weaponAction();
};

Game.DIM_X = 300;
Game.DIM_Y = 600;
Game.FPS = 32;
Game.BG_COLOR = "#006400";

Game.prototype.findBall = function (value) {
	return this.balls[value];
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
	game.balls = {};
		for (var i = 0; i < 10; i++) {
			var suit;
			var color = null;
			if (i === 0) {
				suit = "cue";
				color = "#FFFFFF";
			} else {
						suit = "striped";
					}
			game.balls[i] = (new Ball(
				{
					position: [Game.DIM_X*Math.random() - 40, 
										Game.DIM_Y*Math.random() - 40],
					// velocity: [1*(2*Math.random() - 1), 1*(2*Math.random() - 1)],
					velocity: [0, 0],
					number: i,
					suit: suit,
					game: game,
					color: color
				}

			));
		}
};

Game.prototype.isOutOfBounds = function(ball) {
	if (ball.position[0] > Game.DIM_X - ball.radius) {
		this.backInFrame(
			ball, [ball.position[0] - Game.DIM_X + ball.radius, 0]
		);
		return [-1, 1];
	}
	else if (ball.position[0] < ball.radius) {
		this.backInFrame(
			ball, [ball.radius - ball.position[0], 0]
		);
		return [-1, 1];
	}	
	else if (ball.position[1] > Game.DIM_Y - ball.radius) {
		this.backInFrame(
			ball, [0, ball.position[1] - Game.DIM_Y + ball.radius]
		);
		return [1, -1];
	}
	else if (ball.position[1] < ball.radius) {
		this.backInFrame(
			ball, [0, ball.radius - ball.position[1]]
		);
		return [1, -1];
	}
	else {
		return false;
	}
};

Game.prototype.step = function (deltaTime) {
	this.checkMakes();
	this.moveAll(deltaTime);
	this.checkCollisions();
	if (this.cueBallStopped()) {
		var cueBall = this.findBall(0);
		this.cue.place(cueBall);
	}
};

Game.prototype.moveAll = function (deltaTime) {
	var self = this;
	Object.keys(this.balls).forEach(function (i) {
		self.balls[i].move(deltaTime);
	});
};


Game.prototype.draw = function (ctx) {
	ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
	ctx.fillStyle = Game.BG_COLOR;
	ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);

	ctx.fillStyle = "#000000";
	
	ctx.beginPath();
	ctx.arc(
		14, 14, 14, 0, 2 * Math.PI, true
	);
	ctx.fill();

	ctx.beginPath();
	ctx.arc(
		14, Game.DIM_Y - 14, 14, 0, 2 * Math.PI, true
	);
	ctx.fill();

	ctx.beginPath();
	ctx.arc(
		Game.DIM_X - 14, 14, 14, 0, 2 * Math.PI, true
	);
	ctx.fill();

	ctx.beginPath();
	ctx.arc(
		Game.DIM_X - 14, Game.DIM_Y - 14, 14, 0, 2 * Math.PI, true
	);
	ctx.fill();


	var self = this;
	Object.keys(self.balls).forEach(function (i) {
		self.balls[i].draw(ctx);
	});

};

Game.prototype.velocities = function () {
	var velocities = {};
	var self = this;
	Object.keys(self.balls).forEach(function (i) {
		velocities[i] = self.balls[i].velocity;
		// var ball = self.balls[i];
		// velocities.push(ball.velocity);
	});
	return velocities;
};

Game.prototype.positions = function () {
	var positions = {};
	var self = this;
	Object.keys(self.balls).forEach(function (i) {
		// var ball = self.balls[i];
		positions[i] = self.balls[i].position;
	});
	return positions;
};
 
Game.prototype.checkCollisions = function () {
	var initialVelocities = this.velocities();
	var initialPositions = this.positions();
	var self = this;

	Object.keys(self.balls).forEach(function (i) {
		var ball = self.balls[i];
		Object.keys(self.balls).forEach(function (j) {
			var otherBall = self.balls[j];
			if (ball === otherBall) {
				return;
			}

			if (ball.isCollidedWith(otherBall)) {
				ball.ballCollision(
					initialVelocities[otherBall.number], 
					initialPositions[otherBall.number]
				);
			}

		});
	});

};

Game.prototype.allStopped = function () {
	// var balls = this.balls;
	console.log(Object.keys(this.balls));
	var self = this;
	var length = Object.keys(self.balls).length;
	for (var i = length- 1; i >= 0; i--) {
		var ballSpeed = Util.norm(self.balls[i].velocity);
		if (ballSpeed !== 0) {
			return false;
		}
	}
	return true;
};

Game.prototype.cueBallStopped = function () {
	var cueBall = this.findBall(0);
	var cueBallSpeed = Util.norm(cueBall.velocity);
	if (cueBallSpeed) {
		return false;
	} else {
		return true;
	}
};
Game.prototype.checkMakes = function () {	
	var self = this;
	var toRemove = [];
	var gameLost = false;

	Object.keys(this.balls).forEach(function (i) {
		if (self.inHole(self.balls[i])) {
			toRemove.push(self.balls[i]);
		}
	});

	for (var i = 0; i < toRemove.length; i++) {
		 if (toRemove[i].number === 0) {
		 		gameLost = true;
		 }
		 self.removeBall(toRemove[i]);
	}

	if (Object.keys(this.balls).length === 1 && !gameLost) {
		alert('Game Over You Win!');
		self.over = true;
		self.populateTable();
	}

	if (gameLost) {
		alert('Game Over You Lose!');
		self.over = true;
		self.populateTable();
	}
};

Game.prototype.inHole = function (ball) {
	var x = ball.position[0];
	var y = ball.position[1];

	var minX = 4*ball.radius;
	var maxX = Game.DIM_X - 4*ball.radius;
	var minY = 4*ball.radius;
	var maxY = Game.DIM_Y - 4*ball.radius;

	var inHole = false;
	//TOPLEFT [0, 0] range = ball.radius * 2
	if ( x < minX && y < minY) {
		inHole = true;
		// Game.removeBall(ball)
	//TOPRIGHT [0 + 2.5*ball.radius, Game.DIM_X - 2.5*ball.radius] 
	} else if ( x > maxX && y < minY ) {
		inHole = true;
		// Game.removeBall(ball)
	//BOTTOMLEFT [0, DIM_Y]
	} else if ( x < minX && y > maxY) {
		inHole = true;
		//BOTTOM RIGHT
	} else if ( x > maxX && y > maxY) {
		inHole = true;
	} 
	return inHole;
};

Game.prototype.removeBall = function (ballToRemove) {
	var newBalls = {};
	var self = this;
	Object.keys(self.balls).forEach(function (ballNumber) {
		var ball = self.balls[ballNumber];
		if (ball !== ballToRemove) {
			newBalls[ballNumber] = ball;
		}
	});
	this.balls = newBalls;
};

Game.prototype.weaponAction = function () {
	var selectedWeapon = 
		this.weapons[Math.floor(Math.random() * this.weapons.length)];
	selectedWeapon.place();
};

Game.prototype.backInFrame = function (ball, distance) {
	var scaledVelocity;
	if (distance[0]) {
		scaledVelocity = 
			Util.scale(ball.velocity, distance[0]/Math.abs(ball.velocity[0]));
	} else {
		scaledVelocity = 
			Util.scale(ball.velocity, distance[1]/Math.abs(ball.velocity[1]));
	}
	ball.position = Util.subtract(ball.position, scaledVelocity);
};

module.exports = Game;

window.game = Game;
window.balls = Game.balls;

