var Util = {
	dir: function (vec) {
		var norm = Util.norm(vec);
		return Util.scale(vec, 1/norm);
	},

	dist: function (pos1, pos2) {
		var xSquared = Math.pow(pos1[0] - pos2[0], 2);
		var ySquared = Math.pow(pos1[1] - pos2[1], 2);
		return Math.sqrt(xSquared + ySquared);
	},

	norm: function (vec) {
		return Util.dist([0, 0], vec);
	},
};