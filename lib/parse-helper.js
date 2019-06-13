const doctrine = require('doctrine');
const escodegen = require('escodegen');
const espree = require('espree');

const handle = {
	root: {},
	tag: {},
	node: {},
	jsdoc: {}
};

/**
 * @param {string} source
 * @return {EsprimaAst}
 */
handle.parse = function(source) {
	const opts = {
		attachComment: true, // TODO: This option was removed in 5.0, this should be circumvented and espree udpated
		ecmaVersion: 9,
		sourceType: 'module'
	};

	return espree.parse(source, opts);
};


/**
 * @param {EsprimaNode} root
 * @return {EsprimaNode}
 */
handle.root.getDefaultClassEntry = function(root) {
	const exportDefaultNode = root.body.find(handle.node.isDefaultClassExport);

	return exportDefaultNode && exportDefaultNode.declaration;
};


/**
 * @param {EsprimaNode} root
 * @return {EsprimaNode}
 */
handle.root.getDefaultExport = function(root) {
	return root.body.find(handle.node.isDefaultExport);
};


/**
 * @param {EsprimaNode} node
 * @return {boolean}
 */
handle.node.isStatement = function(node) {
	return node.type === 'ExpressionStatement';
};


/**
 * @param {string} objectID
 * @param {EsprimaNode} node
 * @return {boolean}
 */
handle.node.isPropertyDefinition = function(objectID, node) {
	return (handle.node.isStatement(node) &&
		node.expression.type === 'MemberExpression' &&
		escodegen.generate(node.expression.object) === objectID
	);
};


/**
 * @param {EsprimaNode} node
 * @return {boolean}
 */
handle.node.isMethodDefinition = function(node) {
	return node.type === 'MethodDefinition';
};


/**
 * @param {EsprimaNode} node
 * @return {string}
 */
handle.node.getMethodName = function(node) {
	return node.key.name;
};


/**
 * @param {EsprimaNode} node
 * @return {Array<string>}
 */
handle.node.getMethodParams = function(node) {
	if (!node) {
		return [];
	}

	return node.value.params
		.filter((param) => param.type === 'Identifier')
		.map((param) => param.name);
};


/**
 * @param {EsprimaNode} node
 * @return {boolean}
 */
handle.node.hasComments = function(node) {
	return (node.leadingComments && node.leadingComments.length);
};


/**
 * @param {EsprimaNode} commentNode
 * @return {boolean}
 */
handle.node.isCommentDocblock = function(commentNode) {
	return (commentNode.type === 'Block' && commentNode.value[0] === '*');
};


/**
 * @param {EsprimaNode} node
 * @return {boolean}
 */
handle.node.hasDocBlock = function(node) {
	return handle.node.hasComments(node) &&
		handle.node.isCommentDocblock(node.leadingComments[node.leadingComments.length - 1]);
};


/**
 * @param {EsprimaNode} node
 * @return {string}
 */
handle.node.getDocBlockSource = function(node) {
	if (!handle.node.hasDocBlock(node)) {
		return null;
	}

	const lastComment = node.leadingComments[node.leadingComments.length - 1];

	return '/*' + lastComment.value + '*/';
};


/**
 * @param {EsprimaNode} node
 * @return {string}
 */
handle.node.getPropertyName = function(node) {
	return handle.node.isAssignment(node) ?
		node.expression.left.property.name :
		node.expression.property.name;
};


/**
 * @param {string} classFullName
 * @param {EsprimaNode} node
 * @return {?DependencyRecord}
 */
handle.node.getDependency = function(classFullName, node) {
	if (!handle.node.isPropertyDefinition(classFullName + '.prototype', node)) {
		return null;
	}

	const depName = handle.node.getPropertyName(node);
	if (!depName) {
		return null;
	}

	const depType = handle.jsdoc.getDependencyType(handle.node.getJsdoc(node));
	if (!depType) {
		return null;
	}

	return {
		name: depName,
		type: depType,
		injector: 'property'
	};
};


/**
 * @param {EsprimaNode} node classDeclaration
 * @return {boolean}
 */
handle.node.isSetterDependency = function(node) {
	const isMethod = handle.node.isMethodDefinition(node);
	const dependencyType = handle.jsdoc.getDependencyType(handle.node.getJsdoc(node));
	const params = handle.node.getMethodParams(node);

	return (isMethod && dependencyType !== null && params.length === 1);
};


