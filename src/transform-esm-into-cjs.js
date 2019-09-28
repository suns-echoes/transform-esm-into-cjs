const { transformExports } = require('./transform/exports');
const { transformImports } = require('./transform/imports');


/**
 * Transforms ES modules into CommonJS.
 * @function transformESMIntoCJS
 * @param {string} source - original source code (ESM)
 * @param {boolean} [silent=false] - mute warnings
 * @returns {string} - transformed source code (CJS)
 */
function transformESMIntoCJS(source, silent = false) {
	let newSource = source;
	let mixedExports = false;
	let mixedImports = false;

	({ mixedExports, source: newSource } = transformExports(newSource));
	({ mixedImports, source: newSource } = transformImports(newSource));

	newSource = `'use strict';\n\n${newSource}`;

	if (!silent && mixedExports) {
		// eslint-disable-next-line no-console
		console.error('WARNING: Using mixed (default and named) exports. This should be avoided because it makes default import unintuitive ("default" name is used).');
	}
	if (!silent && mixedImports) {
		// eslint-disable-next-line no-console
		console.error('WARNING: Using mixed (default and named) imports. If possible, module should be corrected not to export default and named members at the same time.');
	}

	return newSource;
}


module.exports = {
	transformESMIntoCJS,
};
