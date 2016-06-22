import Entity from "../Entity";
import Still from "./Still";
import Bounds from "../Bounds";
import Vector from "../Vector";

export default class Action extends Still {
	
	project() {
		super.project();
		this.pos2d.z += 9999;
		this.pos2d0 = this.render.pos2d(this.info.origin,0);
	}

	click() {
		this.info.callback();
		this.game.selector.forEach(e => e.delete());
	}

	draw() {
		super.draw();
		let mid = this.render.size2d.scale(0.5);
		let ab = Bounds.scale(this.pos2d.sub(this.pos2d0).sign(), mid);
		this.render.text(
			this.pos2d.add(ab).add(mid),
			this.info.label
		);
	}
}

Entity.register(Action);
