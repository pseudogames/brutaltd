import Entity from "../Entity";
import Animated from "./Animated";

export default class Mobile extends Animated {

	init() {
		this.vel = this.info.vel;
	}

	move() {
		this.pos = this.pos.add(this.vel.scale(this.game.time.delta / 1000));
	}

	tick() {
		super.tick();
		if(!this.grid.move(this, this.move.bind(this))) {
			this.delete();
		}
		this.project();
	}
}

Entity.register(Mobile);
