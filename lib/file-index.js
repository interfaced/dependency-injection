const FileRecord = require('./file-record');


/**
 */
class FileIndex {
	/**
	 */
	constructor() {
		/**
		 * @type {Object<FileRecord>}
		 * @protected
		 */
		this._pathIndex = {};

		/**
		 * @type {Object<FileRecord>}
		 * @protected
		 */
		this._classIndex = {};
	}

	/**
	 * @param {string} source
	 * @return {FileRecord}
	 */
	addSource(source) {
		const record = new FileRecord(source);

		this._pathIndex[source] = record;
		this._classIndex[record.getClass()] = record;

		return record;
	}

	/**
	 * @param {Array<string>} sourceArray
	 * @return {Array<FileRecord>}
	 */
	addSourceArray(sourceArray) {
		return sourceArray.map((source) => this.addSource(source));
	}

	/**
	 * @param {string} path
	 * @return {FileRecord|undefined}
	 */
	getByPath(path) {
		return this._pathIndex[path];
	}

	/**
	 * @param {string} className
	 * @return {FileRecord}
	 */
	getByClass(className) {
		return this._classIndex[className];
	}

	/**
	 * @return {Array<FileRecord>}
	 */
	getAll() {
		return Object.keys(this._pathIndex).map((key) => this.getByPath(key));
	}
}


module.exports = FileIndex;
