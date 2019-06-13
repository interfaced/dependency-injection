module.exports = {
	controllerMovie: {
		group: 'controller',
		name: 'controllerMovie',
		type: 'MovieController',
		fits: [
			'MovieController',
			'IMovieController'
		],
		file: alias.path('@sandbox-modules/app/sandbox/controller/movie-controller.js')
	},
	repositoryMovie: {
		group: 'repository',
		name: 'repositoryMovie',
		type: 'MovieRepository',
		fits: [
			'MovieRepository',
			'IMovieRepository'
		],
		file: alias.path('@sandbox-modules/app/sandbox/model/repository/movie-repository.js')
	},
	scenesMovieList: {
		group: 'scenes',
		name: 'scenesMovieList',
		type: 'MovieList',
		fits: [
			'MovieList'
		],
		file: alias.path('@sandbox-modules/app/sandbox/scenes/movie-list/movie-list.js')
	},
	scenesMovieCard: {
		group: 'scenes',
		name: 'scenesMovieCard',
		type: 'MovieCard',
		fits: [
			'MovieCard'
		],
		file: alias.path('@sandbox-modules/app/sandbox/scenes/movie-card/movie-card.js')
	}
};
