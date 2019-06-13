const fs = require('fs');
const path = require('path');
const recursive = require('recursive-readdir');
const FileIndex = alias.require('@sut/file-index');
const {TemplateHelper} = require('zombiebox');

const ignoreNonJs = function(filepath, stats) {
	return !stats.isDirectory() && !(['.js', '.es6'].includes(path.extname(filepath)));
};

const getTemplateLocations = function() {
	return [
		path.resolve(__dirname, '..', 'templates')
	];
};

describe('DIC Builder', () => {
	const Builder = alias.require('@sut/builder');
	describe('method: .build', () => {
		it('method exists', () => {
			const builder = new Builder();
			expect(builder.build)
				.is.a('function');
		});
		it('testcase: Sandbox demo', (done) => {
			recursive(alias.path('@sandbox-modules/app/sandbox'), [ignoreNonJs], (err, data) => {
				if (err) {
					done(err);
				}
				const fileIndex = new FileIndex();
				fileIndex.addSourceArray(data);
				const mocks = alias.require('@fixtures/builder/mocks.js');
				const templateHelper = new TemplateHelper(getTemplateLocations);

				const builder = new Builder(templateHelper, mocks.zbConfig);
				const expectedResult = fs.readFileSync(alias.path('@fixtures/builder/result-module.js'), 'utf8');

				expect(builder.build(fileIndex)).equal(expectedResult);
				done();
			});
		});
	});
});
