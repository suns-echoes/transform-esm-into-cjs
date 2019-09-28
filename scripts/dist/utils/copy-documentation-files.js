import { join } from 'path';

import { copy } from '@suns-echoes/file-system-utils/src/utils/copy';

import { config } from '../config';


export async function copyDocumentationFiles() {
	await copy('LICENSE', join(config.paths.dist, 'LICENSE'));
	await copy('README.md', join(config.paths.dist, 'README.md'));
	// await copy(config.paths.docs.input, config.paths.docs.output);
}
