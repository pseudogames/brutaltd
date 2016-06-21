import {Animated} from "./Animated";

export class Mobile extends Animated {

	init() {
		this.vel = this.info.vel;
	}

	move() {
		this.pos = this.pos.add(this.vel)
	}

	tick() {
		super.tick();
		if(!this.grid.move(this, this.move.bind(this))) {
			this.game.delete(this);
		}
		this.project();
	}
}