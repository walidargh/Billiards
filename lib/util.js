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
	},

	unitVector: function (vector) {
		var factor = Util.norm(vector);
		return Util.scale(vector, 1/factor);
	},

	add: function (vectorA, vectorB) {
		return [vectorA[0] + vectorB[0], vectorA[1] + vectorB[1]];
	},

	subtract: function (vectorA, vectorB) {
		return [vectorA[0] - vectorB[0], vectorA[1] - vectorB[1]];
	},

	collisionAngle: function (positionA, positionB) {
			var collisionAngle = Math.atan2((positionA[1] - positionB[1]), (positionB[0] - positionA[0])
											);
			return collisionAngle;
	},

	angle: function (position) {
		if (position[0] === 0 && position[1] === 0) {
			return Math.atan(1/1);
		}
		var angle = Math.atan( position[0]/(-1*position[1]));
		return angle;
	},

	dotProduct: function (vectorA, vectorB) {
		var result = vectorA[0]*vectorB[0] + vectorA[1]*vectorB[1];
		return result;

	},

	angleCorrection: function (vector, angle) {
		if (angle < 0) {
			angle += 2*Math.PI;
			if (vector[0] < 0) {
				angle -= Math.PI;
			}
 		} else {
	 			if (vector[0] < 0) {
	 				angle += Math.PI;
 				}
 			}
 		return angle;
	},

	velocityShift: function (velocityA, velocityB, positionA, positionB) {
		var velocityDiff = Util.subtract(velocityA, velocityB);
		var positionDiff = Util.subtract(positionA, positionB);
		var dotProduct = Util.dotProduct(velocityDiff, positionDiff);
		var positionNorm = Util.norm(positionDiff);		
		var velocityScale = (dotProduct)/(Math.pow(positionNorm, 2));

		return Util.scale(positionDiff, velocityScale);
	}



	// rotateVelocity: function (velocityA, positionA, positionB) {
	// 	debugger
	// 	var collisionAngle = Util.collisionAngle(positionA, positionB);
	// 	var angleA = Util.angle(velocityA);
	// 	// var angleB = Util.angle(positionB);
	// 	var speed = this.norm(velocityA);
	// 	var rotatedAXVelocity = speed*Math.cos(angleA + collisionAngle);
	// 	// var rotatedBXVelocity = velocityB[0]*Math.cos(angleB - collisionAngle);
	// 	var rotatedAYVelocity = -1*speed*Math.sin(angleA + collisionAngle);
	// 	// var rotatedBYVelocity = velocityB[1]*Math.cos(angleB - collisionAngle);
	// 	return [rotatedAXVelocity, rotatedAYVelocity];
	// },



};

module.exports = Util;