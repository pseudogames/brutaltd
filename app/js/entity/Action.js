import Entity from "../Entity";
import Still from "./Still";

export default class Action extends Still {
	
	project() {
		super.project();
		this.pos2d.z += 9999;
	}

	click() {
		this.info.callback();
		this.game.selector.forEach(e => e.delete());
	}

	draw() {
		super.draw();
		this.render.text(this.pos2d, this.info.label);
	}
}

Entity.register(Action);
