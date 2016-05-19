var Ball = require('./ball');
var Util = require('./util');
var Cue =  require('./cue');
var Weapon = require('./weapon');


var Game = function (ctx) {
	this.balls = {};
	this.populateTable();
};

Game.DIM_X = 1000;
Game.DIM_Y = 500;
Game.RAILS = {
	left: 40,
	right: Game.DIM_X + 40,
	top: 40, 
	bottom: Game.DIM_Y + 40
};
// Game.OffSet = 40;
Game.FPS = 32;
Game.BG_COLOR = "#006400";
Game.positions =
{
	1: [Game.DIM_X/3 + 4*13 + 40, Game.DIM_Y/2 + 40],

	2: [Game.DIM_X/3 + 2*13 + 40, Game.DIM_Y/2 - 1*13 + 40],
	3: [Game.DIM_X/3 + 2*13 + 40, Game.DIM_Y/2 + 1*13 + 40],

	4: [Game.DIM_X/3 + 0*13 + 40, Game.DIM_Y/2 - 2*13 + 40],
	5: [Game.DIM_X/3 + 0*13 + 40, Game.DIM_Y/2 - 0*13 + 40],
	6: [Game.DIM_X/3 + 0*13 + 40, Game.DIM_Y/2 + 2*13 + 40],

	7: [Game.DIM_X/3 - 2*13 + 40, Game.DIM_Y/2 - 3*13 + 40],
	8: [Game.DIM_X/3 - 2*13 + 40, Game.DIM_Y/2 - 1*13 + 40],
	9: [Game.DIM_X/3 - 2*13 + 40, Game.DIM_Y/2 + 1*13 + 40],
	10: [Game.DIM_X/3 - 2*13 + 40, Game.DIM_Y/2 + 3*13 + 40],

	11: [Game.DIM_X/3 - 4*13 + 40, Game.DIM_Y/2 - 4*13 + 40],
	12: [Game.DIM_X/3 - 4*13 + 40, Game.DIM_Y/2 - 2*13 + 40],
	13: [Game.DIM_X/3 - 4*13 + 40, Game.DIM_Y/2 + 0*13 + 40],
	14: [Game.DIM_X/3 - 4*13 + 40, Game.DIM_Y/2 + 2*13 + 40],
	15: [Game.DIM_X/3 - 4*13 + 40, Game.DIM_Y/2 + 4*13 + 40]
};

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
	this.over = false;
	this.weapons = [];
	this.getWeapons();
	this.weaponAction();
	var game = this;
	game.balls = {};
		for (var i = 0; i < 16; i++) {
			var suit;
			var color = null;
			var position;
			var velocity = [0, 0];
			if (i === 0) {
				suit = "cue";
				color = "#FFFFFF";
				position = [3*Game.DIM_X/4, Game.DIM_Y/2];
			} else {
						suit = "striped";
						position = Game.positions[i];
					}
			game.balls[i] = (new Ball(
				{
					position: position,
					velocity: velocity,
					number: i,
					suit: suit,
					game: game,
					color: color
				}

			));
		}
		this.canvas = document.getElementsByTagName("body")[0];
		this.cue = new Cue({ball: this.findBall(0)});
		// canvas.addEventListener("mousemove", this.cue.draw);
};

Game.prototype.draw = function (ctx) {
	ctx.clearRect(40, 40, Game.DIM_X, Game.DIM_Y);
	ctx.fillStyle = Game.BG_COLOR;
	ctx.fillRect(40, 40, Game.DIM_X, Game.DIM_Y);

	ctx.fillStyle = "#000000";
	
	ctx.beginPath();
	ctx.arc(
		40, 40, 20, 0, 2 * Math.PI, true
	);
	ctx.fill();

	ctx.beginPath();
	ctx.arc(
		40, Game.DIM_Y - 40, 20, 0, 2 * Math.PI, true
	);
	ctx.fill();

	ctx.beginPath();
	ctx.arc(
		Game.DIM_X - 20, 20, 20, 0, 2 * Math.PI, true
	);
	ctx.fill();

	ctx.beginPath();
	ctx.arc(
		Game.DIM_X - 20, Game.DIM_Y - 20, 20, 0, 2 * Math.PI, true
	);
	ctx.fill();

	var self = this;
	Object.keys(self.balls).forEach(function (i) {
		self.balls[i].draw(ctx);
	});

	// self.cue.draw();
};

Game.prototype.step = function (deltaTime) {
	this.checkMakes();
	this.moveAll(deltaTime);
	this.checkCollisions();
};

Game.prototype.moveAll = function (deltaTime) {
	var self = this;
	Object.keys(this.balls).forEach(function (i) {
		self.balls[i].move(deltaTime);
	});
};

Game.prototype.isOutOfBounds = function(ball) {
	// RIGHT
	if (ball.position[0] > Game.RAILS.right - ball.radius) {
		this.backInFrame(
			ball, [ball.position[0] - (Game.right + ball.radius), 0]
		);
		return [-1, 1];
	}
	//LEFT
	else if (ball.position[0] < Game.RAILS.left + ball.radius) {
		debugger
		this.backInFrame(
			ball, [ball.radius - (Game.left - ball.position[0]), 0]
		);
		return [-1, 1];
	}	
	//BOTTOM
	else if (ball.position[1] > Game.RAILS.bottom - ball.radius) {
		this.backInFrame(
			ball, [0, ball.position[1] - Game.RAILS.bottom + ball.radius]
		);
		return [1, -1];
	}
	//TOP
	else if (ball.position[1] < Game.RAILS.top + ball.radius) {
		debugger
		this.backInFrame(
			ball, [0, (ball.radius + Game.RAILS.top) - ball.position[1]]
		);
		return [1, -1];
	}
	else {
		return false;
	}
};

Game.prototype.velocities = function () {
	var velocities = {};
	var self = this;
	Object.keys(self.balls).forEach(function (i) {
		velocities[i] = self.balls[i].velocity;
	});
	return velocities;
};

Game.prototype.positions = function () {
	var positions = {};
	var self = this;
	Object.keys(self.balls).forEach(function (i) {
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
		self.weaponRemoveListener();
		// self.populateTable();
	}

	if (gameLost) {
		alert('Game Over You Lose!');
		self.over = true;
		self.weaponRemoveListener();
		// self.populateTable();
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
	console.log('going to remove' + ballToRemove);
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

Game.prototype.weaponRemoveListener = function () {
	this.weapons[0].removeListener();
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

