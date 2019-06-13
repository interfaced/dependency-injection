import BaseApplication from "generated/base-application";
import * as zb from "@zb/zb";


/**
 */
export default class extends BaseApplication {
	constructor() {
		zb.console.setLevel(zb.console.Level.ALL);
		super();
	}

	/** @inheritDoc */
	onReady() {
		super.onReady();
		// TODO: System services
		this.sc.controllerMovie.sceneOpener = this._sceneOpener;
	}

	/** @inheritDoc */
	onStart() {
		this.home();
	}

	/**
	 * @override
	 */
	home() {
		this.clearHistory();
		return this.sc.controllerMovie.openMovieList();
	}
};
