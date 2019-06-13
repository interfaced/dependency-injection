import IMovieController from "./interface/i-movie-controller";
import MovieList from "../scenes/movie-list/movie-list";
import MovieCard from "../scenes/movie-card/movie-card";
import MovieRepository from "../model/repository/movie-repository";


/**
 * @implements {IMovieController}
 */
export default class {
	constructor() {
		/**
		 * @protected
		 * @type {MovieRepository}
		 */
		this.repositoryMovie;

		/**
		 * @protected
		 * @type {MovieCard}
		 */
		this.sceneMovieCard;

		/**
		 * @protected
		 * @type {MovieList}
		 */
		this.sceneMovieList;
	}

	/**
	 * @param {MovieList} sceneMovieList :inject
	 */
	setSceneMovieList(sceneMovieList) {
		this.sceneMovieList = sceneMovieList;
	}

	/**
	 * @param {MovieCard} sceneMovieCard :inject
	 */
	setSceneMovieCard(sceneMovieCard) {
		this.sceneMovieCard = sceneMovieCard;
	}

	/**
	 * @param {MovieRepository} repositoryMovie :inject
	 */
	setRepositoryMovie(repositoryMovie) {
		this.repositoryMovie = repositoryMovie;
	}
};
