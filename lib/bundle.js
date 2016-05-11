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
	var GameView = __webpack_require__(4);
	
		console.log('content loaded');
	
	document.addEventListener("DOMContentLoaded", function () {
		console.log('content loaded');
		var canvasEl = document.getElementsByTagName("canvas")[0];
		canvasEl.width = Game.DIM_X;
		canvasEl.height  = Game.DIM_Y;
	
		var ctx = canvasEl.getContext("2d");
		var game = new Game();
		new GameView(game, ctx).start();
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Ball = __webpack_require__(2);
	
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
	
	module.exports = Game;
	 
	


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
	
	Ball.prototype.collideWith = function (otherBall) {
	
	};
	
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
		// console.log(distanceBetween);
		if (distanceBetween < (this.radius + otherBall.radius)) { 
			// var scaleA = Util.norm(this.velocity)/(distanceBetween/2);
			// var scaleB = Util.norm(otherBall.velocity)/(distanceBetween/2);
			// var scaledVelocityA = Util.scale(this.velocity, scaleA);
			// var scaledVelocityB = Util.scale(this.velocity, scaleB);
			// debugger
			// this.position = Util.subtract(this.position, scaledVelocityA);
			// otherBall.position = Util.subtract(otherBall.position, scaledVelocityB);
			return true
		}
		return false
	
	};
	
	// http://billiards.colostate.edu/threads/physics.html
	var NORMAL_FRAME_TIME_DELTA = 1000/60;
	var BALL_TABLE_FRICTION = 0.2;
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
	
	Ball.prototype.move = function (deltaTime) {
		var velocityScale = deltaTime/NORMAL_FRAME_TIME_DELTA;
		var deltaX = this.velocity[0] * velocityScale;
		var deltaY = this.velocity[1] * velocityScale;
		this.position = [this.position[0] + deltaX, this.position[1] + deltaY];
			//Shoul I move then update speed or update speed then move
			//No this is wrong I think
		// this.inPocket
		this.tableFriction(deltaTime);
		// this.railCollision();
	};
	
	Ball.prototype.tableFriction = function (deltaTime) {	
		var xVelocity = this.directionFriction(this.velocity[0], deltaTime);
		var yVelocity = this.directionFriction(this.velocity[1], deltaTime);
		var frictionCorrectionX = xVelocity/this.velocity[0] < 0 ? 0 : xVelocity;
		var frictionCorrectionY = yVelocity/this.velocity[1] < 0 ? 0 : yVelocity;
		this.velocity = [frictionCorrectionX, frictionCorrectionY];
	};
	
	Ball.prototype.directionFriction = function (velocityComponent, deltaTime) {
		if (velocityComponent < 0) {
			return velocityComponent + GRAVITY*BALL_TABLE_FRICTION*deltaTime;
		} else if (velocityComponent > 0) {
				return velocityComponent - GRAVITY*BALL_TABLE_FRICTION*deltaTime;
			} else {
					return velocityComponent;
				}
	};
	
	Ball.prototype.railCollision = function () {
		if (this.game.isOutOfBounds(this.position)) {
		 	var xVelocity = -(this.velocity[0]*BALL_BALL_RESTITUTION) //TIMES REBOUND this may result in only one velocity component being reversed in direction, depending on which wall it hits;
		 	// get angle from object direction, rebound angle = 180 - theta
		 	var yVelocity = (this.velocity[1]*BALL_BALL_RESTITUTION) //TIMES ANGLE OF COLLISION;
		}
	};
	
	Ball.prototype.ballCollision = function (otherInitialVelocity, otherPosition) {
		var rotatedThisVelocity = 
			Util.rotateVelocity(this.velocity, this.position, otherPosition);
		var rotatedOtherVelocity = 
			Util.rotateVelocity(otherInitialVelocity, otherPosition, this.position);
		
		var xVelocity = 
			0.5*(rotatedOtherVelocity[0]*(1 + BALL_BALL_RESTITUTION) + 
					 rotatedThisVelocity[0]*(1 - BALL_BALL_RESTITUTION));
	
		var yVelocity =
			 0.5*(rotatedOtherVelocity[1]*(1 + BALL_BALL_RESTITUTION) + 
						rotatedThisVelocity[1]*(1 - BALL_BALL_RESTITUTION));
		// console.log('Initial of ' + this.number + ' ' + "was" + this.velocity);
		// console.log('Velocity of ' + this.number + ' ' + this.color + ' is ' + [xVelocity, yVelocity]);
		// console.log('______________________________________________________')
		var rotatedAfterVelocity = [xVelocity, yVelocity]
		var cartesianVelocity = Util.rotateVelocity(rotatedAfterVelocity, this.position, otherPosition)
		// console.log(this.velocity)
		// this.velocity = [xVelocity, yVelocity];
		debugger
		this.velocity = cartesianVelocity;
		console.log(this.velocity)
		console.log("_______________")
	};
	
	
	Ball.prototype.remove = function () {
		this.game.remove(this);
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
	
		subtract: function (vectorA, vectorB) {
			return [vectorA[0] - vectorB[0], vectorA[1] - vectorB[1]];
		},
	
		collisionAngle: function (positionA, positionB) {
				var collisionAngle = Math.atan2((positionA[1] - positionB[1]), (positionB[0] - positionA[0])
												);
				return collisionAngle;
		},
	
		angle: function (position) {
			var angle = Math.atan( position[0]/(-1*position[1]));
			return angle;
		},
	
	
		dotProduct: function (velocityA, velocityB, positionA, positionB) {
			var velocityDiff = Util.subtract(velocityB, velocityA);
			var positionDiff = Util.subtract(positionA, positionB);
			var dotProduct = velocityA
	
	
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
/***/ function(module, exports) {

	var GameView = function (game, ctx) {
		console.log('building game view');
		this.ctx = ctx;
		this.game = game;
	};
	
	
	GameView.prototype.start = function () {
		this.lastTime = 0;
		requestAnimationFrame(this.animate.bind(this));
	};
	
	GameView.prototype.animate = function (time) {
		var deltaTime = time - this.lastTime;
	
		this.game.step(deltaTime);
		this.game.draw(this.ctx);
		this.lastTime = time;
	
		requestAnimationFrame(this.animate.bind(this));
	};	
	
	module.exports = GameView;

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map