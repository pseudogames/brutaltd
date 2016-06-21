import {Mobile} from "./Mobile";

export class Shot extends Mobile {

	move() {
		// balistic movement and collision check
		this.vel = this.vel.scale(0.999);
		super.move();
	}

	tick() {
		super.tick();

		if(Math.random() < 0.01) 
			this.game.delete(this);
	}
}