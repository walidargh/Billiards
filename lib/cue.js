var Util = require('./util');

var Cue = function (options) {
	// this.position = options.position;
	// this.velocity = options.velocity;
	// this.radius = RADIUS;
	// this.number = options.number;
	// this.suit = options.suit;
	// this.color = options.color || COLOR;
	// this.game = options.game;
	this.cueBall = options.ball;
	this.cueBegan = false;
	this.color = "#FF0FFF";
	this.setListeners();
};

Cue.prototype.setListeners = function () {
	var canvas = document.getElementById("canvas");
	var self = this;

	this.beginCueListener = this.beginCue.bind(this, this.cueBall);
	canvas.addEventListener("mousedown", self.beginCueListener);
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

// Cue.prototype.place = function (cueBall, ctx) {
// 	var self = this;

// 	// canvas.addEventListener("mousedown", self.beginCueListener);
// 	// canvas.removeEventListener("mousedown", self.beginCueListener);
// 	// this.drawListener = this.draw.bind(this, ctx, cueBall);
// 	// canvas.addEventListener("mousemove", self.drawListener);
// };

Cue.prototype.beginCue = function (cueBall, event) {
	console.log(Util.norm(cueBall.velocity));
	if (Util.norm(cueBall.velocity) < 0.2) {
		console.log('beginning cue');
		var canvas = document.getElementById("canvas");
		var self = this;
		this.velocityListener = this.calculateVelocity.bind(this, this.cueBall);
		canvas.addEventListener("mouseup", self.velocityListener);
	}
};

Cue.prototype.calculateVelocity = function (cueBall, event) {
	var canvas = document.getElementById("canvas");
	var self = this;
	canvas.removeEventListener("mouseup", self.velocityListener);
	// canvas.removeEventListener("mousemove", self.drawListener);
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

window.Cue = Cue;