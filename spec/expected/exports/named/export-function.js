'use strict';

function getPower(x, y) {
	return x ^ y;
}

const getMul = (x, y) => {
	return x * y;
};

function* getNext() {
	yield Math.random();
}

module.exports.getPower = getPower;
module.exports.getMul = getMul;
module.exports.getNext = getNext;
module.exports.getPower = getPower;
module.exports.calculatePower = getPower;
