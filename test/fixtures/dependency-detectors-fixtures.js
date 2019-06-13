var path = require('path');
var fs = require('fs');

module.exports = {
	exportDefaultConstructor: {
		source: fs.readFileSync(path.join(__dirname, 'dependency-detectors/constructor-parameters-source.js'), 'utf8'),
		classID: 'MovieController',
		result: {
			deps: require('./dependency-detectors/module-constructor-parameters-deps.json')
		}
	},
	exportDefaultProperties: {
		source: fs.readFileSync(path.join(__dirname, 'dependency-detectors/properties-source.js'), 'utf8'),
		classID: 'MovieController',
		result: {
			deps: require('./dependency-detectors/module-properties-deps.json')
		}
	},
	exportDefaultSetters: {
		source: fs.readFileSync(path.join(__dirname, 'dependency-detectors/setters-source.js'), 'utf8'),
		classID: 'MovieController',
		result: {
			deps: require('./dependency-detectors/module-setters-deps.json')
		}
	}
};
