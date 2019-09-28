import { remove } from '@suns-echoes/file-system-utils/src/utils/remove';

import { config } from '../config';


export async function cleanup() {
	await remove(config.paths.dist);
}
