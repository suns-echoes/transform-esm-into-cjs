function getDefaultFunctionName(statement) {
	const matchDefaultFunctionName = statement.match(/^export\s+default\s+(?:class|function(?:\s*\*)?)\s+([a-zA-Z_$][\w$]*)/);

	return matchDefaultFunctionName && matchDefaultFunctionName[1] || null;
}

function getNamedVariableName(statement) {
	const matchNamedVariableName = statement.match(/^export\s+(?:const|let|var|class|function(?:\s*\*)?)\s+([a-zA-Z_$][\w$]*)/);

	return matchNamedVariableName[1];
}

function getNamedMembers(statement) {
	const matchNamedMembers = statement.substring(statement.indexOf('{'), statement.indexOf('}')).match(/[a-zA-Z_$][\w$]*(?:\s+as\s+[a-zA-Z_$][\w$]*)?/g);

	return matchNamedMembers.map((member) => {
		const [name, alias = ''] = member.split(/\s+as\s+/);

		return { name, alias };
	});
}

function findExports(source) {
	const matchIdentifierPart = '[a-zA-Z_$][\\w$]*';
	const matchAliasPart = `(?:\\s+as\\s+${matchIdentifierPart}\\s*)?`;
	const matchAliasedPart = `${matchIdentifierPart}${matchAliasPart}`;
	const matchExports = new RegExp(`^export\\s*(?:\\{\\s*${matchAliasedPart}(?:,\\s*${matchAliasedPart})*,?\\s*\\}\\s*(?:;\\s*\\n?)?|(?:default\\s+)?(?:(?:(?:const|let|var|class|function(?:\\s*\\*)?)\\s+)?${matchIdentifierPart}|[[{(\`'"0-9]))`, 'gm');

	let matches = [];
	let match;

	while ((match = matchExports.exec(source)) !== null) {
		const { 0: statement, index } = match;
		const isDefaultObject = /^export\s+default\s+[[{(`'"0-9]/.test(statement);
		const isDefaultFunction = /^export\s+default\s+(?:class|function(?:\s*\*)?)\b/.test(statement);
		const isDefaultValue = (!isDefaultFunction && /^export\s+default\s+[a-zA-Z_$][\\w$]*/.test(statement));

		if (isDefaultObject || isDefaultFunction || isDefaultValue) {
			matches.push({
				statement,
				members: {
					hasDefault: true,
					defaultName: (isDefaultFunction ? getDefaultFunctionName(statement) : null),
					defaultObject: isDefaultObject,
					defaultValue: isDefaultValue,
					named: null,
				},
				index,
			});
		}
		else {
			const isNamedVarialbe = /^export\s+(?:const|let|var|class|function(?:\s*\*)?)\s+(?:[a-zA-Z_$][\w$]*)\b/.test(statement);
			let named = [];

			if (isNamedVarialbe) {
				named.push({
					name: getNamedVariableName(statement),
					alias: '',
					variable: true,
				});
			}
			else {
				const namedMembers = getNamedMembers(statement);

				namedMembers.forEach(({ name, alias }) => {
					named.push({
						name,
						alias,
						variable: false,
					});
				});
			}

			matches.push({
				statement,
				members: {
					defaultName: null,
					defaultObject: false,
					defaultValue: false,
					named,
				},
				index,
			});
		}
	}

	return matches;
}

function shouldUseExplicitDefault(exports) {
	let hasDefaultMember = false;
	let hasNamedMember = false;

	return exports.some(({ members }) => {
		hasDefaultMember = (hasDefaultMember || members.hasDefault);
		hasNamedMember = (hasNamedMember || members.named);

		return (hasDefaultMember && !!hasNamedMember);
	});
}

function transformExports(source) {
	const exports = findExports(source);
	const useExplicitDefault = shouldUseExplicitDefault(exports);
	let exportedDefaultMember = '';
	let exportedNamedMembers = '';
	let newSource = '';
	let position = 0;

	exports.forEach(({ statement, members, index }) => {
		const { defaultName, defaultObject, defaultValue, named } = members;
		let exportsStatement = '';

		if (defaultName) {
			exportsStatement = statement.replace(/^export\s+default\s+/, '');
			exportedDefaultMember = `module.exports${useExplicitDefault ? '.default' : ''} = ${defaultName};`;
		}
		else if (defaultObject || defaultValue) {
			exportsStatement = statement.replace(/^export\s+default\s+/, `module.exports${useExplicitDefault ? '.default' : ''} = `);
		}
		else if (named) {
			named.forEach(({ name, alias, variable }) => {
				if (variable) {
					exportsStatement = statement.replace(/^export\s+/, '');

					exportedNamedMembers += `module.exports.${name} = ${name};\n`;
				}
				else {
					exportedNamedMembers += `module.exports.${alias || name} = ${name};\n`;
				}
			});
		}
		else {
			exportsStatement = `module.exports${useExplicitDefault ? '.default' : ''} = `;
			exportsStatement += statement.replace(/^export\s+default\s+/, '');
		}

		newSource += source.substring(position, index) + exportsStatement;
		position = index + statement.length;
	});

	newSource += source.substr(position);

	newSource = (
		(newSource.trimRight() !== '' ? `${newSource.trimRight()}\n${
			(exportedDefaultMember !== '' || exportedNamedMembers !== '' ? '\n' : '')
		}` : '') +
		`${exportedDefaultMember.trimRight()}${exportedDefaultMember !== '' ? '\n' : ''}` +
		`${exportedNamedMembers.trimRight()}${exportedNamedMembers !== '' ? '\n' : ''}`
	);

	return {
		mixedExports: useExplicitDefault,
		source: newSource,
	};
}


module.exports = {
	transformExports,
};
