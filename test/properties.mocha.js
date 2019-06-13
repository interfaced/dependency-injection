describe('dependency detector: Properties', () => {
	const chai = require('chai');
	chai.use(require('dirty-chai'));
	const expect = chai.expect;
	const detector = alias.require('@sut/dependency-detectors/properties');
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
		it('should find dependencies in constructor properties with "@type {} :inject" annotation', () => {
			const testcase = fixtures.exportDefaultProperties;
			const deps = detector(testcase.source);
			expect(deps).deep.equal(testcase.result.deps);
		});
	});
});
