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
	var Util = __webpack_require__(3);
	var Cue =  __webpack_require__(5);
	var Weapon = __webpack_require__(6);
	
	var Game = function () {
		this.balls = {};
	
		this.populateTable();
		this.cue = new Cue ();
		// this.cue.listen();
		this.weapons = [];
		this.getWeapons();
		this.weaponAction();
		// setInterval(this.addBalls, )
	};
	
	Game.DIM_X = 300;
	Game.DIM_Y = 600;
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
			for (var i = 0; i < 8; i++) {
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
				this.balls[i] = (new Ball(
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
			this.backInFrame(ball, [ball.position[0] - Game.DIM_X + ball.radius, 0]);
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
		this.checkMakes();
		// if (this.allStopped()) {
		// 	this.cue.place();
		// }
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
		// self.balls.forEach(function (ball) {
		// });
	
		Object.keys(self.balls).forEach(function (i) {
			var ball = self.balls[i];
			Object.keys(self.balls).forEach(function (j) {
				var otherBall = self.balls[j];
				if (ball === otherBall) {
					return;
				}
	
				if (ball.isCollidedWith(otherBall)) {
					console.log(initialVelocities + " the initial velocities")
	
					ball.ballCollision(
						initialVelocities[otherBall.number], 
						initialPositions[otherBall.number]
					);
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
	
	Game.prototype.checkMakes = function () {	
		var self = this;
		var toRemove = [];
	
		Object.keys(this.balls).forEach(function (i) {
			if (self.inHole(self.balls[i])) {
				toRemove.push(self.balls[i]);
			}
		});
	
		toRemove.forEach(function(ball) {
			self.removeBall(ball);
		});
	};
	
	Game.prototype.inHole = function (ball) {
		var x = ball.position[0];
		var y = ball.position[1];
		//TOPLEFT [0, 0] range = ball.radius * 2
		if ( x < 2*ball.radius && y < 2*ball.radius) {
			return true;
			// Game.removeBall(ball)
		//TOPRIGHT [0 + 2*ball.radius, Game.DIM_X - 2*ball.radius] 
		} else if ( x > Game.DIM_X - 2*ball.radius && y < 2*ball.radius ) {
			return true;
			// Game.removeBall(ball)
		//BOTTOMLEFT [0, DIM_Y]
		} else if ( x < 2*ball.radius && y > Game.DIM_Y - 2*ball.radius ) {
			return true;
			//BOTTOM RIGHT
		} else if ( x > Game.DIM_X - 2*ball.radius && y > Game.DIM_Y - 2*ball.radius) {
			return true;
		} 
		return false;
	};
	
	Game.prototype.removeBall = function (ball) {
		console.log('Ball Number: ' + ball.number + ' was deleted');
		delete this.balls[ball.number];
		console.log(this.balls);
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
		console.log('checking Back in Frame')
		ball.position = Util.subtract(ball.position, scaledVelocity);
	};
	
	module.exports = Game;
	 
	window.balls = Game.balls;
	


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(3);
	
	var RADIUS = 20;
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
		if (distanceBetween < 0.8*(this.radius + otherBall.radius)) { 
			// debugger
			// var overLap = 2*this.radius - distanceBetween;
			// var moveBackDistance = overLap/2;
			// var scaleFactorA = -1*moveBackDistance/Util.norm(this.velocity);
			// var scaleFactorB = -1*moveBackDistance/Util.norm(otherBall.velocity);
			// var backUpVectorA = Util.scale(this.velocity, scaleFactorA);
			// var backUpVectorB = Util.scale(otherBall.velocity, scaleFactorB);
			// this.position = Util.add(this.position, backUpVectorA);
			// otherBall.position = Util.add(otherBall.position, backUpVectorB);
	
	
			// var angleA = Util.angleCorrection(this.velocity, Util.angle(this.velocity));
			// var angleB = Util.angleCorrection(otherBall.velocity, Util.angle(otherBall.velocity));
			// var shiftA = [-(overLap/2)*Math.cos(angleA), (overLap/2)*Math.sin(angleA)];
			// var shiftB = [-(overLap/2)*Math.cos(angleB), (overLap/2)*Math.sin(angleB)];
			// var scaleB = Util.norm(otherBall.velocity)/(distanceBetween/2);
			// var scaledVelocityA = Util.scale(this.velocity, scaleA);
			// var scaledVelocityB = Util.scale(this.velocity, scalleB);
			// debugger
	
			// if (angleA !== angleA) {alert(angleA)}
			// this.position = Util.add(this.position, shiftA);
			// otherBall.position = Util.add(otherBall.position, shiftB);
			return true;
		}
		return false;
	
	};
	
	// http://billiards.colostate.edu/threads/physics.html
	var NORMAL_FRAME_TIME_DELTA = 1000/60;
	var BALL_TABLE_FRICTION = 0.25;
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
		this.railCollision();
	};
	
	Ball.prototype.tableFriction = function (deltaTime) {	
		var xVelocity = this.directionFriction(this.velocity[0], deltaTime);
		var yVelocity = this.directionFriction(this.velocity[1], deltaTime);
		var xVelocityRatio = xVelocity/this.velocity[0];
		var yVelocityRatio = yVelocity/this.velocity[1];
		var frictionCorrectionX = xVelocityRatio < 0  ? 0 : xVelocity;
		var frictionCorrectionY =	yVelocityRatio < 0  ? 0 : yVelocity;
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
		var reflection = this.game.isOutOfBounds(this);
		if (reflection) {
		 	var xVelocity = reflection[0]*(this.velocity[0]*BALL_BALL_RESTITUTION); //TIMES REBOUND this may result in only one velocity component being reversed in direction, depending on which wall it hits;
		 	// get angle from object direction, rebound angle = 180 - theta
		 	var yVelocity = reflection[1]*(this.velocity[1]*BALL_BALL_RESTITUTION); //TIMES ANGLE OF COLLISION;
		 	this.velocity = [xVelocity, yVelocity];
		}
	};
	
	Ball.prototype.ballCollision = function (otherInitialVelocity, otherPosition) {
		// var rotatedThisVelocity = 
		// 	Util.rotateVelocity(this.velocity, this.position, otherPosition);
		// var rotatedOtherVelocity = 
		// 	Util.rotateVelocity(otherInitialVelocity, otherPosition, this.position);
		console.log(otherInitialVelocity)
		var shiftedVelocity = 
			Util.velocityShift(this.velocity, otherInitialVelocity, this.position, otherPosition);
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
	
		unitVector: function (vector) {
			var factor = Util.norm(vector);
			return Util.scale(vector, 1/factor);
		},
	
		add: function (vectorA, vectorB) {
			return [vectorA[0] + vectorB[0], vectorA[1] + vectorB[1]];
		},
	
		subtract: function (vectorA, vectorB) {
			if (!vectorA) {
				console.log(vectorA + ' is not defined');
			}
			if (!vectorB) {
				console.log(vectorB + 'vector B is not defined');
			}
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
			if (!velocityScale) {
				console.log('Velocity A: ' + velocityA + ' Velocity B: ' + velocityB+ 'PositionA: ' + positionA+ 'PositionB: ' + positionB);
			}
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
/***/ function(module, exports) {

	var GameView = function (game, ctx) {
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

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(3)
	
	var Cue = function () {
		// this.position = options.position;
		// this.velocity = options.velocity;
		// this.radius = RADIUS;
		// this.number = options.number;
		// this.suit = options.suit;
		// this.color = options.color || COLOR;
		// this.game = options.game;
		this.color = "#FFFFFF";
	};
	
	Cue.prototype.draw = function (ctx) {
		ctx.fillStyle = this.color;
	
		// ctx.beginPath();
		// ctx.translate( 40, 40 );
		// ctx.rect(10,100,10,300);
		// ctx.fill();
	};
	
	Cue.prototype.listen = function () {
		var canvas = document.getElementById("canvas");
		canvas.addEventListener("click", this.capturePositon.bind(this));
	};
	
	Cue.prototype.capturePositon = function (event) {
		debugger
	};
	
	Cue.MAX_POWER = 100;
	
	Cue.prototype.mouseClickTimer = function (option) {
		// document.getElementById("canvas").addEventListener("mousedown");
		// document.getElementById("canvas").addEventListener("mouseup");
	};
	
	Cue.prototype.strikeVelocity = function (power, direction) {
		var cueVelocity = Util.scale(direction, power);
		return cueVelocity;
	};
	
	
	module.exports = Cue;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(3);
	
	var Weapon = function (options) {
		this.type = options.type;
		this.game = options.game;
	};
	
	Weapon.prototype.place = function () {
		var canvas = document.getElementById("canvas");
		canvas.addEventListener("click", this.capturePositon.bind(this));
	};
	
	Weapon.prototype.capturePositon = function (event) {
		var xPosition = event.clientX;
		var yPosition = event.clientY;
		this.action([xPosition, yPosition]);
	};
	
	Weapon.prototype.action = function (position) {
		var inRange = this.getBalls(position);
		inRange.forEach(function (ball) {
			var randomX = 100*(2*Math.random() - 1);
			var randomY = 100*(2*Math.random() - 1);
			var randomVector = [randomX, randomY];
			var unitVelocity = Util.unitVector(randomVector);
			ball.velocity = Util.scale(unitVelocity, 40*Math.random());
			// console.log(randomX + ' , ' + randomY);
			// console.log(randomVector);
		});
	};
	
	Weapon.prototype.getBalls = function (position) {
		var ballsInRange = [];
		var allBalls = this.game.balls;
		Object.keys(allBalls).forEach(function (idx) {
			if (Util.distance(allBalls[idx].position, position) < 100) {
				ballsInRange.push(allBalls[idx]);
			}
		});
		return ballsInRange;
	};
	
	module.exports = Weapon;

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map