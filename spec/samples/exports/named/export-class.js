export class Tree {
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

export {
	Birch,
	Pine,
};

export {
	Birch as BirchTree,
	Pine as Evergreen,
};
