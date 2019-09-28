'use strict';

class Tree {
	constructor(type) {
		this.type = type;
	}
}

class Birch extends Tree {
	constructor() {
		super('birch');
	}
}

class Pine extends Tree {
	constructor() {
		super('pine');
	}
}

module.exports.Tree = Tree;
module.exports.Birch = Birch;
module.exports.Pine = Pine;
module.exports.BirchTree = Birch;
module.exports.Evergreen = Pine;
