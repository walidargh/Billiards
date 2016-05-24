var Ball = require('./ball');
var Util = require('./util');
var Cue =  require('./cue');
var Weapon = require('./weapon');


var Game = function (ctx) {
	this.balls = {};
	this.ctx = ctx;
	this.populateTable();
};

Game.DIM_X = 900;
Game.DIM_Y = 450;
Game.offSet = 400;
Game.TABLE_X = Game.DIM_X + Game.offSet;
Game.TABLE_Y = Game.DIM_Y + Game.offSet;
Game.RAILS = {
	left: Game.offSet/2,
	right: Game.DIM_X + Game.offSet/2,
	top: Game.offSet/2, 
	bottom: Game.DIM_Y + Game.offSet/2
};
Game.FPS = 32;
Game.BG_COLOR = "#007800";
// Game.colors = {
// 	1: 
// }
Game.positions =
{
	1: [Game.TABLE_X/3 + 4*13, Game.TABLE_Y/2],

	2: [Game.TABLE_X/3 + 2*13, Game.TABLE_Y/2 - 1*13],
	3: [Game.TABLE_X/3 + 2*13, Game.TABLE_Y/2 + 1*13],

	4: [Game.TABLE_X/3 + 0*13, Game.TABLE_Y/2 - 2*13],
	5: [Game.TABLE_X/3 + 0*13, Game.TABLE_Y/2 - 0*13],
	6: [Game.TABLE_X/3 + 0*13, Game.TABLE_Y/2 + 2*13],

	7: [Game.TABLE_X/3 - 2*13, Game.TABLE_Y/2 - 3*13],
	8: [Game.TABLE_X/3 - 2*13, Game.TABLE_Y/2 - 1*13],
	9: [Game.TABLE_X/3 - 2*13, Game.TABLE_Y/2 + 1*13],
	10: [Game.TABLE_X/3 - 2*13, Game.TABLE_Y/2 + 3*13],

	11: [Game.TABLE_X/3 - 4*13, Game.TABLE_Y/2 - 4*13],
	12: [Game.TABLE_X/3 - 4*13, Game.TABLE_Y/2 - 2*13],
	13: [Game.TABLE_X/3 - 4*13, Game.TABLE_Y/2 + 0*13],
	14: [Game.TABLE_X/3 - 4*13, Game.TABLE_Y/2 + 2*13],
	15: [Game.TABLE_X/3 - 4*13, Game.TABLE_Y/2 + 4*13]
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
				position = [3*Game.TABLE_X/4, Game.TABLE_Y/2];
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
		// game.balls[0] = new Ball({position: [100, 300], velocity: [0, 0], number: 0, suit: "club", game: game, color: "#000000"})
		// game.balls[1] = new Ball({position: [1000, 300], velocity: [-32, 0], number: 1, suit: "club", game: game, color: "#FFFFFF"})
		this.canvas = document.getElementsByTagName("body")[0];
		this.cue = new Cue({ball: this.findBall(0)});
};

