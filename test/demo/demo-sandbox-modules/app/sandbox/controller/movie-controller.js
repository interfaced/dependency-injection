import IMovieController from "./interface/i-movie-controller";
import IMovieRepository from "../model/repository/interface/i-movie-repository";
import MovieList from "../scenes/movie-list/movie-list";
import MovieCard from "../scenes/movie-card/movie-card";
import DataList from "@zb/ui/data-list";
import SceneOpener from "@zb/scene-opener";


/**
 * @implements {IMovieController}
 */
export default class {
	/**
	 * @param {MovieList} sceneMovieList :inject
	 * @param {MovieCard} sceneMovieCard :inject
	 * @param {MovieRepository} repositoryMovie :inject
	 */
	constructor(sceneMovieList, sceneMovieCard, repositoryMovie) {
		/**
		 * @type {SceneOpener}
		 */
		this.sceneOpener;

		/**
		 * @type {MovieList}
		 */
		this.sceneMovieList = sceneMovieList;
		/**
		 * @type {MovieCard}
		 */
		this.sceneMovieCard = sceneMovieCard;
		/**
		 * @type {IMovieRepository}
		 */
		this.repositoryMovie = repositoryMovie;
	}

	/**
	 * Open movie list
	 * @inheritDoc
	 */
	openMovieList() {
		// Get data
		const movieCollection = new DataList(this.repositoryMovie.getAllMovies());
		// Open scene
		return this.sceneOpener.open(this.sceneMovieList.getLayer(), () => {
			// Set data
			this.sceneMovieList.setMovieCollection(movieCollection);
		});
	}

	/**
	 * Open movie card
	 * @inheritDoc
	 */
	openMovieCard(movieDesc) {
		// Load data
		const movie = this.repositoryMovie.getMovieByDescriptor(movieDesc);
		const similarMovies = new DataList(this.repositoryMovie.getSimilarMovies(movie));
		// Open scene
		return this.sceneOpener.open(this.sceneMovieCard.getLayer(), () => {
			// Set data
			this.sceneMovieCard.setMovie(movie);
			this.sceneMovieCard.setSimilarMovies(similarMovies);
		});
	}

	/**
	 * @param {IMovieRepository} repositoryMovie
	 */
	setRepositoryMovie(repositoryMovie) {
		this.repositoryMovie = repositoryMovie;
	}
};
