describe('dependency detector: Constructor parameters', () => {
	const chai = require('chai');
	chai.use(require('dirty-chai'));
	const expect = chai.expect;
	const detector = alias.require('@sut/dependency-detectors/constructor-parameters');
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
		it('should find dependencies at constructor JSDoc with "@param {} :inject" annotation', () => {
			const testcase = fixtures.exportDefaultConstructor;
			const deps = detector(testcase.source);
			expect(deps).deep.equal(testcase.result.deps);
		});
	});
});
