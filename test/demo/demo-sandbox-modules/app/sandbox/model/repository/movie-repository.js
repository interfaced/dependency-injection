import IMovieRepository from "./interface/i-movie-repository";
import Movie from "../movie";


/**
 * @implements {IMovieRepository}
 */
export default class {
	constructor() {
		/**
		 * @protected
		 * @type {Array<Movie>}
		 */
		this._items = [];
		const dataList = [
			{
				title: 'Batman',
				rating: 4
			},
			{
				title: 'Godfather',
				rating: 6
			},
			{
				title: 'Green Mile',
				rating: 7
			},
			{
				title: 'Cloud Atlas',
				rating: 10
			}
		];
		this._items = dataList.map((data, index) => {
			const item = new Movie(data.title);
			item.id = index + 1;
			item.rating = data.rating;
			return item;
		});
	}

	/**
	 * @param {number} id
	 * @return {Movie}
	 */
	getMovieById(id) {
		return this._items.filter(item => item.id === id).pop();
	}

	/**
	 * @param {Movie.Descriptor} movieDescriptor
	 * @return {Movie}
	 */
	getMovieByDescriptor(movieDescriptor) {
		if (movieDescriptor instanceof Movie) {
			return movieDescriptor;
		} else if (typeof movieDescriptor === 'number') {
			return this.getMovieById(movieDescriptor);
		} else {
			return null;
		}
	}

	/**
	 * @return {Array<Movie>}
	 */
	getAllMovies() {
		return this._items;
	}

	/**
	 * @inheritDoc
	 */
	getSimilarMovies(movie) {
		return this._items.filter(item => item.id !== movie.id);
	}
};
