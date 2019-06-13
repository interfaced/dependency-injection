const doctrine = require('doctrine');
const helper = require('./../parse-helper');
const {SETTER} = require('../datatype/injector-type');
const {methodDefinitionVisitor, commentVisitor} = require('./visitors');
const {isTagParamDependency, isTagWithNamedType} = helper.tag;

function methodCommentVisitor(ast, visit) {
	methodDefinitionVisitor(ast, (node) => {
		if (node.kind !== 'constructor') {
			commentVisitor(node, visit);
		}
	});
}

/**
 * @param {string} source :: file contents
 * @return {Array<DependencyRecord>}
 */
function detectDependencies(source) {
	const ast = helper.parse(source);
	const dependencies = [];

	methodCommentVisitor(ast, (commentNode) => {
		const commentAst = doctrine.parse(commentNode.value, {unwrap: true});
		const parameterTags = commentAst.tags.filter((tag) => isTagParamDependency(tag) && isTagWithNamedType(tag));

		parameterTags.forEach((tag) => {
			dependencies.push({
				name: tag.name,
				type: tag.type.name,
				injector: SETTER
			});
		});
	});

	return dependencies;
}

module.exports = detectDependencies;
