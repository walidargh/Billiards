var Game = require('./game');
var GameView = require('./gameView');
var React= require('react');
var ReactDOM = require('react-dom');
var Modal = require('./welcomeModal');

var startGame = function (ctx) {
	var game = new Game(ctx);
	new GameView(game, ctx).start();
};

document.addEventListener("DOMContentLoaded", function () {
	var canvasEl = document.getElementById("canvas");
	canvasEl.width = Game.DIM_X + 400;
	canvasEl.height  = Game.DIM_Y + 400;
	var ctx = canvasEl.getContext("2d");
	ReactDOM.render(<Modal startGame={startGame.bind(this, ctx)} />, canvasEl);
});