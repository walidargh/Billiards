var Util = require('./util');

var Cue = function (options) {
	this.cueBall = options.ball;
	this.ctx = options.ctx;
	this.cueDrawnBack = false;
	this.color = "#FF0FFF";
	this.setListeners();
	this.getImg();
	this.cueDistance = 0;
	this.cueMoveForward = false;
};

Cue.prototype.setListeners = function () {
	this.canvas = document.getElementsByTagName("body")[0];
	this.beginCueListener = this.beginCue.bind(this, this.cueBall);
	this.canvas.addEventListener("mousedown", this.beginCueListener);
};

Cue.prototype.getImg = function () {
	var cueImg = new Image();
	cueImg.onload = function () {};
	cueImg.src = './images/pool_cue.png';
	this.cueImg = cueImg;
	this.imgLoaded = true;
};

Cue.prototype.draw = function (ctx, event) {
	if (this.cueDrawnBack) {

		// ctx.fillStyle = this.color;
		// ctx.fillRect(0, 0, 290, 300);
		// ctx.fillStyle="#FFFFFF";
		var cueBallX = this.cueBall.position[0];
		var cueBallY = this.cueBall.position[1];
		if (event && !this.cueMoveForward) {
			var cueEndX = event.offsetX;
			var cueEndY = event.offsetY;
			var cueEnd = [cueEndX, cueEndY];
			this.cueAngle = Util.collisionAngle(this.cueBall.position, cueEnd);
			this.cueDistance = 0.5*Util.distance(this.cueBall.position, cueEnd);
		}
		// console.log(-cueAngle);
		ctx.save();
		ctx.translate(cueBallX, cueBallY);
		ctx.rotate(-1*this.cueAngle);
		// ctx.beginPath();
		// ctx.moveTo(cueBallX, cueBallY);
		// ctx.lineTo(cueEndX, cueEndY);
		// ctx.stroke();
		// ctx.fill();
		
		ctx.drawImage(this.cueImg, 10 + this.cueDistance, -7);
		ctx.restore();
	}
};

Cue.prototype.beginCue = function (cueBall, event) {
	if (Util.norm(cueBall.velocity) <= 0.1) {
		this.cueDrawnBack = true;
		this.velocityListener = this.calculateVelocity.bind(this);
		var cueEndX = event.offsetX;
		var cueEndY = event.offsetY;
		var cueEnd = [cueEndX, cueEndY];
		this.cueAngle = Util.collisionAngle(this.cueBall.position, cueEnd);
		this.canvas.addEventListener("mouseup", this.velocityListener);
	}
};

Cue.prototype.move = function (deltaTime) {
	if (this.cueMoveForward) {
		this.cueDistance -= 0.04*Util.norm(this.scaledVelocity)*deltaTime;
	}
	if (this.cueMoveForward && this.cueDistance <= 2) {
		this.cueBall.velocity = this.scaledVelocity;
		this.cueMoveForward = false;
		this.cueDrawnBack = false;
	}
};

Cue.prototype.calculateVelocity = function (event) {
	this.canvas.removeEventListener("mouseup", this.velocityListener);
	this.cueMoveForward = true;
	var start = this.cueBall.position;
	var end = 
		[event.pageX - canvas.offsetLeft, event.offsetY];
	var velocity = Util.subtract(start, end);
	var unitVelocity = Util.unitVector(velocity);
	var speed = Util.norm(velocity)*0.10;
	if (speed > 20) {
		speed = 20;
	}

	this.scaledVelocity = Util.scale(unitVelocity, speed);
};

Cue.prototype.strikeVelocity = function (power, direction) {
	var cueVelocity = Util.scale(direction, power);
	return cueVelocity;
};

module.exports = Cue;

window.Cue = Cue;