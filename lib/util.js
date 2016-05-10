var Util = {
	direction: function (vector) {
		var norm = Util.norm(vector);
		return Util.scale(vector, 1/norm);
	},

	distance: function (pos1, pos2) {
		var xSquared = Math.pow(pos1[0] - pos2[0], 2);
		var ySquared = Math.pow(pos1[1] - pos2[1], 2);
		return Math.sqrt(xSquared + ySquared);
	},

	norm: function (vector) {
		return Util.distance([0, 0], vector);
	},

	scale: function (vector, factor) {
		var scaled = [vector[0]*factor, vector[1]*factor];
		return scaled;
	}
};

module.exports = Util;