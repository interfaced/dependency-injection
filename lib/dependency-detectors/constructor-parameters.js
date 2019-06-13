const doctrine = require('doctrine');
const helper = require('./../parse-helper');
const {CONSTRUCTOR} = require('../datatype/injector-type');
const {constructorVisitor, commentVisitor} = require('./visitors');
const {isTagInject, isTagParam, isTagWithNamedType} = helper.tag;

function constructorCommentVisitor(ast, visit) {
	constructorVisitor(ast, (node) => commentVisitor(node, visit));
}

/**
 * @param {string} source :: file contents
 * @return {Array<DependencyRecord>}
 */
function detectDependencies(source) {
	const ast = helper.parse(source);
	const dependencies = [];

	constructorCommentVisitor(ast, (commentNode) => {
		const commentAst = doctrine.parse(commentNode.value, {unwrap: true});
		// Save order for index reference
		const parameterTags = commentAst.tags.filter(isTagParam);

		parameterTags.forEach((tag, index) => {
			if (isTagInject(tag) && isTagWithNamedType(tag)) {
				dependencies.push({
					name: tag.name,
					type: tag.type.name,
					injector: CONSTRUCTOR,
					index
				});
			}
		});
	});

	return dependencies;
}

module.exports = detectDependencies;
