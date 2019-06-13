describe('dependency detector: Setters', () => {
	const chai = require('chai');
	chai.use(require('dirty-chai'));
	const expect = chai.expect;
	const detector = alias.require('@sut/dependency-detectors/setters');
	const fixtures = alias.require('@fixtures/dependency-detectors-fixtures');

	describe('Module', () => {
		it('exists', () => {
			expect(detector).to.be.not.undefined();
		});
		it('interface', () => {
			expect(detector).is.a('function');
		});
	});
	describe('detect dependencies', () => {
		it('should find deps in setters with "@param {} :inject" annotation', () => {
			const testcase = fixtures.exportDefaultSetters;
			const deps = detector(testcase.source);
			expect(deps).deep.equal(testcase.result.deps);
		});
	});
});
