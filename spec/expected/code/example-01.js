'use strict';

const Reaction = require('reaction').default;
const { renderer } = require('reaction');
const { state: appState } = require('state-for-app');

const { tools } = require('tools');


class SimpleReaction extends Reaction {
	constructor(props) {
		super(props);

		appState.setState('simple-reaction', {
			reaction: 'idle',
		});
	}

	jump() {
		appState.setState('simple-reaction', {
			reaction: 'jump',
		});
	}
}

module.exports.SimpleReaction = SimpleReaction;
