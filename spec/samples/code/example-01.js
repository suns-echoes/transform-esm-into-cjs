import Reaction, { renderer } from 'reaction';
import { state as appState } from 'state-for-app';

import { tools } from 'tools';


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


export {
	SimpleReaction,
}
