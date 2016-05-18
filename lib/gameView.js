var GameView = function (game, ctx) {
	this.ctx = ctx;
	this.game = game;
};

GameView.prototype.start = function () {
	var canvas = document.getElementById('canvas');
	this.lastTime = 0;
	// var cue = this.game.cue;
	var drawListener = this.animate.bind(this);
	// this.canvas.removeEventListener("mousemove", cue.draw.bind(cue));
	canvas.addEventListener("mousemove", drawListener);
	this.requestId = requestAnimationFrame(this.animate.bind(this));
};

GameView.prototype.animate = function (event, time) {
	var deltaTime = time - this.lastTime;
	if (this.game.over) {
		cancelAnimationFrame(this.requestId);
		this.start();
	}
	this.game.step(deltaTime);
	this.game.draw(this.ctx, event);
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