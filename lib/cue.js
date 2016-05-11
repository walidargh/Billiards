var Util = require('./util')

var Cue = function () {
	// this.position = options.position;
	// this.velocity = options.velocity;
	// this.radius = RADIUS;
	// this.number = options.number;
	// this.suit = options.suit;
	// this.color = options.color || COLOR;
	// this.game = options.game;
	this.color = "#FFFFFF";
};

Cue.prototype.draw = function (ctx) {
	ctx.fillStyle = this.color;

	// ctx.beginPath();
	// ctx.translate( 40, 40 );
	// ctx.rect(10,100,10,300);
	// ctx.fill();
};

Cue.MAX_POWER = 100;

Cue.prototype.mouseClickTimer = function (option) {
	// document.getElementById("canvas").addEventListener("mousedown");
	// document.getElementById("canvas").addEventListener("mouseup");
};

Cue.prototype.strikeVelocity = function (power, direction) {
	var cueVelocity = Util.scale(direction, power);
	return cueVelocity;
};


module.exports = Cue;