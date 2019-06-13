const ConfigHelper = require('./service-detectors/folder-config-helper');
const {createByConfigRecord} = require('./service-detectors/zombiebox-folder-structure');


/**
 * @param {string} appDir
 * @param {Array<Helper.GenericConfigRecord>} foldersConfig
 * @param {FileIndex} fileIndex
 * @return {Scheme}
 */
module.exports = function(appDir, foldersConfig, fileIndex) {
	const configHelper = new ConfigHelper(appDir);
	const serviceDetectors = configHelper
		.processConfig(foldersConfig)
		.map((config) => createByConfigRecord(appDir, config));

	function detectSchemeFromFile(fileRecord) {
		let scheme = null;
		for (const detector of serviceDetectors) {
			scheme = detector(fileRecord);
			if (scheme) {
				return scheme;
			}
		}

		return scheme;
	}

	return fileIndex
		.getAll()
		.map(detectSchemeFromFile)
		.filter(Boolean)
		.reduce((acc, curr) => Object.assign(acc, curr));
};
