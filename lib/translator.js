const morph = require('morph');
const InjectorType = require('./datatype/injector-type');


module.exports.dependencyRecord = {
	/**
	 * @param {DependencyRecord} dependencyRecord
	 * @return {ServiceParameterRecord}
	 */
	toParameterRecord: function(dependencyRecord) {
		const dependencyName = dependencyRecord.name;

		const injectorType = dependencyRecord.injector;
		let injectorData = {};

		const parameterClass = dependencyRecord.type;
		let parameterName = '';

		// setter method name must be equal to ('set' + $dependency-parameter-name)
		// example: @param {IMovieRepository} [repositoryMovie] :inject
		// methodName = setRepositoryMovie
		if (injectorType === InjectorType.SETTER) {
			parameterName = dependencyName;
			injectorData = {
				methodName: `set${morph.toCamel(dependencyName)}`
			};
		} else if (injectorType === InjectorType.PROPERTY) {
			parameterName = dependencyName;
			injectorData = {
				propertyName: dependencyName
			};
		} else if (injectorType === InjectorType.CONSTRUCTOR) {
			parameterName = dependencyName;
			injectorData = {
				index: dependencyRecord.index
			};
		}

		return {
			parameterName,
			parameterClass,
			injectorType,
			injectorData
		};
	}
};


/**
 * Index used for constructor deps argument order
 * @typedef {{
 *     name: string,
 *     type: string,
 *     injector: string,
 *     index: (number|undefined)
 * }}
 */
let DependencyRecord;
