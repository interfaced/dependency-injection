const {DEFAULT} = alias.require('@sut/datatype/import-type');

describe('service detecotor: Zombibox Folder Structure', () => {
	const factory = alias.require('@sut/service-detectors/zombiebox-folder-structure');
	const FileRecord = alias.require('@sut/file-record');


	it('Constructed by factory form config record', () => {
		expect(factory.createByConfigRecord)
			.is.a('function');
		expect(factory.createByConfigRecord({
			group: 'scenes',
			directory: alias.path('@sandbox-modules/app/sandbox/scenes')
		}))
			.is.a('function');
	});

	it('testcase: MovieCard', () => {
		const fixture = new FileRecord(alias.path('@sandbox-modules/app/sandbox/scenes/movie-card/movie-card.js'));
		const detect = factory.createByConfigRecord(alias.path('@sandbox-modules/app/sandbox'), {
			group: 'scenes',
			directory: alias.path('@sandbox-modules/app/sandbox/scenes')
		});
		expect(detect(fixture)).deep.equal({
			scenesMovieCard: {
				_class: 'MovieCard',
				_group: 'scenes',
				_import: DEFAULT,
				_path: 'scenes/movie-card/movie-card.js',
				controllerMovie: '{IMovieController}'
			}
		});
	});
});
