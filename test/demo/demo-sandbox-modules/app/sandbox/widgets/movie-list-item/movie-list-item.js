import {render, MovieListItemOut} from "generated/templates/sandbox/sandbox/widgets/movie-list-item/movie-list-item.jst";
import {Input} from "@zb/ui/interfaces/i-base-list-item";
import BaseListItem from "@zb/ui/base-list-item";


/**
 */
export default class extends BaseListItem {
	/**
	 * @param {Input} params
	 */
	constructor(params) {
		super(params);


		/**
		 * @type {MovieListItemOut}
		 * @protected
		 */
		this._exported;
	}

	/**
	 * @inheritDoc
	 */
	_createContainer() {
		const result = render({
			title: this._data.title,
			rating: this._data.rating ? this._data.rating.toFixed(1) : ''
		});
		this._container = (zb.html.findFirstElementNode(result.root));
	}
};
