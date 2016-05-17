var Util = require('./util');

var Cue = function (options) {
	this.cueBall = options.ball;
	this.cueBegan = false;
	this.color = "#FF0FFF";
	this.setListeners();
};

Cue.prototype.setListeners = function () {
	this.canvas = document.getElementById("canvas");
	this.beginCueListener = this.beginCue.bind(this, this.cueBall);
	this.canvas.addEventListener("mousedown", this.beginCueListener);
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


Cue.prototype.beginCue = function (cueBall, event) {
	if (Util.norm(cueBall.velocity) < 0.2) {
		this.velocityListener = this.calculateVelocity.bind(this, this.cueBall);
		this.canvas.addEventListener("mouseup", this.velocityListener);
	}
};

Cue.prototype.calculateVelocity = function (cueBall, event) {
	this.canvas.removeEventListener("mouseup", this.velocityListener);
	var start = cueBall.position;
	var end = [event.pageX - canvas.offsetLeft, event.clientY - canvas.offsetTop];
	var velocity = Util.subtract(start, end);
	var unitVelocity = Util.unitVector(velocity);
	var speed = Util.norm(velocity)*0.9;
	if (speed > 15) {
		speed = 15;
	}

	var scaledVelocity = Util.scale(unitVelocity, speed);
	cueBall.velocity = scaledVelocity;
};

Cue.MAX_POWER = 100;

Cue.prototype.strikeVelocity = function (power, direction) {
	var cueVelocity = Util.scale(direction, power);
	return cueVelocity;
};


module.exports = Cue;

window.Cue = Cue;