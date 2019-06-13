/**
 * @typedef {InjectorConstructorData|InjectorSetterData|InjectorPropertyData}
 */
let InjectorData;


/**
 * @typedef {{
 *     methodName: string
 * }}
 */
let InjectorSetterData;


/**
 * @typedef {{
 *     index: number
 * }}
 */
let InjectorConstructorData;


/**
 * @typedef {{
 *     propertyName: string
 * }}
 */
let InjectorPropertyData;

module.exports = {
	InjectorData,
	InjectorSetterData,
	InjectorConstructorData,
	InjectorPropertyData
};
