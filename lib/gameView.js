var Game = require('./game');

var GameView = function (game, ctx) {
	this.ctx = ctx;
	this.game = game;
};

GameView.prototype.start = function () {
	var canvas = document.getElementById('canvas');
	this.lastTime = 0;
	this.requestId = requestAnimationFrame(this.animate.bind(this));
};

GameView.prototype.animate = function (time, event) {
	var deltaTime = time - this.lastTime;
	if (this.game.over) {
		cancelAnimationFrame(this.requestId);
		this.game = new Game ();
		this.start();
		return;
	}
	this.game.step(deltaTime);
	this.game.draw(this.ctx, event);
	// this.ctx.clearRect(0, 0, this.game.DIM_X, this.game.DIM_Y);
	this.lastTime = time;
	requestAnimationFrame(this.animate.bind(this));
};	

// GameView.prototype.start = function () {
// 	var self = this;
// 	setInterval(function () {
// 		self.game.draw(self.ctx);
// 		self.game.step(5, self.ctx);
// 	}, 5);
// };

module.exports = GameView;