var path = require('path');
var sandboxPath = alias.path('@sandbox-modules');


module.exports = {
	providers: {
		controllerMovie: {
			group: 'controller',
			name: 'controllerMovie',
			type: 'MovieController',
			fits: [
				'MovieController',
				'IMovieController'
			],
			file: path.join(sandboxPath, 'app/sandbox/controller/movie-controller.js')
		},
		repositoryMovie: {
			group: 'repository',
			name: 'repositoryMovie',
			type: 'MovieRepository',
			fits: [
				'MovieRepository',
				'IMovieRepository'
			],
			file: path.join(sandboxPath, 'app/sandbox/model/repository/movie-repository.js')
		},
		scenesMovieList: {
			group: 'scenes',
			name: 'scenesMovieList',
			type: 'MovieList',
			fits: [
				'MovieList'
			],
			file: path.join(sandboxPath, 'app/sandbox/scenes/movie-list/movie-list.js')
		},
		scenesMovieCard: {
			group: 'scenes',
			name: 'scenesMovieCard',
			type: 'MovieCard',
			fits: [
				'MovieCard'
			],
			file: path.join(sandboxPath, 'sandbox/scenes/movie-card/movie-card.js')
		}
	},
	deps: {
		controllerMovie: {
			repositoryMovie: 'repositoryMovie'
		},
		scenesMovieList: {
			controllerMovie: 'controllerMovie'
		},
		scenesMovieCard: {
			controllerMovie: 'controllerMovie'
		},
		repositoryMovie: {}
	}
};
