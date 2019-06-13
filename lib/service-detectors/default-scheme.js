const path = require('path');
const {DEFAULT} = require('../datatype/import-type');

/**
 * @param {string} appDir
 * @param {FileRecord} fileRecord
 * @return {SchemeEntry}
 */
function createDefaultScheme(appDir, fileRecord) {
	// redefine scheme structure for support imports/modules
	const scheme = {
		_class: fileRecord.getClass(),
		_path: path.relative(appDir, fileRecord.getPath()),
		_import: DEFAULT
	};

	fileRecord.getParameters().forEach(({parameterName, parameterClass}) => {
		scheme[parameterName] = `{${parameterClass}}`;
	});

	return scheme;
}

module.exports = createDefaultScheme;
