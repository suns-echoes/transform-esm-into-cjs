'use strict';

class Tree {
	constructor(type) {
		this.type = type;
	}
}

const evergreen = new Tree('pine');

module.exports.default = evergreen;

module.exports.Tree = Tree;
