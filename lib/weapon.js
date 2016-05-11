var Weapon = function (options) {
	this.type = options.type
};

Weapon.prototype.place = function () {
	debugger
	var canvas = document.getElementById("canvas");
	canvas.addEventListener("onClick", this.capturePositon);
};

Weapon.prototype.capturePositon = function (event) {
	debugger
	var xPosition = event.clientX;
	var yPosition = event.clientY;
};

module.exports = Weapon;