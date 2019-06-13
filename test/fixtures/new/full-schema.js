module.exports = {
	controllerMovie: {
		_class: 'MovieController',
		sceneMovieList: '{MovieList}',
		sceneMovieCard: '{MovieCard}',
		repositoryMovie: 'match:MovieRepository'

	},
	scenesMovieCard: {
		_class: 'MovieCard',
		_group: 'scenes',
		controller: '@movieController'
	},
	scenesMovieList: {
		_class: 'MovieList',
		_group: 'scenes',
		controller: 'service:movieController'
	},
	repositoryMovie: {
		_class: 'MovieRepository',
		_group: 'repository'
	}
};
