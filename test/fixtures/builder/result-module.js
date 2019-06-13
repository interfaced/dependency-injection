import BaseApplication from "generated/base-application";
import MovieCard from "sandbox/sandbox/scenes/movie-card/movie-card";
import MovieController from "sandbox/sandbox/controller/movie-controller";
import MovieList from "sandbox/sandbox/scenes/movie-list/movie-list";
import MovieRepository from "sandbox/sandbox/model/repository/movie-repository";


/**
 */
export default class {
	/**
	 * @param {BaseApplication} application
	 */
	constructor(application) {
		/**
		 * As proxy to system services
		 * @type {BaseApplication}
		 */
		this.application = application;

		/**
		 * @type {MovieController}
		 */
		this.controllerMovie;

		/**
		 * @type {MovieRepository}
		 */
		this.repositoryMovie;

		/**
		 * @type {MovieCard}
		 */
		this.scenesMovieCard;

		/**
		 * @type {MovieList}
		 */
		this.scenesMovieList;
	}

	/**
	 */
	bootstrap() {
		// Constructing
		this.repositoryMovie = new MovieRepository();
		this.scenesMovieCard = new MovieCard();
		this.scenesMovieList = new MovieList();
		this.controllerMovie = new MovieController(this.scenesMovieList, this.scenesMovieCard, this.repositoryMovie);

		// Interlacing
		this.scenesMovieCard.controllerMovie = this.controllerMovie;
		this.scenesMovieList.controllerMovie = this.controllerMovie;

		// Setup scenes
		this.application.addScene(this.scenesMovieCard, 'movie-card');
		this.application.addScene(this.scenesMovieList, 'movie-list');
	}
};
