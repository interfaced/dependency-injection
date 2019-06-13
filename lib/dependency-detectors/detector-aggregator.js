const {dependencyRecord} = require('../translator');

/**
 * @param {Array<function(string): DependencyRecord>} detectors
 * @param {FileRecord} file
 * @return {Array<ServiceParameterRecord>}
 */
function getDependenciesForFile(detectors, file) {
	const source = file.getSource();
	return detectors
		.reduce((acc, detector) => acc.concat(detector(source)), [])
		.map(dependencyRecord.toParameterRecord);
}

module.exports = getDependenciesForFile;
