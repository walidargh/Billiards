var Game = require('./game');

var GameView = function (game, ctx) {
	this.ctx = ctx;
	this.game = game;
	this.moved = false;
};

GameView.prototype.drawCheck = function (event) {
	this.event = event;
	this.moved = true;
};

GameView.prototype.start = function () {
	var canvas = document.getElementById('canvas');
	canvas.addEventListener("mousemove", this.drawCheck.bind(this));
	this.lastTime = 0;
	this.requestId = requestAnimationFrame(this.animate.bind(this));
};

GameView.prototype.animate = function (time, event) {
	var deltaTime = time - this.lastTime;
	if (this.game.over) {
		this.moved = false;
		cancelAnimationFrame(this.requestId);
		this.game = new Game (this.ctx);
		this.start();
		return;
	}

	this.game.step(deltaTime);
	if (this.moved) this.game.draw(this.ctx, this.event);
	else this.game.draw(this.ctx);
	this.moved = false;
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