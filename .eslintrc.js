module.exports = {
	extends: 'interfaced',
	overrides: [
		{
			files: ['lib/**/*.js', 'index.js'],
			...require('eslint-config-interfaced/overrides/node')
		},
		{
			files: ['lib/**/*.js', 'index.js'],
			rules: {
				'global-require': 'off'
			}
		},
		{
			files: ['test/**/*.js'],
			...require('eslint-config-interfaced/overrides/node')
		},
		{
			files: ['test/**/*.js'],
			...require('eslint-config-interfaced/overrides/mocha-chai')
		},
		{
			files: ['test/**/*.js'],
			rules: {
				'global-require': 'off'
			},
			globals: {
				'alias': true
			}
		}
	]
};
