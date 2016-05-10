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
	
	Game.DIM_X = 500;
	Game.DIM_Y = 1000;
	Game.FPS = 32;
	Game.BG_COLOR = "#000000";
	
	Game.prototype.populateTable = function (object) {
		var game = this;
		for (var i = 0; i < 10; i++) {
			var suit;
			if (i === 0) {
				suit = "cue";
			} else if (i < 9 ) {
					suit = "solid";
				} else {
						suit = "striped";
					}
			this.balls.push(new Ball(
				{
					position: [0, i],
					velocity: [i, 0],
					number: i,
					suit: suit,
					game: game
				}
	
			));
		}
	};
	
	Game.prototype.step = function () {
		this.balls.forEach(function (ball) {
			ball.move();
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
	
	module.exports = Game;
	 
	


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(3);
	
	var RADIUS = 25;
	var GRAVITY = 3209;
	var COLOR = "#ffffff";
	
	var Ball = function (options) {
		this.position = options.position;
		this.velocity = options.velocity;
		this.radius = options.radius;
		this.number = options.number;
		this.suit = options.suit;
		this.game = options.game;
	};
	
	// i = 0 is white ball
	
	Ball.prototype.collideWith = function (otherBall) {
	
	};
	
	Ball.prototype.draw = function (ctx) {
		ctx.fillStyle = COLOR;
	
		ctx.beginPath();
		ctx.arc(
			this.pos[0], this.pos[1], RADIUS, 0, 2 * Math.PI, true
		);
		ctx.fill();
	};
	
	Ball.prototype.isCollidedWith = function (otherBall) {
		var distanceBetween = Util.distance(this.position, otherBall.position);
		return distanceBetween < (this.radius + otherBall.radius);
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
	
	
	Ball.prototype.move = function (timeDelta) {
		var velocityScale = timeDelta/NORMAL_FRAME_TIME_DELTA;
		var deltaX = this.velocity[0] * velocityScale;
		var deltaY = this.velocity[1] * velocityScale;
			//Shoul I move then update speed or update speed then move
			//No this is wrong I think
		// this.inPocket
		this.tableFriction();
		this.ballCollision();
		this.railCollision();
	};
	
	Ball.prototype.tableFriction = function () {
		var xVelocity = this.directionFriction(this.velocity[0]);
		var yVelocity = this.directionFriction(this.velocity[1]);
		this.velocity = [xVelocity, yVelocity];
	};
	
	Ball.prototype.directionFriction = function (velocityComponent) {
		if (velocityComponent < 0) {
			return velocityComponent + GRAVITY*BALL_TABLE_FRICTION;
		} else if (velocityComponent > 0) {
				return velocityComponent - GRAVITY*BALL_TABLE_FRICTION;
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
	
	Ball.prototype.ballCollision = function (otherBall) {
		var xVelocity = otherBall.velocity[0]*(1 - BALL_BALL_RESTITUTION) + 
										this.velocity[0]*(1 + BALL_BALL_RESTITUTION);
		var yVelocity = otherBall.velocity[1]*(1 - BALL_BALL_RESTITUTION) + 
									  this.velocity[1]*(1 + BALL_BALL_RESTITUTION);
		this.velocity = [xVelocity, yVelocity];
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
		}
	};
	
	module.exports = Util;

/***/ },
/* 4 */
/***/ function(module, exports) {

	var GameView = function (game, ctx) {
		console.log('building game view')
		this.ctx = ctx;
		this.game = game;
	};
	
	
	GameView.prototype.start = function () {
		this.lastTime = 0;
		requestAnimationFrame(this.animate.bind(this));
	};
	
	GameView.prototype.animate = function (time) {
		var deltaTime = time = this.lastTime;
	
		this.game.step(deltaTime);
		this.game.draw(this.ctx);
		this.lastTime = time;
	
		requestAnimationFrame(this.animate.bind(this));
	};	
	
	module.exports = GameView;

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map