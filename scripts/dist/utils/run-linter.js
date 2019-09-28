import { exec } from '@suns-echoes/exec/src/exec';


export async function runLinter() {
	const { code, output } = await exec('npm', ['run', 'lint']);

	if (code !== 0) {
		throw output;
	}
}
