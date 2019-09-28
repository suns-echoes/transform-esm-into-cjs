import { transformExports } from './exports';


describe('transformExports', () => {
	it('returns transformed source code (default)', () => {
		const code = 'export default 42;';
		const expectedCode = 'module.exports = 42;\n';

		const transformedCode = transformExports(code).source;

		expect(transformedCode).to.be.equal(expectedCode);
	});

	it('returns transformed source code (default named function)', () => {
		const code = 'export default function x() {};';
		const expectedCode = 'function x() {};\n\nmodule.exports = x;\n';

		const transformedCode = transformExports(code).source;

		expect(transformedCode).to.be.equal(expectedCode);
	});

	it('returns transformed source code (default function)', () => {
		const code = 'export default function () {};';
		const expectedCode = 'module.exports = function () {};\n';

		const transformedCode = transformExports(code).source;

		expect(transformedCode).to.be.equal(expectedCode);
	});

	it('returns transformed source code (default class)', () => {
		const code = 'export default class {};';
		const expectedCode = 'module.exports = class {};\n';

		const transformedCode = transformExports(code).source;

		expect(transformedCode).to.be.equal(expectedCode);
	});

	it('returns transformed source code (default variable)', () => {
		const code = 'export default x;';
		const expectedCode = 'module.exports = x;\n';

		const transformedCode = transformExports(code).source;

		expect(transformedCode).to.be.equal(expectedCode);
	});

	it('returns transformed source code (variable)', () => {
		const code = 'export function log(m) { console.log(m) };';
		const expectedCode = (
			'function log(m) { console.log(m) };\n\n' +
			'module.exports.log = log;\n'
		);

		const transformedCode = transformExports(code).source;

		expect(transformedCode).to.be.equal(expectedCode);
	});

	it('returns transformed source code (named)', () => {
		const code = 'export { ent1, ent2 };';
		const expectedCode = (
			'module.exports.ent1 = ent1;\n' +
			'module.exports.ent2 = ent2;\n'
		);

		const transformedCode = transformExports(code).source;

		expect(transformedCode).to.be.equal(expectedCode);
	});

	it('returns transformed source code (named alias)', () => {
		const code = 'export { ent as mbr };';
		const expectedCode = 'module.exports.mbr = ent;\n';

		const transformedCode = transformExports(code).source;

		expect(transformedCode).to.be.equal(expectedCode);
	});

	it('returns transformed source code (duplicated names)', () => {
		const code = 'export { ent };\nexport const ent = 10;';
		const expectedCode = (
			'const ent = 10;\n\n' +
			'module.exports.ent = ent;\n' +
			'module.exports.ent = ent;\n'
		);

		const transformedCode = transformExports(code).source;

		expect(transformedCode).to.be.equal(expectedCode);
	});
});
