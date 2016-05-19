/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Game = __webpack_require__(1);
	var GameView = __webpack_require__(6);
	
	document.addEventListener("DOMContentLoaded", function () {
		var canvasEl = document.getElementsByTagName("canvas")[0];
		canvasEl.width = Game.DIM_X + 80;
		canvasEl.height  = Game.DIM_Y + 80;
	
		var ctx = canvasEl.getContext("2d");
		var game = new Game();
		new GameView(game, ctx).start();
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Ball = __webpack_require__(2);
	var Util = __webpack_require__(3);
	var Cue =  __webpack_require__(4);
	var Weapon = __webpack_require__(5);
	
	
	var Game = function (ctx) {
		this.balls = {};
		this.populateTable();
	};
	
	Game.DIM_X = 900;
	Game.DIM_Y = 450;
	Game.TABLE_X = Game.DIM_X + 80;
	Game.TABLE_Y = Game.DIM_Y + 80;
	Game.RAILS = {
		left: 40,
		right: Game.DIM_X + 40,
		top: 40, 
		bottom: Game.DIM_Y + 40
	};
	// Game.OffSet = 40;
	Game.FPS = 32;
	Game.BG_COLOR = "#007800";
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
			this.canvas = document.getElementsByTagName("body")[0];
			this.cue = new Cue({ball: this.findBall(0)});
			// canvas.addEventListener("mousemove", this.cue.draw);
	};
	
	Game.prototype.draw = function (ctx) {
		ctx.clearRect(40, 40, Game.DIM_X + 40, Game.DIM_Y + 40);
		ctx.fillStyle = "#000000";
		ctx.fillRect(38, 38, Game.DIM_X + 4, Game.DIM_Y + 4);
		ctx.fillStyle = Game.BG_COLOR;
		ctx.fillRect(40, 40, Game.DIM_X, Game.DIM_Y);
	
		ctx.fillStyle = "#000000";
		
		ctx.beginPath();
		ctx.arc(
			40, 40, 28, 0, 2 * Math.PI, true
		);
		ctx.fill();
	
		ctx.beginPath();
		ctx.arc(
			40, Game.DIM_Y + 40, 28, 0, 2 * Math.PI, true
		);
		ctx.fill();
	
		ctx.beginPath();
		ctx.arc(
			Game.DIM_X + 40, 40, 28, 0, 2 * Math.PI, true
		);
		ctx.fill();
	
		ctx.beginPath();
		ctx.arc(
			Game.DIM_X + 40, Game.DIM_Y + 40, 28, 0, 2 * Math.PI, true
		);
		ctx.fill();
	
		var self = this;
		Object.keys(self.balls).forEach(function (i) {
			self.balls[i].draw(ctx);
		});
	
		// self.cue.draw();
	};
	
	Game.prototype.step = function (deltaTime) {
		this.moveAll(deltaTime);
		this.checkMakes();
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
		var topLeft = [Game.RAILS.left, Game.RAILS.top];
		var topRight = [Game.RAILS.right, Game.RAILS.top];
		var bottomRight = [Game.RAILS.right, Game.RAILS.bottom];
		var bottomLeft = [Game.RAILS.left, Game.RAILS.bottom];
		// var minX = 4*ball.radius;
		// var maxX = Game.TABLE_X - 4*ball.radius;
		// var minY = 4*ball.radius;
		// var maxY = Game.TABLE_Y - 4*ball.radius;
		console.log(Util.distance(ball.position, bottomRight));
	
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
	


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(3);
	
	var RADIUS = 10;
	var GRAVITY = 3209/(Math.pow(1000,2));
	var COLOR = "#FF0000";
	
	var Ball = function (options) {
		this.position = options.position;
		this.velocity = options.velocity;
		this.radius = RADIUS;
		this.number = options.number;
		this.suit = options.suit;
		this.color = options.color || COLOR;
		this.game = options.game;
	};
	
	// i = 0 is white ball
	
	Ball.prototype.draw = function (ctx) {
		ctx.fillStyle = this.color;
	
		ctx.beginPath();
		ctx.arc(
			this.position[0], this.position[1], RADIUS, 0, 2 * Math.PI, true
		);
		ctx.fill();
	};
	
	Ball.prototype.isCollidedWith = function (otherBall) {
		var distanceBetween = Util.distance(this.position, otherBall.position);
		if (distanceBetween <= (this.radius + otherBall.radius)) { 
			var overLap = 2*this.radius - distanceBetween;
			var speedA = Util.norm(this.velocity);
			var speedB = Util.norm(otherBall.velocity);
			var sumOfSpeeds = speedA + speedB;
			var moveBackDistanceA = overLap*(speedA/sumOfSpeeds);
			var moveBackDistanceB = overLap*(speedB/sumOfSpeeds);
			if (speedA === 0 && speedB === 0) {
				moveBackDistanceA = 0;
				moveBackDistanceB = 0;
			}
			var scaleFactorA = moveBackDistanceA === 0 ? 
				0 : -1*moveBackDistanceA/Util.norm(this.velocity);
			var scaleFactorB = moveBackDistanceB === 0 ? 
				0 : -1*moveBackDistanceB/Util.norm(otherBall.velocity);
			var backUpVectorA = Util.scale(this.velocity, scaleFactorA);
			var backUpVectorB = Util.scale(otherBall.velocity, scaleFactorB);
			this.position = Util.add(this.position, backUpVectorA);
			otherBall.position = Util.add(otherBall.position, backUpVectorB);
			return true;
		}
		return false;
	
	};
	
	// http://billiards.colostate.edu/threads/physics.html
	var NORMAL_FRAME_TIME_DELTA = 1000/60;
	var BALL_TABLE_FRICTION_MIN = 0.1;
	var BALL_TABLE_FRICTION_MAX = 0.5;
	// or var TABLE_FRICTION = rand(0.15, 0.4)
	// add ball-ball FRICTION = rand(0.03, 0.08)
	// add ball-cue FRICTION = 0.6
	// add ball-rail FRICTION = ball-table friction (i.e. sliding along)
	var BALL_RAIL_RESTITUTION = 0.75;
	// var BALL_RAIL_RESTITUTION = rand(0.6 - 0.9)
	var BALL_BALL_RESTITUTION = 0.95;
	// var BALL_BALL_RESTITUTION = rand(0.92 - 0.98)
	var BALL_CUE_RESTITUTION = 0.84;
	// var BALL_CUE_RESTITUTION = rand(0.81 - 0.87);
	// touch: 1.5 mph = 2.2 fps
	// slow: 3 mph = 4.4 fps
	// medium-soft: 5 mph = 7.3 fps
	// medium: 7 mph = 10 fps
	// medium-fast: 8 mph = 12 fps
	// fast: 12 mph = 18 fps 
	// power: 15-20 mph = 22-29 fps
	// powerful break: 25-30 mph = 36-44 fps
	// gravity = 9.8 m/s 
	// gonna need to track direction, so that I can decrease velocity in the correct direction
	Ball.prototype.move = function (deltaTime=20) {
		var velocityScale = deltaTime/NORMAL_FRAME_TIME_DELTA;
		var deltaX = this.velocity[0] * velocityScale;
		var deltaY = this.velocity[1] * velocityScale;
		this.position = [this.position[0] + deltaX, this.position[1] + deltaY];
		this.tableFriction(deltaTime);
		this.railCollision();
	};
	
	Ball.prototype.tableFriction = function (deltaTime=20) {	
		var ballSpeed = Util.norm(this.velocity);
		var frictionOffsetSpeed = 
			1/(BALL_TABLE_FRICTION_MAX - BALL_TABLE_FRICTION_MIN);
		var kineticFactor = 
			(1/(Math.pow(ballSpeed, 2) + frictionOffsetSpeed) 
				+ BALL_TABLE_FRICTION_MIN);
		var frictionConstant = -1*GRAVITY*kineticFactor*deltaTime;
		var frictionVector = Util.scale(this.velocity, frictionConstant);
		var resultantVector = Util.add(frictionVector, this.velocity);
		if (Util.norm(frictionVector) > Util.norm(this.velocity)) {
			resultantVector = [0, 0];
		}
		this.velocity = resultantVector;
	};
	
	Ball.prototype.railCollision = function () {
		var reflection = this.game.isOutOfBounds(this);
		if (reflection) {
		 	var xVelocity = reflection[0]*(this.velocity[0]*BALL_BALL_RESTITUTION); 
		 	var yVelocity = reflection[1]*(this.velocity[1]*BALL_BALL_RESTITUTION);
		 	this.velocity = [xVelocity, yVelocity];
		}
	};
	
	Ball.prototype.ballCollision = function (otherInitialVelocity, otherPosition) {
		var shiftedVelocity = 
			Util.velocityShift(
				this.velocity, otherInitialVelocity, this.position, otherPosition
			);
		// var xVelocity = 
		// 	0.5*(rotatedOtherVelocity[0]*(1 + BALL_BALL_RESTITUTION) + 
		// 			 rotatedThisVelocity[0]*(1 - BALL_BALL_RESTITUTION));
	
		// var yVelocity =
		// 	 0.5*(rotatedOtherVelocity[1]*(1 + BALL_BALL_RESTITUTION) + 
		// 				rotatedThisVelocity[1]*(1 - BALL_BALL_RESTITUTION));
		// var xVelocity = 
		// 	0.5*(rotatedOtherVelocity[0]*(1 + BALL_BALL_RESTITUTION) + 
		// 			 rotatedThisVelocity[0]*(1 - BALL_BALL_RESTITUTION));
	
		// var yVelocity =
		// 	 0.5*(rotatedOtherVelocity[1]*(1 + BALL_BALL_RESTITUTION) + 
		// 				rotatedThisVelocity[1]*(1 - BALL_BALL_RESTITUTION));
		// console.log('Initial of ' + this.number + ' ' + "was" + this.velocity);
		// console.log('Velocity of ' + this.number + ' ' + this.color + ' is ' + [xVelocity, yVelocity]);
		// console.log('______________________________________________________')
		// var rotatedAfterVelocity = [xVelocity, yVelocity]
		// var cartesianVelocity = Util.rotateVelocity(rotatedAfterVelocity, this.position, otherPosition)
		// console.log(this.velocity)
		// this.velocity = [xVelocity, yVelocity];
		this.velocity = Util.subtract(this.velocity, shiftedVelocity);
	};
	
	module.exports = Ball;

/***/ },
/* 3 */
/***/ function(module, exports) {

	var Util = {
		direction: function (vector) {
			var norm = Util.norm(vector);
			return Util.scale(vector, 1/norm);
		},
	
		distance: function (pos1, pos2) {
			var xSquared = Math.pow(pos1[0] - pos2[0], 2);
			var ySquared = Math.pow(pos1[1] - pos2[1], 2);
			return Math.sqrt(xSquared + ySquared);
		},
	
		norm: function (vector) {
			return Util.distance([0, 0], vector);
		},
	
		scale: function (vector, factor) {
			var scaled = [vector[0]*factor, vector[1]*factor];
			return scaled;
		},
	
		unitVector: function (vector) {
			var factor = Util.norm(vector);
			return Util.scale(vector, 1/factor);
		},
	
		add: function (vectorA, vectorB) {
			return [vectorA[0] + vectorB[0], vectorA[1] + vectorB[1]];
		},
	
		subtract: function (vectorA, vectorB) {
			return [vectorA[0] - vectorB[0], vectorA[1] - vectorB[1]];
		},
	
		collisionAngle: function (positionA, positionB) {
				var collisionAngle = Math.atan2((positionA[1] - positionB[1]), (positionB[0] - positionA[0])
												);
				return collisionAngle;
		},
	
		angle: function (position) {
			if (position[0] === 0 && position[1] === 0) {
				return Math.atan(1/1);
			}
			var angle = Math.atan( position[0]/(-1*position[1]));
			return angle;
		},
	
		dotProduct: function (vectorA, vectorB) {
			var result = vectorA[0]*vectorB[0] + vectorA[1]*vectorB[1];
			return result;
	
		},
	
		angleCorrection: function (vector, angle) {
			if (angle < 0) {
				angle += 2*Math.PI;
				if (vector[0] < 0) {
					angle -= Math.PI;
				}
	 		} else {
		 			if (vector[0] < 0) {
		 				angle += Math.PI;
	 				}
	 			}
	 		return angle;
		},
	
		velocityShift: function (velocityA, velocityB, positionA, positionB) {
			var velocityDiff = Util.subtract(velocityA, velocityB);
			var positionDiff = Util.subtract(positionA, positionB);
			var dotProduct = Util.dotProduct(velocityDiff, positionDiff);
			var positionNorm = Util.norm(positionDiff);		
			var velocityScale = (dotProduct)/(Math.pow(positionNorm, 2));
			return Util.scale(positionDiff, velocityScale);
		}
	
	
	
		// rotateVelocity: function (velocityA, positionA, positionB) {
		// 	debugger
		// 	var collisionAngle = Util.collisionAngle(positionA, positionB);
		// 	var angleA = Util.angle(velocityA);
		// 	// var angleB = Util.angle(positionB);
		// 	var speed = this.norm(velocityA);
		// 	var rotatedAXVelocity = speed*Math.cos(angleA + collisionAngle);
		// 	// var rotatedBXVelocity = velocityB[0]*Math.cos(angleB - collisionAngle);
		// 	var rotatedAYVelocity = -1*speed*Math.sin(angleA + collisionAngle);
		// 	// var rotatedBYVelocity = velocityB[1]*Math.cos(angleB - collisionAngle);
		// 	return [rotatedAXVelocity, rotatedAYVelocity];
		// },
	
	
	
	};
	
	module.exports = Util;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(3);
	
	var Cue = function (options) {
		this.cueBall = options.ball;
		this.ctx = options.ctx;
		this.cueDrawnBack = false;
		this.color = "#FF0FFF";
		this.setListeners();
	};
	
	Cue.prototype.setListeners = function () {
		this.canvas = document.getElementsByTagName("body")[0];
		this.beginCueListener = this.beginCue.bind(this, this.cueBall);
		this.canvas.addEventListener("mousedown", this.beginCueListener);
	};
	
	// Cue.prototype.draw = function (event, ctx) {
	// 	debugger
	// 	if (this.cueDrawnBack) {
	// 		this.ctx.fillStyle = this.color;
	// 		ctx.fillRect(0, 0, 290, 300);
	// 		ctx.fillStyle="#FFFFFF";
	// 		ctx.fill();
	// 		// var cueBallX = this.cueBall.position[0];
	// 		// var cueBallY = this.cueBall.position[1];
	// 		// var cueEndX = event.pageX - canvas.offsetLeft;
	// 		// var cueEndY = event.pageY - canvas.offsetTop;
	// 		// this.ctx.beginPath();
	// 		// this.ctx.moveTo(cueBallX, cueBallY);
	// 		// this.ctx.lineTo(cueEndX, cueEndY);
	// 		// this.ctx.stroke();
	// 		// ctx.fill();
	// 	}
	// };
	
	
	Cue.prototype.beginCue = function (cueBall, event) {
		if (Util.norm(cueBall.velocity) < 0.2) {
			this.cueDrawnBack = true;
			this.velocityListener = this.calculateVelocity.bind(this);
			// this.drawListener = this.draw.bind(this);
			// this.canvas.addEventListener("mousemove", this.drawListener);
			this.canvas.addEventListener("mouseup", this.velocityListener);
		}
	};
	
	Cue.prototype.calculateVelocity = function (event) {
		this.canvas.removeEventListener("mouseup", this.velocityListener);
		// this.canvas.removeEventListener("mousemove", this.drawListener);
		var start = this.cueBall.position;
		var end = 
			[event.pageX - canvas.offsetLeft, event.clientY - canvas.offsetTop];
		var velocity = Util.subtract(start, end);
		var unitVelocity = Util.unitVector(velocity);
		var speed = Util.norm(velocity)*0.15;
		console.log(speed);
		if (speed > 15) {
			speed = 15;
		}
	
		var scaledVelocity = Util.scale(unitVelocity, speed);
		this.cueBall.velocity = scaledVelocity;
	};
	
	Cue.MAX_POWER = 100;
	
	Cue.prototype.strikeVelocity = function (power, direction) {
		var cueVelocity = Util.scale(direction, power);
		return cueVelocity;
	};
	
	
	module.exports = Cue;
	
	window.Cue = Cue;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(3);
	
	var Weapon = function (options) {
		this.type = options.type;
		this.game = options.game;
		this.count = 3
	};
	
	Weapon.prototype.place = function () {
		var canvas = document.getElementById("canvas");
		this.weaponListener = this.capturePositon.bind(this);
		var self = this;
		canvas.addEventListener("click", self.weaponListener);
	};
	
	Weapon.prototype.capturePositon = function (event) {
		// var canvas = document.getElementById("canvas");
		var self = this;
		var xPosition = event.pageX - canvas.offsetLeft;
		var yPosition = event.clientY - canvas.offsetTop;
		var cueBall = this.game.findBall(0);
		if (Util.distance(cueBall.position, [xPosition, yPosition]) < 10) {
			this.action([xPosition, yPosition], cueBall);
		}
		// canvas.removeEventListener("click", self.weaponListener);
	};
	
	// Weapon.prototype.action = function (position) {
	// 	var inRange = this.getBalls(position);
	// 	inRange.forEach(function (ball) {
	// 		var randomX = 100*(2*Math.random() - 1);
	// 		var randomY = 100*(2*Math.random() - 1);
	// 		var randomVector = [randomX, randomY];
	// 		var unitVelocity = Util.unitVector(randomVector);
	// 		ball.velocity = Util.scale(unitVelocity, 10*Math.random());
	// 		ball.velocity = Util.scale(unitVelocity, 20*Math.random());
	// 	});
	// };
	Weapon.prototype.action = function (position, cueBall) {
		if (this.count > 0) {
			var balls = this.getBalls();
			balls.forEach(function (ball) {
				if (ball !== cueBall) {
					var vectorDiff = Util.subtract(ball.position, cueBall.position);
					var distanceFrom = Util.norm(vectorDiff);
					var scaledVelocity = Util.scale(vectorDiff, Math.pow(1/(distanceFrom), 2));
					ball.velocity = Util.scale(scaledVelocity, 1800*Math.random());
				} else {
					var randomX = 100*(2*Math.random() - 1);
					var randomY = 100*(2*Math.random() - 1);
	
					var randomVector = [randomX, randomY];
					var unitVelocity = Util.unitVector(randomVector);
					ball.velocity = Util.scale(unitVelocity, 15*Math.random());
				}
			});
			this.count -= 1;
		}
	};
	
	Weapon.prototype.getBalls = function () {
		var ballsInRange = [];
		var allBalls = this.game.balls;
		Object.keys(allBalls).forEach(function (idx) {
				ballsInRange.push(allBalls[idx]);
		});
		return ballsInRange;
	};
	
	Weapon.prototype.removeListener = function () {
		var canvas = document.getElementById("canvas");
		var self = this;
		canvas.removeEventListener("click", self.weaponListener);
		console.log('removed listener');
	};
	
	module.exports = Weapon;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var Game = __webpack_require__(1);
	
	var GameView = function (game, ctx) {
		this.ctx = ctx;
		this.game = game;
	};
	
	GameView.prototype.start = function () {
		var canvas = document.getElementById('canvas');
		this.lastTime = 0;
		this.requestId = requestAnimationFrame(this.animate.bind(this));
	};
	
	GameView.prototype.animate = function (time, event) {
		var deltaTime = time - this.lastTime;
		if (this.game.over) {
			cancelAnimationFrame(this.requestId);
			this.game = new Game ();
			this.start();
		}
		this.game.step(deltaTime);
		this.game.draw(this.ctx, event);
		// this.ctx.clearRect(0, 0, this.game.DIM_X, this.game.DIM_Y);
		this.lastTime = time;
		requestAnimationFrame(this.animate.bind(this));
	};	
	
	// GameView.prototype.start = function () {
	// 	var self = this;
	// 	setInterval(function () {
	// 		self.game.draw(self.ctx);
	// 		self.game.step(5, self.ctx);
	// 	}, 5);
	// };
	
	module.exports = GameView;

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map