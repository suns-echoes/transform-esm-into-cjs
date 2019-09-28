export const config = {
	paths: {
		dist: 'dist',
		main: {
			input: 'src/index.js',
			output: 'dist/index.js',
		},
		src: {
			input: 'src',
			output: 'dist/src',
		},
		docs: {
			input: 'docs',
			output: 'dist/docs',
		},
	},
	rollup: {
		plugins: {
			terser: {
			},
		},
	},
};
