var Ball = require('./ball');

var Game = function () {
	this.balls = [];

	this.populateTable();
};

Game.DIM_X = 500;
Game.DIM_Y = 1000;
Game.FPS = 32;
Game.BG_COLOR = "#000000";

Game.prototype.populateTable = function (object) {
	var game = this;
	for (var i = 0; i < 10; i++) {
		var suit;
		if (i === 0) {
			suit = "cue";
		} else if (i < 9 ) {
				suit = "solid";
			} else {
					suit = "striped";
				}
		this.balls.push(new Ball(
			{
				position: [0, i],
				velocity: [i, 0],
				number: i,
				suit: suit,
				game: game
			}

		));
	}
};

Game.prototype.step = function () {
	this.balls.forEach(function (ball) {
		ball.move();
	});
};

Game.prototype.draw = function (ctx) {
	ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
	ctx.fillStyle = Game.BG_COLOR;
	ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);

	this.balls.forEach(function (ball) {
		ball.draw(ctx);
	});
};

module.exports = Game;
 

