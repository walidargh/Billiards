var Util = require('./util');

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
		if (overLap <= 0) console.log(overLap, this.position, this.number, otherBall.position, otherBall.number)
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