Game.prototype.draw = function (ctx, event) {
	ctx.clearRect(0, 0, Game.TABLE_X, Game.TABLE_Y);

	ctx.fillStyle = '#644321';
	ctx.fillRect(
		Game.offSet/2 - 50, Game.offSet/2, Game.DIM_X + 100, Game.DIM_Y
	);

	ctx.fillRect(
		Game.offSet/2, Game.offSet/2 - 50, Game.DIM_X, Game.DIM_Y + 100
	);

	ctx.beginPath();
	ctx.arc(
		Game.offSet/2, Game.offSet/2, 50, 0, 2 * Math.PI, true
	);
	ctx.fill();
	ctx.closePath();

	ctx.beginPath();
	ctx.arc(
		Game.offSet/2 + Game.DIM_X, Game.offSet/2, 50, 0, 2 * Math.PI, true
	);
	ctx.fill();
	ctx.closePath();

	ctx.beginPath();
	ctx.arc(
		Game.offSet/2, Game.offSet/2 + Game.DIM_Y, 50, 0, 2 * Math.PI, true
	);
	ctx.fill();
	ctx.closePath();

	ctx.beginPath();
	ctx.arc(
		Game.offSet/2 + Game.DIM_X, 
		Game.offSet/2 + Game.DIM_Y, 50, 0, 2 * Math.PI, true
	);
	ctx.fill();
	ctx.closePath();

	ctx.fillStyle = "#000000";
	ctx.fillRect(
		(Game.offSet - 3.5)/2, 
		(Game.offSet - 3.5)/2, Game.DIM_X + 4, Game.DIM_Y + 4
	);

	ctx.fillStyle = Game.BG_COLOR;
	ctx.fillRect(Game.offSet/2, Game.offSet/2, Game.DIM_X, Game.DIM_Y);

	ctx.fillStyle = "#000000";
	
	ctx.beginPath();
	ctx.arc(
		Game.offSet/2, Game.offSet/2, 28, 0, 2 * Math.PI, true
	);
	ctx.fill();
	ctx.closePath();

	ctx.beginPath();
	ctx.arc(
		Game.offSet/2, Game.DIM_Y + Game.offSet/2, 28, 0, 2 * Math.PI, true
	);
	ctx.fill();
	ctx.closePath();


	ctx.beginPath();
	ctx.arc(
		Game.DIM_X + Game.offSet/2, Game.offSet/2, 28, 0, 2 * Math.PI, true
	);
	ctx.fill();
	ctx.closePath();

	ctx.beginPath();
	ctx.arc(
		Game.DIM_X + Game.offSet/2, 
		Game.DIM_Y + Game.offSet/2, 28, 0, 2 * Math.PI, true
	);
	ctx.fill();
	ctx.closePath();

	var numberBombs = this.weapons[0].count;
	for (var i = numberBombs; i > 0; i--) {
		ctx.font = "30px FontAwesome";
		ctx.fillText("\uf1e2", 500 + 70*i, 185);
	}

	var self = this;
	Object.keys(self.balls).forEach(function (i) {
		self.balls[i].draw(ctx);
	});
	self.cue.draw(this.ctx, event);
};

Game.prototype.step = function (deltaTime) {
	this.moveAll(deltaTime);
	this.checkCollisions();
	this.checkMakes();
};

Game.prototype.moveAll = function (deltaTime) {
	var self = this;
	this.cue.move(deltaTime);
	Object.keys(this.balls).forEach(function (i) {
		self.balls[i].move(deltaTime);
	});
};

Game.prototype.isOutOfBounds = function(ball) {
	// RIGHT
	if (ball.position[0] > Game.RAILS.right - ball.radius) {
		this.backInFrame(
			ball, [ball.position[0] - (Game.RAILS.right - ball.radius), 0]
		);
		return [-1, 1];
	}
	//LEFT
	else if (ball.position[0] <= Game.RAILS.left + ball.radius) {
		this.backInFrame(
			ball, [Game.RAILS.left + ball.radius - ball.position[0], 0]
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
					otherBall.position
				);
			}

		});
	});

};

Game.prototype.allStopped = function () {
	// var balls = this.balls;
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
	}

	if (gameLost) {
		alert('Game Over You Lose!');
		self.over = true;
		self.weaponRemoveListener();
	}
};

Game.prototype.inHole = function (ball) {
	var x = ball.position[0];
	var y = ball.position[1];
	var topLeft = [Game.RAILS.left, Game.RAILS.top];
	var topRight = [Game.RAILS.right, Game.RAILS.top];
	var bottomRight = [Game.RAILS.right, Game.RAILS.bottom];
	var bottomLeft = [Game.RAILS.left, Game.RAILS.bottom];
	// var minX = 4*ball.radius;
	// var maxX = Game.TABLE_X - 4*ball.radius;
	// var minY = 4*ball.radius;
	// var maxY = Game.TABLE_Y - 4*ball.radius;
	var inHole = false;
	//TOPLEFT [0, 0] range = ball.radius * 2
	if (Util.distance(ball.position, topLeft) < 3*ball.radius) {
		inHole = true;
		// Game.removeBall(ball)
	//TOPRIGHT [0 + 2.5*ball.radius, Game.DIM_X - 2.5*ball.radius] 
	} else if (Util.distance(ball.position, topRight) < 3*ball.radius) {
		inHole = true;
		// Game.removeBall(ball)
	//BOTTOMLEFT [0, DIM_Y]
	} else if (Util.distance(ball.position, bottomLeft) < 3*ball.radius) {
		inHole = true;
		//BOTTOM RIGHT
	} else if (Util.distance(ball.position, bottomRight) < 3*ball.radius) {
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

