import IMovieController from "../../controller/interface/i-movie-controller";
import Movie from "../../model/movie";
import {render, MovieCardOut} from "generated/templates/sandbox/sandbox/scenes/movie-card/movie-card.jst";
import CuteScene from "@zb/layers/cute-scene";
import Layer from "@zb/layers/layer";
import DataList from "@zb/ui/data-list";


/**
 */
const MovieCard = class extends CuteScene {
	constructor() {
		super();

		/**
		 * @type {IMovieController} :inject
		 */
		this.controllerMovie;

		/**
		 * @type {DataList<Movie>}
		 */
		this._similarMovies = null;

		/**
		 * @type {Movie}
		 * @protected
		 */
		this._movie = null;

		/**
		 * @type {MovieCardOut}
		 * @protected
		 */
		this._exported;

		this._addContainerClass('s-movie-card');

		const ex = this._exported;
		ex.similarMovieList.on(ex.similarMovieList.EVENT_CLICK, (eventName, movie) => {
			this._actionOpenMovieCard(movie);
		});
	}

	/**
	 * @param {Movie} movie
	 */
	setMovie(movie) {
		this._movie = movie;
		this._renderMovie(this._movie);
	}

	/**
	 * @param {DataList<Movie>} movieCollection
	 */
	setSimilarMovies(movieCollection) {
		this._similarMovies = movieCollection;
		this._exported.similarMovieList.setSource(null);
		this._exported.similarMovieList.setSource(movieCollection);
	}

	/**
	 * @inheritDoc
	 */
	takeSnapshot() {
		return (data, widgetSnapshot) => {
			this.setMovie(data.movie);
			this.setSimilarMovies(data.similarMovies);
			widgetSnapshot.load();
		};
	}

	/**
	 * @return {Layer}
	 */
	getLayer() {
		return this;
	}

	/**
	 * @param {Movie} movie
	 */
	_renderMovie(movie) {
		this._renderTitle(movie.title);
		this._renderRating(movie.rating);
	}

	/**
	 * @param {string} title
	 */
	_renderTitle(title) {
		zb.html.text(this._exported.title, title);
	}

	/**
	 * @param {number} rating
	 */
	_renderRating(rating) {
		const stringRating = rating ? rating.toFixed(1) : '';
		zb.html.text(this._exported.rating, stringRating);
	}

	/**
	 * @param {Movie} movie
	 * @return {IThenable}
	 */
	_actionOpenMovieCard(movie) {
		return this.controllerMovie.openMovieCard(movie);
	}

	/**
	 * @inheritDoc
	 */
	_renderTemplate() {
		return render(this._getTemplateData(), this._getTemplateOptions());
	}
};

export default MovieCard;
