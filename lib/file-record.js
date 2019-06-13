const fs = require('fs');
const path = require('path');
const morph = require('morph');

const helper = require('./parse-helper');
const getDependenciesForFile = require('./dependency-detectors/detector-aggregator');
const detectors = [
	require('./dependency-detectors/constructor-parameters'),
	require('./dependency-detectors/properties'),
	require('./dependency-detectors/setters')
];


/**
 */
class FileRecord {
	/**
	 * @param {string} path
	 */
	constructor(path) {
		/**
		 * @type {string|undefined}
		 * @protected
		 */
		this._path = path;

		/**
		 * @type {string|undefined}
		 * @protected
		 */
		this._source = undefined;

		/**
		 * @type {string|undefined}
		 * @protected
		 */
		this._class = undefined;

		/**
		 * @type {EsprimaAst|undefined}
		 * @protected
		 */
		this._ast = undefined;

		/**
		 * @type {Array<string>|undefined}
		 * @protected
		 */
		this._extends = undefined;

		/**
		 * @type {Array<string>|undefined}
		 * @protected
		 */
		this._implements = undefined;

		/**
		 * @type {Array<ServiceParameterRecord>|undefined}
		 * @protected
		 */
		this._parameters = undefined;
	}

	/**
	 * @return {string}
	 */
	getPath() {
		return this._path;
	}

	/**
	 * @return {string}
	 */
	getSource() {
		if (this._source === undefined) {
			this._source = this._fetchSource(this._path);
		}

		return this._source;
	}

	/**
	 * @return {EsprimaAst}
	 */
	getAst() {
		if (this._ast === undefined) {
			this._ast = this._fetchAst(this.getSource());
		}

		return this._ast;
	}

	/**
	 * @return {string}
	 */
	getClass() {
		if (this._class === undefined) {
			this._class = this._fetchClass();
		}

		return this._class;
	}

	/**
	 * @return {Array<string>}
	 */
	getExtendsAndImplements() {
		if (this._extends === undefined) {
			this._extends = this._fetchExtends(this.getClass(), this.getAst());
		}

		if (this._implements === undefined) {
			this._implements = this._fetchImplements(this.getClass(), this.getAst());
		}

		return this._extends.concat(this._implements);
	}

	/**
	 * @return {Array<ServiceParameterRecord>}
	 */
	getParameters() {
		if (this._parameters === undefined) {
			this._parameters = this._fetchParameters();
		}

		return this._parameters;
	}

	/**
	 * @param {string} path
	 * @return {string}
	 * @protected
	 */
	_fetchSource(path) {
		return fs.readFileSync(path, 'utf-8');
	}

	/**
	 * @param {string} source
	 * @return {EsprimaAst}
	 * @protected
	 */
	_fetchAst(source) {
		try {
			return helper.parse(source);
		} catch (e) {
			throw new Error(`Parsing failed: ${this.getPath()}\n${e.message}`);
		}
	}

	/**
	 * @return {string}
	 * @protected
	 */
	_fetchClass() {
		const meta = path.parse(this.getPath());

		return morph.toUpperCamel(meta.name);
	}

	/**
	 * @param {string} className
	 * @param {EsprimaAst} parsed
	 * @return {Array<string>}
	 * @protected
	 */
	_fetchExtends(className, parsed) {
		const classDeclaration = helper.root.getDefaultClassEntry(parsed);

		if (!classDeclaration) {
			return [];
		}

		if (!classDeclaration.superClass) {
			return [];
		}

		return [classDeclaration.superClass.name];
	}

	/**
	 * @param {string} className
	 * @param {EsprimaAst} parsed
	 * @return {Array<string>}
	 * @protected
	 */
	_fetchImplements(className, parsed) {
		const exportDeclaration = helper.root.getDefaultExport(parsed);

		if (!exportDeclaration) {
			return [];
		}

		return helper.jsdoc.getImplementedInterfaces(helper.node.getJsdoc(exportDeclaration));
	}

	/**
	 * @return {Array<ServiceParameterRecord>}
	 * @protected
	 */
	_fetchParameters() {
		return getDependenciesForFile(detectors, this);
	}
}


/**
 * @type {(function(new: FileRecord, string))}
 */
module.exports = FileRecord;
