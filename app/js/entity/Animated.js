import Entity from "../Entity";

export default class Animated extends Entity {

	tick() {
		// loop animation
		if(this.sheet.animate(this.sprite.state, this.info.speed || 1)) {
			this.frame();
		}
	}

}

Entity.register(Animated);
