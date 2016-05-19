var Util = require('./util');

var Weapon = function (options) {
	this.type = options.type;
	this.game = options.game;
	this.count = 3
};

Weapon.prototype.place = function () {
	var canvas = document.getElementById("canvas");
	this.weaponListener = this.capturePositon.bind(this);
	var self = this;
	canvas.addEventListener("click", self.weaponListener);
};

Weapon.prototype.capturePositon = function (event) {
	// var canvas = document.getElementById("canvas");
	var self = this;
	var xPosition = event.pageX - canvas.offsetLeft;
	var yPosition = event.clientY - canvas.offsetTop;
	var cueBall = this.game.findBall(0);
	if (Util.distance(cueBall.position, [xPosition, yPosition]) < 10) {
		this.action([xPosition, yPosition], cueBall);
	}
	// canvas.removeEventListener("click", self.weaponListener);
};

// Weapon.prototype.action = function (position) {
// 	var inRange = this.getBalls(position);
// 	inRange.forEach(function (ball) {
// 		var randomX = 100*(2*Math.random() - 1);
// 		var randomY = 100*(2*Math.random() - 1);
// 		var randomVector = [randomX, randomY];
// 		var unitVelocity = Util.unitVector(randomVector);
// 		ball.velocity = Util.scale(unitVelocity, 10*Math.random());
// 		ball.velocity = Util.scale(unitVelocity, 20*Math.random());
// 	});
// };
Weapon.prototype.action = function (position, cueBall) {
	if (this.count > 0) {
		var balls = this.getBalls();
		balls.forEach(function (ball) {
			if (ball !== cueBall) {
				var vectorDiff = Util.subtract(ball.position, cueBall.position);
				var distanceFrom = Util.norm(vectorDiff);
				var scaledVelocity = Util.scale(vectorDiff, Math.pow(1/(distanceFrom), 2));
				ball.velocity = Util.scale(scaledVelocity, 1800*Math.random());
			} else {
				var randomX = 100*(2*Math.random() - 1);
				var randomY = 100*(2*Math.random() - 1);

				var randomVector = [randomX, randomY];
				var unitVelocity = Util.unitVector(randomVector);
				ball.velocity = Util.scale(unitVelocity, 15*Math.random());
			}
		});
		this.count -= 1;
	}
};

Weapon.prototype.getBalls = function () {
	var ballsInRange = [];
	var allBalls = this.game.balls;
	Object.keys(allBalls).forEach(function (idx) {
			ballsInRange.push(allBalls[idx]);
	});
	return ballsInRange;
};

Weapon.prototype.removeListener = function () {
	var canvas = document.getElementById("canvas");
	var self = this;
	canvas.removeEventListener("click", self.weaponListener);
	console.log('removed listener');
};

module.exports = Weapon;