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
		this.vel.z = this.vel.z - 0.5;
		this.pos = this.pos.add(this.vel.scale(this.game.time.delta / 1000));
		let bump = this.game.collide(this);
		if(bump) {
			bump.delete();
			this.delete();
		}
		super.tick();
	}

}

Entity.register(Shot);