/**
 * @param {EsprimaNode} node
 * @return {?DependencyRecord}
 */
handle.node.intoDependencyRecord = function(node) {
	const type = handle.jsdoc.getDependencyType(handle.node.getJsdoc(node));
	const name = handle.node.getMethodName(node);

	return {
		name,
		type,
		injector: 'setter'
	};
};


/**
 * @param {EsprimaNode} node
 * @return {JSDoc}
 */
handle.node.getJsdoc = function(node) {
	if (!node || !handle.node.hasDocBlock(node)) {
		return null;
	}

	return doctrine.parse(handle.node.getDocBlockSource(node), {unwrap: true});
};


/**
 * @param {EsprimaNode} node
 * @return {boolean}
 */
handle.node.isAssignment = function(node) {
	return (
		node.type === 'ExpressionStatement' && node.expression &&
		node.expression.type === 'AssignmentExpression' &&
		node.expression.left && node.expression.right
	);
};


/**
 * @param {string} className
 * @param {EsprimaNode} node
 * @return {boolean}
 */
handle.node.isConstructor = function(className, node) {
	return (
		handle.node.isAssignment(node) &&
		node.expression.right.type === 'FunctionExpression' &&
		escodegen.generate(node.expression.left) === className &&
		handle.jsdoc.isConstructor(handle.node.getJsdoc(node))
	);
};


// TODO: isClassEntry


/**
 * @param {EsprimaNode} node
 * @return {boolean}
 */
handle.node.isClassAssignment = function(node) {
	return (
		handle.node.isAssignment(node) &&
		node.expression.right.type === 'ClassExpression'
	);
};


/**
 * @param {string} className
 * @param {EsprimaNode} node
 * @return {boolean}
 */
handle.node.isClassAssignmentFor = function(className, node) {
	return (
		handle.node.isClassAssignment(node) &&
		escodegen.generate(node.expression.left) === className
	);
};


/**
 * @param {EsprimaNode} node
 * @return {boolean}
 */
handle.node.isDefaultClassExport = function(node) {
	return (
		node.type === 'ExportDefaultDeclaration' &&
		node.declaration.type === 'ClassDeclaration'
	);
};


/**
 * @param {EsprimaNode} node
 * @return {boolean}
 */
handle.node.isDefaultExport = function(node) {
	return node.type === 'ExportDefaultDeclaration';
};


/**
 * @param {EsprimaNode} node -- Class entry (assignment or definition)
 * @return {?EsprimaNode} -- Null if not found
 */
handle.node.getClassNode = function(node) {
	if (handle.node.isClassAssignment(node)) {
		return node.expression.right;
	}

	if (node.type === 'ClassDeclaration') {
		return node;
	}

	return null;
};


/**
 * @param {EsprimaNode} node -- Class entry (assignment or definition)
 * @return {?EsprimaNode} -- Null if not found
 */
handle.node.getClassConstructor = function(node) {
	if (!node) {
		return null;
	}

	const body = node.body || {};
	const children = body.body || [];

	return children.find((child) => (
		child.type === 'MethodDefinition' &&
		child.key &&
		child.key.type === 'Identifier' &&
		child.key.name === 'constructor'
	)) || null;
};


/**
 * @param {EsprimaNode} expression
 * @return {boolean}
 */
handle.node.isExpressionProperty = function(expression) {
	try {
		return (
			expression.type === 'MemberExpression' &&
			expression.object.type === 'ThisExpression' &&
			expression.property.type === 'Identifier'
		);
	} catch (e) {
		return false;
	}
};


/**
 * @param {EsprimaNode} node
 * @return {boolean}
 */
handle.node.isPropertyStatement = function(node) {
	return (
		node.type === 'ExpressionStatement' &&
		handle.node.isExpressionProperty(node.expression)
	);
};


/**
 * @param {EsprimaNode} node
 * @return {boolean}
 */
handle.node.isPropertyAssignment = function(node) {
	return (
		handle.node.isAssignment(node) &&
		handle.node.isExpressionProperty(node.expression.left)
	);
};


/**
 * @param {EsprimaNode} node
 * @return {boolean}
 */
handle.node.isProperty = function(node) {
	return handle.node.isPropertyStatement(node) || handle.node.isPropertyAssignment(node);
};


