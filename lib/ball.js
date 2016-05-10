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
	var distanceBetween = Util.distance;
};