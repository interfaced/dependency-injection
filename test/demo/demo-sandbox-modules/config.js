var path = require('path');

/**
 * @param {Object} config
 * @return {Object}
 */
module.exports = function(config) {
	return {
		project: {
			name: 'sandbox',
			main: alias.path('@sandbox-modules/app/index.js'),
			module: alias.path('@sandbox-modules/app')
		},
		di: {
			servicesAutodetect: [
				{
					group: 'scenes',
					directory: alias.path('@sandbox-modules/app/sandbox/scenes')
				},
				{
					group: 'service',
					directory: alias.path('@sandbox-modules/app/sandbox/service')
				},
				{
					group: 'controller',
					directory: alias.path('@sandbox-modules/app/sandbox/controller')
				},
				{
					group: 'repository',
					directory: alias.path('@sandbox-modules/app/sandbox/model/repository')
				}
			]
		}
	};
};
