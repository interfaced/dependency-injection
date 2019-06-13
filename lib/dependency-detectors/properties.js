const doctrine = require('doctrine');
const helper = require('./../parse-helper');
const {PROPERTY} = require('../datatype/injector-type');
const {constructorVisitor, commentVisitor, expressionStatementVisitor} = require('./visitors');
const {isTagDependency, isTagWithNamedType} = helper.tag;

function propertyExpressionVisitor(root, visit) {
	expressionStatementVisitor(root, (node, parent) => {
		const expr = node.expression;

		function visitMemberExpression(expr) {
			const object = expr.object;
			const property = expr.property;
			if (object.type === 'ThisExpression' && property.type === 'Identifier') {
				visit(node, parent, property);
			}
		}

		if (expr.type === 'MemberExpression') {
			visitMemberExpression(expr);
		}

		if (expr.type === 'AssignmentExpression') {
			const left = expr.left;

			if (left.type === 'MemberExpression') {
				visitMemberExpression(left);
			}
		}
	});
}

function propertyCommentVisitor(ast, visit) {
	constructorVisitor(ast, (node) => {
		propertyExpressionVisitor(node, (node, _, propertyNode) => {
			commentVisitor(node, (commentNode) => visit(commentNode, propertyNode));
		});
	});
}

/**
 * @param {string} source :: file contents
 * @return {Array<DependencyRecord>}
 */
function detectDependencies(source) {
	const ast = helper.parse(source);
	const dependencies = [];

	propertyCommentVisitor(ast, (commentNode, propertyNode) => {
		const commentAst = doctrine.parse(commentNode.value, {unwrap: true});
		const injectTags = commentAst.tags.filter((tag) => isTagDependency(tag) && isTagWithNamedType(tag));

		injectTags.forEach((tag) => {
			dependencies.push({
				name: propertyNode.name,
				type: tag.type.name,
				injector: PROPERTY
			});
		});
	});

	return dependencies;
}

module.exports = detectDependencies;