/**
 * @param {JSDoc} jsdoc
 * @return {?string}
 */
handle.jsdoc.getDependencyType = function(jsdoc) {
	if (!jsdoc) {
		return null;
	}

	return jsdoc.tags
		.map(handle.tag.getDependencyType)
		.filter(Boolean)
		.pop() || null;
};


/**
 * @param {JSDoc} jsdoc
 * @return {Object<string>}
 */
handle.jsdoc.getParamDependencies = function(jsdoc) {
	if (!jsdoc) {
		return {};
	}

	const depTags = jsdoc.tags.filter(handle.tag.isTagParamDependency);

	const result = {};
	depTags.forEach((tag) => {
		result[tag.name] = tag.type.name;
	});

	return result;
};


/**
 * @param {JSDoc} jsdoc
 * @return {boolean}
 */
handle.jsdoc.isConstructor = function(jsdoc) {
	if (!jsdoc) {
		return false;
	}

	return (jsdoc.tags.filter(handle.tag.isConstructor).length > 0);
};


/**
 * @param {JSDoc} jsdoc
 * @return {Array<string>}
 */
handle.jsdoc.getImplementedInterfaces = function(jsdoc) {
	if (!jsdoc) {
		return [];
	}

	return jsdoc.tags.map(handle.tag.getInterface).filter(Boolean);
};


/**
 * @param {JSDoc} jsdoc
 * @return {Array<string>}
 */
handle.jsdoc.getExtendedClass = function(jsdoc) {
	if (!jsdoc) {
		return [];
	}

	return jsdoc.tags.map(handle.tag.getExtends).filter(Boolean);
};


/**
 * Property dependency
 * @param {DoctrineTag} tag
 * @return {boolean}
 */
handle.tag.isTagDependency = function(tag) {
	return tag.title === 'type' && handle.tag.isTagInject(tag);
};


/**
 * @param {DoctrineTag} tag
 * @return {boolean}
 */
handle.tag.isTagInject = function(tag) {
	return tag.description && tag.description.startsWith(':inject');
};


/**
 * @param {DoctrineTag} tag
 * @return {boolean}
 */
handle.tag.isTagWithNamedType = function(tag) {
	return tag.type && tag.type.type === 'NameExpression';
};


/**
 * Param dependency
 * @param {DoctrineTag} tag
 * @return {boolean}
 */
handle.tag.isTagParamDependency = function(tag) {
	return tag.title === 'param' && handle.tag.isTagInject(tag);
};


/**
 * Param dependency
 * @param {DoctrineTag} tag
 * @return {boolean}
 */
handle.tag.isTagParam = function(tag) {
	return tag.title === 'param';
};


/**
 * @param {DoctrineTag} tag
 * @return {?string}
 */
handle.tag.getDependencyType = function(tag) {
	if (handle.tag.isTagDependency(tag) || handle.tag.isTagParamDependency(tag)) {
		return tag.type.name;
	}

	return null;
};


/**
 * @param {DoctrineTag} tag
 * @return {boolean}
 */
handle.tag.isConstructor = function(tag) {
	return tag.title === 'constructor';
};


/**
 * @param {DoctrineTag} tag
 * @return {boolean}
 */
handle.tag.isImplements = function(tag) {
	return Boolean(tag.title === 'implements' &&
		tag.type && tag.type.type === 'NameExpression' &&
		tag.type.name
	);
};


/**
 * @param {DoctrineTag} tag
 * @return {?string}
 */
handle.tag.getInterface = function(tag) {
	return handle.tag.isImplements(tag) ? tag.type.name : null;
};


/**
 * @param {DoctrineTag} tag
 * @return {boolean}
 */
handle.tag.isExtends = function(tag) {
	return Boolean(tag.title === 'extends' &&
		tag.type && tag.type.type === 'NameExpression' &&
		tag.type.name
	);
};


/**
 * @param {DoctrineTag} tag
 * @return {?string}
 */
handle.tag.getExtends = function(tag) {
	return handle.tag.isExtends(tag) ? tag.type.name : null;
};


/**
 * @typedef {{
 *     title: string,
 *     type: string,
 *     description: string
 * }}
 */
let DoctrineTag;


/**
 * @typedef {Object}
 */
let EsprimaNode;


/**
 * @typedef {{
 *     tags: Array<DoctrineTag>
 * }}
 */
let JSDoc;

module.exports = handle;
