import Entity from "../Entity";

export default class Animated extends Entity {

	init() {
		this.sprite.state.speed = this.info.speed || 1;
	}

	tick() {
		// loop animation
		if(this.sheet.animate(this.sprite.state)) {
			this.frame();
		}
	}

}

Entity.register(Animated);
