describe('Config Helper for serviceFolders', () => {
	const chai = require('chai');
	chai.use(require('dirty-chai'));
	const expect = chai.expect;

	const Helper = alias.require('@sut/service-detectors/folder-config-helper');

	describe('class', () => {
		it('class exists', () => {
			expect(Helper)
				.is.a('function');
		});
		it('default constructor', () => {
			expect(() => new Helper('/temp', 'temp')).not.to.throw();
		});
	});

	describe('logic', () => {
		let instance;
		beforeEach(() => {
			instance = new Helper('/sandbox', 'sandbox');
		});
		describe('method: .processStringConfigRecord', () => {
			it('Expands string field to object', () => {
				expect(instance.processStringConfigRecord('batman'))
					.deep.equal({
						group: 'batman',
						directory: '/sandbox/batman'
					});
			});
		});
		describe('method: .processConfigRecord', () => {
			it('pass object as it is', () => {
				const fixture = {
					group: 'service',
					directory: '/sandbox/something/service'
				};
				expect(instance.processConfigRecord(fixture))
					.deep.equal(fixture);
			});
			it('automatically expands string to object', () => {
				expect(instance.processConfigRecord('batman'))
					.deep.equal({
						group: 'batman',
						directory: '/sandbox/batman'
					});
			});
		});
	});
});
