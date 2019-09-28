import { transformImports } from './imports';


describe('transformImports', () => {
	it('returns transformed source code (default)', () => {
		const code = 'import def from \'mod\';';
		const expectedCode = 'const def = require(\'mod\');\n';

		const transformedCode = transformImports(code).source;

		expect(transformedCode).to.be.equal(expectedCode);
	});

	it('returns transformed source code (module alias)', () => {
		const code = 'import * as mod from \'mod\';';
		const expectedCode = 'const mod = require(\'mod\');\n';

		const transformedCode = transformImports(code).source;

		expect(transformedCode).to.be.equal(expectedCode);
	});

	it('returns transformed source code (default and module alias)', () => {
		const code = 'import def, * as mod from \'mod\';';
		const expectedCode = (
			'const def = require(\'mod\').default;\n' +
			'const mod = require(\'mod\');\n'
		);

		const transformedCode = transformImports(code).source;

		expect(transformedCode).to.be.equal(expectedCode);
	});

	it('returns transformed source code (default and named)', () => {
		const code = 'import def, { ent } from \'mod\';';
		const expectedCode = (
			'const def = require(\'mod\').default;\n' +
			'const { ent } = require(\'mod\');\n'
		);

		const transformedCode = transformImports(code).source;

		expect(transformedCode).to.be.equal(expectedCode);
	});

	it('returns transformed source code (named with alias)', () => {
		const code = 'import { ent as mbr } from \'mod\';';
		const expectedCode = 'const { ent: mbr } = require(\'mod\');\n';

		const transformedCode = transformImports(code).source;

		expect(transformedCode).to.be.equal(expectedCode);
	});
});
