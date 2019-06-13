const transitive = require('./tools/closure-transitive');


/**
 */
class Matcher {
	/**
	 * @param {FileIndex} fileIndex
	 */
	setFileIndex(fileIndex) {
		const extendsList = {};
		fileIndex.getAll().forEach((fileRecord) => {
			extendsList[fileRecord.getClass()] = fileRecord.getExtendsAndImplements();
		});

		const extendedByList = {};
		Object.keys(extendsList).forEach((subClassName) => {
			extendsList[subClassName].forEach((superClassName) => {
				extendedByList[superClassName] = extendedByList[superClassName] || [];
				extendedByList[superClassName].push(subClassName);
			});
		});

		this.extendedByList = extendedByList;
		this.fitnessList = {};
	}

	/**
	 * @param {Scheme} scheme
	 */
	setScheme(scheme) {
		this.serviceOfClass = {};

		Object.keys(scheme)
			.forEach((serviceName) => {
				const schemeEntry = scheme[serviceName];
				this.serviceOfClass[schemeEntry._class] = serviceName;
			});
	}

	/**
	 * @param {string} className
	 * @return {Array<string>}
	 */
	getFitnessListFor(className) {
		if (!this.fitnessList[className]) {
			this.fitnessList[className] = transitive(((subClass) => this.extendedByList[subClass] || []), className);
		}

		return this.fitnessList[className];
	}

	/**
	 * @param {Scheme} scheme
	 */
	matchAllSchemeDependencies(scheme) {
		Object.keys(scheme)
			.forEach((serviceName) => {
				const serviceEntry = scheme[serviceName];

				Object.keys(serviceEntry)
					.filter((parameterName) => !parameterName.startsWith('_'))
					.forEach((parameterName) => {
						const parameterValue = serviceEntry[parameterName];

						if (parameterValue.startsWith('{') && parameterValue.endsWith('}')) {
							const requiredClass = parameterValue.substr(1, parameterValue.length - 2);
							const matchedService = this.matchRequiredClass(requiredClass);
							serviceEntry[parameterName] = `@${matchedService}`;
						}
					});
			});
	}

	/**
	 * @param {string} requiredClass
	 * @return {?string} alias of service to inject as dependency
	 */
	matchRequiredClass(requiredClass) {
		for (const acceptableClass of this.getFitnessListFor(requiredClass)) {
			if (this.serviceOfClass[acceptableClass]) {
				return this.serviceOfClass[acceptableClass];
			}
		}

		return null;
	}
}


/**
 *
 */
module.exports = Matcher;
