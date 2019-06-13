export default class Movie {
	/**
	 * @param {string} title
	 */
	constructor(title) {
		/**
		 * @type {number}
		 */
		this.rating;

		/**
		 * @type {number}
		 */
		this.id;

		/**
		 * @type {string}
		 */
		this.title = title;
	}
};

/**
 * @typedef {Movie | number}
 */
Movie.Descriptor;
