export function getPower(x, y) {
	return x ^ y;
}

export const getMul = (x, y) => {
	return x * y;
};

export function* getNext() {
	yield Math.random();
}

export {
	getPower,
	getPower as calculatePower,
};
