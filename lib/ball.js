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