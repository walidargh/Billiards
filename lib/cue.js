var Util = require('./util');

var Cue = function () {
	// this.position = options.position;
	// this.velocity = options.velocity;
	// this.radius = RADIUS;
	// this.number = options.number;
	// this.suit = options.suit;
	// this.color = options.color || COLOR;
	// this.game = options.game;
	this.color = "#FF0FFF";
};

Cue.prototype.draw = function (ctx, cueBall, event) {
	ctx.fillStyle = this.color;
	var cueBallX = cueBall.position[0];
	var cueBallY = cueBall.position[1];
	var cueEndX = event.clientX;
	var cueEndY = event.clientY;
	ctx.beginPath();
	ctx.moveTo(cueBallX, cueBallY);
	ctx.lineTo(cueEndX, cueEndY);
	// // ctx.translate( 40, 40 );
	// ctx.rect(100,100,100,300);
	// // ctx.closePath();
	ctx.stroke();
	// ctx.fill();
};

// Cue.prototype.listen = function () {
// 	var canvas = document.getElementById("canvas");
// 	canvas.addEventListener("mouseup", this.capturePositon.bind(this));
// };

// Cue.prototype.capturePositon = function (event) {
// 	debugger
// };

Cue.prototype.place = function (cueBall, ctx) {
	var self = this;
	var canvas = document.getElementById("canvas");
	this.beginCueListener = this.beginCue.bind(this, cueBall);
	canvas.addEventListener("mousedown", self.beginCueListener);
	this.drawListener = this.draw.bind(this, ctx, cueBall);
	canvas.addEventListener("mousemove", self.drawListener);
};

Cue.prototype.beginCue = function (cueBall, event) {
	var canvas = document.getElementById("canvas");
	var self = this;

	canvas.removeEventListener("mousedown", self.beginCueListener);

	this.velocityListener = this.calculateVelocity.bind(this, cueBall);
	canvas.addEventListener("mouseup", self.velocityListener);
};

Cue.prototype.calculateVelocity = function (cueBall, event) {
	var canvas = document.getElementById("canvas");
	var self = this;

	canvas.removeEventListener("mouseup", self.velocityListener);
	canvas.removeEventListener("mousemove", self.drawListener);

	var start = cueBall.position;
	var end = [event.clientX, event.clientY];
	var velocity = Util.subtract(start, end);
	var unitVelocity = Util.unitVector(velocity);
	var speed = Util.norm(velocity);
	if (speed > 15) {
		speed = 15;
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