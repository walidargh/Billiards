var GameView = function (game, ctx) {
	this.ctx = ctx;
	this.game = game;
};


GameView.prototype.start = function () {
	this.lastTime = 0;
	this.requestId = requestAnimationFrame(this.animate.bind(this));
};

GameView.prototype.animate = function (time) {
	var deltaTime = time - this.lastTime;
	if (this.game.over) {
		cancelAnimationFrame(this.requestId);
		this.start();
	}
	this.game.step(deltaTime, this.ctx);
	this.game.draw(this.ctx);
	this.lastTime = time;

	requestAnimationFrame(this.animate.bind(this));
};	

module.exports = GameView;