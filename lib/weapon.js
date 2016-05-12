var Util = require('./util');

var Weapon = function (options) {
	this.type = options.type;
	this.game = options.game;
};

Weapon.prototype.place = function () {
	var canvas = document.getElementById("canvas");
	canvas.addEventListener("click", this.capturePositon.bind(this));
};

Weapon.prototype.capturePositon = function (event) {
	var xPosition = event.clientX;
	var yPosition = event.clientY;
	var cueBall = this.game.findBall(0);
	if (Util.distance(cueBall, [xPosition, yPosition]) < 30) {
		this.action([xPosition, yPosition]);
	}
};

Weapon.prototype.action = function (position) {
	var inRange = this.getBalls(position);
	inRange.forEach(function (ball) {
		var randomX = 100*(2*Math.random() - 1);
		var randomY = 100*(2*Math.random() - 1);
		var randomVector = [randomX, randomY];
		var unitVelocity = Util.unitVector(randomVector);
		ball.velocity = Util.scale(unitVelocity, 10*Math.random());
		// console.log(randomX + ' , ' + randomY);
		// console.log(randomVector);
	});
};

Weapon.prototype.getBalls = function (position) {
	var ballsInRange = [];
	var allBalls = this.game.balls;
	Object.keys(allBalls).forEach(function (idx) {
		if (Util.distance(allBalls[idx].position, position) < 100) {
			ballsInRange.push(allBalls[idx]);
		}
	});
	return ballsInRange;
};

module.exports = Weapon;