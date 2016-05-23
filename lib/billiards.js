var Game = require('./game');
var GameView = require('./gameView');

document.addEventListener("DOMContentLoaded", function () {
	var canvasEl = document.getElementsByTagName("canvas")[0];
	canvasEl.width = Game.DIM_X + 400;
	canvasEl.height  = Game.DIM_Y + 400;

	var ctx = canvasEl.getContext("2d");
	var game = new Game(ctx);
	new GameView(game, ctx).start();
});