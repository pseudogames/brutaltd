import Entity from "../Entity";
import Moving from "./Moving";

export default class Shot extends Moving {

	init() {	
		super.init();
		this.vel = this.info.vel;
	}

	tick() {
		// balistic movement and collision check
		this.vel = this.vel.scale(0.99);
		this.pos = this.pos.add(this.vel.scale(this.game.time.delta / 1000));
		super.tick();
	}

}

Entity.register(Shot);
