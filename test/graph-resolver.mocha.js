describe('Dependency graph', () => {
	const chai = require('chai');
	const expect = chai.expect;

	const resolver = alias.require('@sut/tools/graph-resolver');
	describe('Module', () => {
		it('module exists', () => {
			expect(resolver).to.be.not.undefined();
		});
	});
	describe('Logic', () => {
		describe('method .getOrder()', () => {
			it('method exists', () => {
				expect(resolver.getOrder)
					.is.a('function');
			});
			it('keeps original graph unchanged', () => {
				const original = {
					'a': ['b', 'c'],
					'b': [],
					'c': []
				};
				resolver.getOrder(original);
				expect(original).deep.equal({
					'a': ['b', 'c'],
					'b': [],
					'c': []
				});
			});
			it('handle simple case:', () => {
				const fixture = {
					'a': ['b', 'd'],
					'b': ['d'],
					'c': ['d'],
					'd': []
				};
				const expectedResult = ['d', 'b', 'c', 'a'];
				expect(resolver.getOrder(fixture)).deep.eq(expectedResult);
			});
			it('throws on circular dependency', () => {
				const fixture = {
					'x': ['y'],
					'y': ['z'],
					'z': ['x', 'a'],
					'a': []
				};
				expect(() => {
					resolver.getOrder(fixture);
				}).to.throw();
			});
		});
	});
});
