var Util = require('./util');

var Cue = function () {
	// this.position = options.position;
	// this.velocity = options.velocity;
	// this.radius = RADIUS;
	// this.number = options.number;
	// this.suit = options.suit;
	// this.color = options.color || COLOR;
	// this.game = options.game;
	this.color = "#000000";
};

// Cue.prototype.draw = function (ctx, cueBall, event) {
// 	ctx.fillStyle = this.color;
// 	var cueBallX = cueBall.position[0];
// 	var cueBallY = cueBall.position[1];
// 	var cueEndX = event.clientX;
// 	var cueEndY = event.clientY;
// 	ctx.beginPath();
// 	ctx.moveTo(cueBallX, cueBallY);
// 	ctx.lineTo(cueEndX, cueEndY);
// 	// ctx.translate( 40, 40 );
// 	// ctx.rect(10,100,10,300);
// 	ctx.fill();
// };

// Cue.prototype.listen = function () {
// 	var canvas = document.getElementById("canvas");
// 	canvas.addEventListener("mouseup", this.capturePositon.bind(this));
// };

// Cue.prototype.capturePositon = function (event) {
// 	debugger
// };

Cue.prototype.place = function (cueBall) {
	var self = this;
	var canvas = document.getElementById("canvas");
	this.beginCueListener = canvas.addEventListener("mousedown", this.beginCue.bind(this, cueBall));
	// this.followCueListener = canvas.addEventListener("mousemove", this.draw.bind(this, ctx, cueBall));
};

Cue.prototype.beginCue = function (cueBall, event) {
	var start = cueBall.position;
	var canvas = document.getElementById("canvas");
	canvas.removeEventListener("mousedown", this.beginCue.bind(this, cueBall));
	canvas.addEventListener("mouseup", this.calculateVelocity.bind(this, cueBall));
};

Cue.prototype.calculateVelocity = function (cueBall, event) {
	var canvas = document.getElementById("canvas");
	canvas.removeEventListener("mouseup", this.calculateVelocity.bind(this, cueBall));
	// canvas.removeEventListener("mousemove", this.draw);
	var start = cueBall.position;
	var end = [event.clientX, event.clientY];
	var velocity = Util.subtract(start, end);
	var unitVelocity = Util.unitVector(velocity);
	var speed = Util.norm(velocity);
	if (speed > 10) {
		speed = 10;
	}

	var scaledVelocity = Util.scale(unitVelocity, speed);
	cueBall.velocity = scaledVelocity;
};

Cue.MAX_POWER = 100;

// Cue.prototype.mouseClickTimer = function (option) {
// 	// document.getElementById("canvas").addEventListener("mousedown");
// 	// document.getElementById("canvas").addEventListener("mouseup");
// };

Cue.prototype.strikeVelocity = function (power, direction) {
	var cueVelocity = Util.scale(direction, power);
	return cueVelocity;
};


module.exports = Cue;