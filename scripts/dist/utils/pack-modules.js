import { rollup } from 'rollup';

import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

import { config } from '../config';


const inputOptions = {
	input: config.paths.main.input,
	treeshake: true,
	plugins: [
		resolve(),
		commonjs(),
		terser(config.rollup.plugins.terser),
	],
};

const outputOptions = {
	compact: true,
	exports: 'named',
	file: config.paths.main.output,
	format: 'cjs',
};


export async function packModules() {
	const bundle = await rollup(inputOptions);

	await bundle.write(outputOptions);
}
