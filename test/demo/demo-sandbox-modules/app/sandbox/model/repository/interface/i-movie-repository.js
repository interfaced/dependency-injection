import Movie from "../../movie";


/**
 * @interface
 */
export default class {
	/**
	 * @param {number} id
	 * @return {Movie}
	 */
	getMovieById(id) {
	}

	/**
	 * @param {Movie.Descriptor} movieDescriptor
	 * @return {Movie}
	 */
	getMovieByDescriptor(movieDescriptor) {
	}

	/**
	 * @return {Array<Movie>}
	 */
	getAllMovies() {
	}

	/**
	 * @param {Movie} movie
	 * @return {Array<Movie>}
	 */
	getSimilarMovies(movie) {
	}
};
