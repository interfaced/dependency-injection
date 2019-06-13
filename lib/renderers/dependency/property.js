/**
 * @param {string} scReference
 * @param {*} value
 * @return {string}
 */
const resolveParameter = function(scReference, value) {
	if (typeof value === 'string' && value.startsWith('@')) {
		return `${scReference}.${value.substr(1)}`;
	} else if (value === undefined) {
		return 'undefined';
	}

	return String(value);
};


/**
 * @param {string} scReference
 * @param {string} serviceName
 * @param {InjectorPropertyData} injectorData
 * @param {string} value
 * @return {string}
 */
module.exports = function(scReference, serviceName, injectorData, value) {
	const {propertyName} = injectorData;
	const resolve = resolveParameter.bind(null, scReference);

	return `${scReference}.${serviceName}.${propertyName} = ${resolve(value)};`;
};
