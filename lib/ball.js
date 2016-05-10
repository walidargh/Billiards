var Util = require('./util');

var Ball = function (options) {
	this.position = options.position;
	this.velocity = options.velocity;
	this.radius = options.radius;
	this.number = options.number;
	this.suit = options.suit;
};

Ball.prototype.collideWith = function (otherBall) {

};

Ball.prototype.draw = function (ctx) {

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

Ball.prototype.move = function (timeDelta) {
	var velocityScale = timeDelta/NORMAL_FRAME_TIME_DELTA;
	var deltaX = this.velocity[0] * velocityScale;
	var deltaY = this.velocity[1] * velocityScale;
		//Shoul I move then update speed or update speed then move
}