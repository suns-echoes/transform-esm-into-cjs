import { copy } from '@suns-echoes/file-system-utils/src/utils/copy';

import { config } from '../config';


const isFolder = (src) => (/(?:^|[\\/])[^\\/.]+$/.test(src));
const isJSFile = (src) => (/\.js$/.test(src));
const isSpecFile = (src) => (/\.spec\.js$/.test(src));


const filter = (src) => {
	if (isFolder(src) || isJSFile(src) && !isSpecFile(src)) {
		return true;
	}
	else {
		return false;
	}
};


export async function copySourceFiles() {
	await copy(config.paths.src.input, config.paths.src.output, filter);
}
