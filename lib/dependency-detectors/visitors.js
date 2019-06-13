const estraverse = require('estraverse');

function methodDefinitionVisitor(ast, visit) {
	return estraverse.traverse(ast, {
		enter: (node, parent) => {
			if (node.type === 'MethodDefinition') {
				visit(node, parent);
			}
		}
	});
}

function expressionStatementVisitor(root, visit) {
	estraverse.traverse(root, {
		enter: (node, parent) => {
			if (node.type === 'ExpressionStatement') {
				visit(node, parent);
			}
		}
	});
}

function commentVisitor(containingNode, visit) {
	const commentNodes = containingNode.leadingComments || [];
	commentNodes.forEach((commentNode) => {
		visit(commentNode);
	});
}

function constructorVisitor(ast, visit) {
	methodDefinitionVisitor(ast, (node, parent) => {
		if (node.kind === 'constructor') {
			visit(node, parent);
		}
	});
}

module.exports = {
	methodDefinitionVisitor,
	commentVisitor,
	constructorVisitor,
	expressionStatementVisitor
};
