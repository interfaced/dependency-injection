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
 * @param {ProviderData} providerData
 * @return {string}
 */
module.exports = function(scReference, serviceName, providerData) {
	const resolve = resolveParameter.bind(null, scReference);
	const {constructorFunction, constructorArgs = []} = providerData;
	const argumentsString = constructorArgs.map(resolve).join(', ');

	return `${scReference}.${serviceName} = new ${constructorFunction}(${argumentsString});`;
};
