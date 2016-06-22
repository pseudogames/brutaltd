import Entity from "../Entity";
import Mobile from "./Mobile";

export default class Shot extends Mobile {

	move() {
		// balistic movement and collision check
		this.vel = this.vel.scale(0.999);
		super.move();
	}

}

Entity.register(Shot);
