var GameView = function (game, ctx) {
	console.log('building game view');
	this.ctx = ctx;
	this.game = game;
};


GameView.prototype.start = function () {
	this.lastTime = 0;
	requestAnimationFrame(this.animate.bind(this));
};

GameView.prototype.animate = function (time) {
	var deltaTime = time - this.lastTime;

	this.game.step(deltaTime);
	this.game.draw(this.ctx);
	this.lastTime = time;

	requestAnimationFrame(this.animate.bind(this));
};	

module.exports = GameView;