const path = require('path');
const morph = require('morph');
const defaultScheme = require('./default-scheme');
const tokenAbstractClass = 'abstract-';

function defaultMatch(fileRecord, configRecord) {
	const filePath = fileRecord.getPath();
	const meta = path.parse(filePath);

	// dirty check by filename
	const isAbstractClass = (meta.name.startsWith(tokenAbstractClass));
	const isJsExtension = meta.ext === '.js';

	const isTargetContainingDirectory = (meta.dir === configRecord.directory);
	// example: [scenes]/movie-card/movie-card.js :: scenes
	const isInGroupDirectory = (path.dirname(meta.dir) === configRecord.directory);
	// example: scenes/[movie-card]/movie-card.js :: movie-card
	const isDirectoryHasSameName = (path.basename(meta.dir) === meta.name);
	const isInCorrectFolder = (isTargetContainingDirectory || (isInGroupDirectory && isDirectoryHasSameName));

	return (isJsExtension && isInCorrectFolder && !isAbstractClass);
}

/**
 * @param {string} appDir
 * @param {Helper.FullConfigRecord} configRecord
 * @return {function(FileRecord): ?SchemeEntry}
 */
module.exports.createByConfigRecord = function(appDir, configRecord) {
	return (fileRecord) => {
		const className = fileRecord.getClass();

		if (defaultMatch(fileRecord, configRecord)) {
			const group = configRecord.group;

			let serviceName = group + className;

			if (serviceName.endsWith(morph.toUpperCamel(group))) {
				serviceName = serviceName.substr(0, serviceName.length - group.length);
			}

			const scheme = defaultScheme(appDir, fileRecord);
			scheme._group = group;

			return {[serviceName]: scheme};
		}

		return null;
	};
};
