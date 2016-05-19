var Game = require('./game');
var GameView = require('./gameView');

document.addEventListener("DOMContentLoaded", function () {
	var canvasEl = document.getElementsByTagName("canvas")[0];
	canvasEl.width = Game.DIM_X + 40;
	canvasEl.height  = Game.DIM_Y + 40;

	var ctx = canvasEl.getContext("2d");
	var game = new Game();
	new GameView(game, ctx).start();
});