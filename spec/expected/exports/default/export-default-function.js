'use strict';

function func(arg1, arg2, ...rest) {
	return [arg1, arg2, rest];
}

module.exports = func;
