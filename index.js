const path = require('path');
const Builder = require('./lib/builder');
const FileIndex = require('./lib/file-index');
const ImportType = require('./lib/datatype/import-type');

const {AbstractExtension} = require('zombiebox');


/**
 */
class Extension extends AbstractExtension {
	/**
	 * @override
	 */
	getName() {
		return 'dependency-injection';
	}

	/**
	 * @override
	 */
	getSourcesDir() {
		return path.join(__dirname, 'lib');
	}

	/**
	 * @override
	 */
	getConfig() {
		return {
			templates: [
				path.resolve(__dirname, 'templates')
			]
		};
	}

	/**
	 * @override
	 */
	generateCode(config) {
		const fsSource = this._codeSource.fs;
		const fileIndex = new FileIndex();
		const builder = new Builder(this._templateHelper, config);
		fileIndex.addSourceArray(fsSource.getJSFiles());

		return {
			'base-service-container.js': builder.build(fileIndex)
		};
	}
}


module.exports = Extension;


module.exports.types = {ImportType};
