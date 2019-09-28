import { exec } from '@suns-echoes/exec/src/exec';


(async function runTests() {
	let errors = '';

	function stderr(message) {
		errors += message;
	}

	const { code, output } = await exec('npm', ['run', 'test'], { stderr });

	if (code !== 0) {
		throw output;
	}
	else if (errors !== '') {
		// eslint-disable-next-line no-console
		console.error(errors);
	}
})();
