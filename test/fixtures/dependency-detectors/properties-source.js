import IMovieController from "./interface/i-movie-controller";
import MovieList from "../scenes/movie-list/movie-list";
import MovieCard from "../scenes/movie-card/movie-card";
import MovieRepository from "../model/repository/movie-repository";
import SceneOpener from "@zb/scene-opener";


/**
 * @implements {IMovieController}
 */
export default class {
	constructor() {
		/**
		 * @type {SceneOpener}
		 */
		this.sceneOpener;

		/**
		 * @type {MovieList} :inject
		 */
		this.sceneMovieList = sceneMovieList;
		/**
		 * @type {MovieCard} :inject
		 */
		this.sceneMovieCard = sceneMovieCard;
		/**
		 * @type {MovieRepository} :inject
		 */
		this.repositoryMovie = repositoryMovie;
	}
};
