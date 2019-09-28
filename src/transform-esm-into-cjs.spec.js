import { transformESMIntoCJS } from './transform-esm-into-cjs';


describe('transformESMIntoCJS', () => {
	it('returns transformed source code (mixed exports - value)', () => {
		const code = 'export function log(m) { console.log(m) };\nexport default 42;';
		const transformedCode = (
			'\'use strict\';\n\n' +
			'function log(m) { console.log(m) };\n' +
			'module.exports.default = 42;\n\n' +
			'module.exports.log = log;\n'
		);

		expect(transformESMIntoCJS(code)).to.be.equal(transformedCode);
	});

	it('returns transformed source code (mixed exports - variable)', () => {
		const code = 'export function log(m) { console.log(m) };\nexport default x;';
		const transformedCode = (
			'\'use strict\';\n\n' +
			'function log(m) { console.log(m) };\n' +
			'module.exports.default = x;\n\n' +
			'module.exports.log = log;\n'
		);

		expect(transformESMIntoCJS(code)).to.be.equal(transformedCode);
	});

	it('returns transformed source code (mixed exports - named function)', () => {
		const code = 'export function log(m) { console.log(m) };\nexport default function x() {};';
		const transformedCode = (
			'\'use strict\';\n\n' +
			'function log(m) { console.log(m) };\n' +
			'function x() {};\n\n' +
			'module.exports.default = x;\n' +
			'module.exports.log = log;\n'
		);

		expect(transformESMIntoCJS(code)).to.be.equal(transformedCode);
	});

	it('returns transformed source code (mixed exports - function)', () => {
		const code = 'export function log(m) { console.log(m) };\nexport default function () {};';
		const transformedCode = (
			'\'use strict\';\n\n' +
			'function log(m) { console.log(m) };\n' +
			'module.exports.default = function () {};\n\n' +
			'module.exports.log = log;\n'
		);

		expect(transformESMIntoCJS(code)).to.be.equal(transformedCode);
	});

	it('returns transformed source code (mixed imports)', () => {
		const code = 'import def from \'mod\';\nimport { ent } from \'mod\';';
		const transformedCode = (
			'\'use strict\';\n\n' +
			'const def = require(\'mod\').default;\n' +
			'const { ent } = require(\'mod\');\n'
		);

		expect(transformESMIntoCJS(code)).to.be.equal(transformedCode);
	});
});
