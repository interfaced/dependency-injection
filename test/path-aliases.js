const Alias = require('require-alias');
const path = require('path');


global.alias = global.alias || new Alias({
	root: path.join(__dirname, '../'),
	aliases: {
		'@fixtures': '/test/fixtures',
		'@sandbox-modules': '/test/demo/demo-sandbox-modules',
		'@sut': '/lib',
		'@zombiebox': ''
	}
});
