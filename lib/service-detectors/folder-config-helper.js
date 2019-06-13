const path = require('path');


/**
 */
class Helper {
	/**
	 * @param {string} appDir
	 */
	constructor(appDir) {
		/**
		 * @type {string}
		 * @protected
		 */
		this._appDir = appDir;
	}

	/**
	 * @param {Array<Helper.GenericConfigRecord>} config
	 * @return {Array<Helper.FullConfigRecord>}
	 */
	processConfig(config) {
		return config.map(this.processConfigRecord.bind(this));
	}

	/**
	 * @param {Helper.GenericConfigRecord} configRecord
	 * @return {Helper.FullConfigRecord}
	 */
	processConfigRecord(configRecord) {
		if (typeof configRecord === 'string') {
			return this.processStringConfigRecord(configRecord);
		}

		return configRecord;
	}

	/**
	 * @param {string} group
	 * @return {Helper.FullConfigRecord}
	 */
	processStringConfigRecord(group) {
		return {
			group,
			directory: path.join(this._appDir, group)
		};
	}
}


/**
 * @typedef {{
 *     group: string,
 *     directory: string
 * }}
 */
Helper.FullConfigRecord;


/**
 * @typedef {Helper.FullConfigRecord|string}
 */
Helper.GenericConfigRecord;


/**
 *
 */
module.exports = Helper;
