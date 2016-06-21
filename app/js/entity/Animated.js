import {Entity} from "./Entity";

export class Animated extends Entity {
	tick() {
		// loop animation
		
		if(this.sheet.animate(this.sprite.state)) {
			this.frame();
		}
	}
}