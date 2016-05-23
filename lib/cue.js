var Util = require('./util');

var Cue = function (options) {
	this.cueBall = options.ball;
	this.ctx = options.ctx;
	this.cueDrawnBack = false;
	this.color = "#FF0FFF";
	this.setListeners();
	this.getImg();
};

Cue.prototype.setListeners = function () {
	this.canvas = document.getElementsByTagName("body")[0];
	this.beginCueListener = this.beginCue.bind(this, this.cueBall);
	this.canvas.addEventListener("mousedown", this.beginCueListener);
};

Cue.prototype.getImg = function () {
	console.log('getting image');
	var cueImg = new Image();
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
		// var cueEndX = event.pageX - canvas.offsetLeft;
		// var cueEndY = event.pageY - canvas.offsetTop;
		ctx.save();
		// ctx.beginPath();
		// ctx.moveTo(cueBallX, cueBallY);
		// ctx.lineTo(cueEndX, cueEndY);
		// ctx.stroke();
		// ctx.fill();
		// ctx.restore();
		ctx.drawImage(this.cueImg, cueBallX, cueBallY);
		// cueImg.onload = function () {
		// 	console.log('loaded');
		// 	debugger
			
		// };
	}
};


Cue.prototype.beginCue = function (cueBall, event) {
	if (Util.norm(cueBall.velocity) < 0.2) {
		this.cueDrawnBack = true;
		this.velocityListener = this.calculateVelocity.bind(this);
		// this.drawListener = this.draw.bind(this);
		// this.canvas.addEventListener("mousemove", this.drawListener);
		this.canvas.addEventListener("mouseup", this.velocityListener);
	}
};

Cue.prototype.calculateVelocity = function (event) {
	this.canvas.removeEventListener("mouseup", this.velocityListener);
	this.cueDrawnBack = false;
	// this.canvas.removeEventListener("mousemove", this.drawListener);
	var start = this.cueBall.position;
	var end = 
		[event.pageX - canvas.offsetLeft, event.clientY - canvas.offsetTop];
	var velocity = Util.subtract(start, end);
	var unitVelocity = Util.unitVector(velocity);
	var speed = Util.norm(velocity)*0.15;
	if (speed > 15) {
		speed = 15;
	}

	var scaledVelocity = Util.scale(unitVelocity, speed);
	this.cueBall.velocity = scaledVelocity;
};

Cue.MAX_POWER = 100;

Cue.prototype.strikeVelocity = function (power, direction) {
	var cueVelocity = Util.scale(direction, power);
	return cueVelocity;
};


module.exports = Cue;

window.Cue = Cue;