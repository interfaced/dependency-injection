const FileRecord = alias.require('@sut/file-record');
const getDependenciesForFile = alias.require('@sut/dependency-detectors/detector-aggregator');
const detectors = [
	alias.require('@sut/dependency-detectors/properties'),
	alias.require('@sut/dependency-detectors/setters'),
	alias.require('@sut/dependency-detectors/constructor-parameters')
];

describe('Detector Aggregator', () => {
	describe('.getServiceParameters', () => {
		it('testcase: MovieCard', () => {
			const fixture = new FileRecord(alias.path('@sandbox-modules/app/sandbox/scenes/movie-card/movie-card.js'));
			expect(getDependenciesForFile(detectors, fixture))
				.deep.equal([{
					injectorData: {
						propertyName: 'controllerMovie'
					},
					injectorType: 'property',
					parameterClass: 'IMovieController',
					parameterName: 'controllerMovie'
				}]);
		});
	});
	// TODO: add tests for prop-deps and setter-deps
});
