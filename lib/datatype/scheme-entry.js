/**
 * Scheme is user-friendly format to set DIC builder configuration
 *
 * System keys:
 * _class   - {string} Classname for class provider
 * _import  - {ImportType} (optional) Import specifier type for gen imports (Default: DEFAULT)
 * _path    - {string} Absolute path to the module
 * _group   - {string} (optional) Group name for service
 *     later - array of strings
 * _factory - {reference} Factory reference and method // factory property name and method? need examples of usage
 *     # "deviceFactory.create"
 *     # "{IDeviceFactory}.create"
 *
 * Can contain any user keys for service parameters (deps)
 * key is name of param, value can be plain values or references
 *
 * References
 *     - service reference is "service:serviceName" or "@serviceName"
 *     - match reference is "match:ClassName" or "{ClassName}"
 *     - group reference "[groupName]"
 *
 * @typedef {Object}
 */
let SchemeEntry;

module.exports = SchemeEntry;
