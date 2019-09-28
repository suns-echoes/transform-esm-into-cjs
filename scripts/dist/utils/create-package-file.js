import { join } from 'path';

import { readJSONFile } from '@suns-echoes/file-system-utils/src/utils/read-json-file';
import { writeJSONFile } from '@suns-echoes/file-system-utils/src/utils/write-json-file';

import { config } from '../config';


const whitelist = [
	'name',
	'main',
	'version',
	'description',
	'homepage',
	'repository',
	'author',
	'license',
	'dependencies',
];


export async function createPackageFile() {
	const pkg = await readJSONFile('./package.json');

	Object.keys(pkg).forEach((key) => {
		if (!whitelist.includes(key)) {
			pkg[key] = undefined;
		}
	});

	await writeJSONFile(join(config.paths.dist, 'package.json'), pkg, null, '  ');
}
