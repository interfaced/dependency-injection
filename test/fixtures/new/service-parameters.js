module.exports = {
	controllerMovie: {
		'sceneMovieList': {
			parameterName: 'sceneMovieList',
			parameterClass: 'MovieList',
			injectorType: 'constructor',
			injectorData: {
				index: 0
			}
		},
		'sceneMovieCard': {
			parameterName: 'sceneMovieCard',
			parameterClass: 'MovieList',
			injectorType: 'constructor',
			injectorData: {
				index: 1
			}
		},
		'repositoryMovie': {
			parameterName: 'repositoryMovie',
			parameterClass: 'MovieRepository',
			injectorType: 'constructor',
			injectorData: {
				index: 2
			}
		}
	},
	scenesMovieCard: {
		'movieController': {
			parameterName: 'movieController',
			parameterClass: 'MovieController',
			injectorType: 'property',
			injectorData: {
				propertyName: 'movieController'
			}
		}
	},
	scenesMovieList: {
		'movieController': {
			parameterName: 'movieController',
			parameterClass: 'MovieController',
			injectorType: 'property',
			injectorData: {
				propertyName: 'movieController'
			}
		}
	},
	repositoryMovie: {
	}
};
