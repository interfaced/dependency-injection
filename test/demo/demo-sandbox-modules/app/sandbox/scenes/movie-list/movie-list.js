import IMovieController from "../../controller/interface/i-movie-controller";
import Movie from "../../model/movie";
import {render, MovieListOut} from "generated/templates/sandbox/sandbox/scenes/movie-list/movie-list.jst";
import CuteScene from "@zb/layers/cute-scene";
import Layer from "@zb/layers/layer";
import DataList from "@zb/ui/data-list";


/**
 */
export default class extends CuteScene {
	constructor() {
		super();

		/**
		 * @type {IMovieController}:inject
		 */
		this.controllerMovie;


		/**
		 * @type {MovieListOut}
		 * @protected
		 */
		this._exported;

		this._addContainerClass('s-movie-list');

		const ex = this._exported;
		ex.movieList.on(ex.movieList.EVENT_CLICK, (eventName, movie) => {
			this._actionOpenMovieCard(movie);
		});
	}

	/**
	 * @param {DataList<Movie>} movieCollection
	 */
	setMovieCollection(movieCollection) {
		this._exported.movieList.setSource(null);
		this._exported.movieList.setSource(movieCollection);
	}

	/**
	 * @return {DataList<Movie>}
	 */
	getMovieCollection() {
		return this._exported.movieList.getSource();
	}

	/**
	 * @inheritDoc
	 */
	takeSnapshot() {
		return (movieCollection, widgetSnapshot) => {
			this.setMovieCollection(movieCollection);
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
