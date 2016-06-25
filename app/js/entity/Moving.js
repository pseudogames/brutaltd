import Entity from "../Entity";
import Animated from "./Animated";

export default class Moving extends Animated {

	tick() {
		super.tick();
		if(this.grid.add(this)) {
			this.project();
		} else {
			this.delete();
		}
	}
}

Entity.register(Moving);
