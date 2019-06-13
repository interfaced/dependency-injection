/**
 * @typedef {{
 *     serviceName: string,
 *     serviceClass: string,
 *     group: string,
 *     providerType: ProviderType,
 *     providerData: ProviderData,
 *     relations: Array<RelationRecord>
 * }}
 */
let ServiceRecord;

module.exports = ServiceRecord;
