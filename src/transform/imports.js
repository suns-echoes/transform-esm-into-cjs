function findImports(source) {
	const matchIdentifierPart = '[a-zA-Z_$][\\w$]*';
	const matchModuleAliasPart = `\\*\\s+as\\s+${matchIdentifierPart}`;
	const matchAliasPart = `(?:\\s+as\\s+${matchIdentifierPart})?`;
	const matchAliasedPart = `\\s*${matchIdentifierPart}${matchAliasPart}`;
	const matchFilepathPart = '[\'"][^\'"\\n]+[\'"]';
	const matchImport = new RegExp(
		'^[ \t]*import\\s*' +
		`(?:${matchFilepathPart}(\\s*;)?|` +
		`(?:${matchIdentifierPart}|` +
		`(?:${matchIdentifierPart}\\s*,\\s*)?${matchModuleAliasPart}|` +
		`(?:${matchIdentifierPart}\\s*,\\s*)?(?:${matchIdentifierPart}\\s*,\\s*)?` +
		'\\{' +
		`${matchAliasedPart}(?:\\s*,${matchAliasedPart})*(\\s*,\\s*${matchAliasedPart}(?:\\s*,${matchAliasedPart})*\\s*,?)*` +
		`\\s*\\})\\s*from\\s*${matchFilepathPart}(\\s*;)?)`, 'gm');

	const matchDefaultImport = /import\s*([a-zA-Z_$][\w$]*)/;
	const matchModuleAlias = new RegExp(`\\*\\s+as\\s+(${matchIdentifierPart})`);
	const matchNamedEntities = /[a-zA-Z_$][\w$]*(\s+as\s+[a-zA-Z_$][\w$]*)?/g;
	const matchFilepath = '[\'"]([^\'"\\n]+)[\'"]';

	let matches = [];
	let match;

	while ((match = matchImport.exec(source)) !== null) {
		const { 0: statement, index } = match;
		const defName = statement.match(matchDefaultImport);
		const filepath = statement.match(matchFilepath)[1];
		const namedEntities = statement.substring(statement.indexOf('{'), statement.indexOf('}')).match(matchNamedEntities);
		let moduleAlias = statement.match(matchModuleAlias);
		let named = null;

		if (moduleAlias) {
			moduleAlias = moduleAlias[1];
		}

		if (namedEntities) {
			named = namedEntities.map((entity) => {
				const [name, alias = null] = entity.split(/\s+as\s+/);

				return {
					name,
					alias,
				};
			});
		}

		matches.push({
			statement,
			members: {
				default: defName ? defName[1] : null,
				moduleAlias,
				named,
			},
			filepath,
			index,
		});
	}

	return matches;
}

function checkForExplicitDefaultImports(imports) {
	const modulesByPath = {};

	imports.forEach(({ members: { default: defName, moduleAlias, named }, filepath }) => {
		if (modulesByPath[filepath]) {
			const mod = modulesByPath[filepath];

			mod.moduleAlias = (mod.moduleAlias || moduleAlias);
			mod.named = (mod.named || named);
		}
		else {
			modulesByPath[filepath] = {
				defName,
				moduleAlias,
				named,
			};
		}
	});

	Object.keys(modulesByPath).forEach((key) => {
		const mod = modulesByPath[key];

		modulesByPath[key] = (!!mod.defName && (!!mod.moduleAlias || !!mod.named));
	});

	return modulesByPath;
}

function transformImports(source) {
	const imports = findImports(source);
	const explicitDefaultImportsByPath = checkForExplicitDefaultImports(imports);
	let newSource = '';
	let position = 0;
	let mixedImports = false;

	imports.forEach(({ statement, members, filepath, index }) => {
		const { default: defName, moduleAlias, named } = members;
		let requireStatement = '';

		if (!defName && !moduleAlias && !named) {
			requireStatement = `require('${filepath}');`;
		}
		else {
			if (defName) {
				requireStatement += `const ${defName} = require('${filepath}')`;

				if (explicitDefaultImportsByPath[filepath]) {
					requireStatement += '.default';
					mixedImports = true;

					if (named) {
						requireStatement += ';\n';
					}
					else if (moduleAlias) {
						requireStatement += ';\n';
					}
					else {
						requireStatement += ';';
					}
				}
				else {
					requireStatement += ';';
				}
			}

			if (moduleAlias) {
				requireStatement += `const ${moduleAlias} = require('${filepath}');`;
			}

			if (named) {
				let namedMembers = '';

				named.forEach(({ name, alias }) => {
					namedMembers += `, ${name}`;

					if (alias) {
						namedMembers += `: ${alias}`;
					}
				});

				requireStatement += `const { ${namedMembers.substr(2)} } = require('${filepath}');`;
			}
		}

		newSource += source.substring(position, index) + requireStatement;
		position = index + statement.length;
	});

	const sourceRest = source.substr(position).trimRight();

	newSource = `${newSource.trim()}${sourceRest !== '' ? sourceRest : ''}\n`;

	return {
		mixedImports,
		source: newSource,
	};
}


module.exports = {
	transformImports,
};
