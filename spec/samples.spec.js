import { basename } from 'path';

import { listFiles } from '@suns-echoes/file-system-utils/src/utils/list-files';
import { readTextFile } from '@suns-echoes/file-system-utils/src/utils/read-text-file';

import { transformESMIntoCJS } from '../src/transform-esm-into-cjs';


describe('ESM samples for transformation tests', () => {
	function testSample(filepath) {
		const filename = basename(filepath).replace(/\.[^.]+$/, '');

		it(filename.replace(/-/g, ' '), async () => {
			const sample = await readTextFile(filepath);
			const expected = await readTextFile(filepath.replace(/([\\/])samples([\\/])/, '$1expected$2'));

			const transformed = transformESMIntoCJS(sample);

			expect(transformed).to.be.equal(expected);
		});
	}

	it('finds test samples', async () => {
		const samples = await listFiles('spec/samples');

		expect(samples).to.have.lengthOf.at.least(1);

		if (samples.length > 0) {
			describe('transform ESM samples into CJS', () => {
				samples.forEach((filepath) => testSample(filepath));
			});
		}
	});
});
