import IMovieController from "./interface/i-movie-controller";
import MovieList from "../scenes/movie-list/movie-list";
import MovieCard from "../scenes/movie-card/movie-card";
import MovieRepository from "../model/repository/movie-repository";
import SceneOpener from "@zb/scene-opener";
import EventPublisher from "@zb/events/event-publisher";


/**
 * @implements {IMovieController}
 */
export default class extends EventPublisher {
	/**
	 * @param {MovieList} sceneMovieList :inject
	 * @param {MovieCard} sceneMovieCard :inject
	 * @param {MovieRepository} repositoryMovie :inject
	 */
	constructor(sceneMovieList, sceneMovieCard, repositoryMovie) {
		super();

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
		 * @type {MovieRepository}
		 */
		this.repositoryMovie = repositoryMovie;
	}
};
