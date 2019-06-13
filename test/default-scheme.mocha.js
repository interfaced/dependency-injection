const FileRecord = alias.require('@sut/file-record');
const defaultScheme = alias.require('@sut/service-detectors/default-scheme');
const {DEFAULT} = alias.require('@sut/datatype/import-type');


describe('service detector: Default Scheme', () => {
	it('testcase: MovieCard as module', () => {
		const fixture = new FileRecord(alias.path('@sandbox-modules/app/sandbox/scenes/movie-card/movie-card.js'));
		expect(defaultScheme(alias.path('@sandbox-modules/app/sandbox'), fixture)).deep.equal({
			_class: 'MovieCard',
			_path: 'scenes/movie-card/movie-card.js',
			_import: DEFAULT,
			controllerMovie: '{IMovieController}'
		});
	});
});
