import {Animated} from "./Animated";

import Vector   from "../Vector";
import Game     from "../Game";

export class Tower extends Animated {

	constructor(game : Game, pos : Vector, shape : string, info : Object) {
		super(game, pos, shape, info);
		this.rank = 0;
		this.forward = new Vector(1,0,0.2);
		this.target = null;
	}

	click() {
		// TODO upgrade tower
		this.game.delete(this);
	}

	tick() {
		// point and shoot mobs on range
		super.tick();
		this.frame();

		if(Math.random()<0.05) {
			this.game.add(new Shot(
				this.game,
				this.pos,
				this.info.shot.shape || this.sprite.state.shape+"_shot",
				{
					damage: this.info.shot.damage || 1,
					vel: this.forward.scale(this.info.shot.speed || 1)
				}
			));
		}
	}

	draw() {
		super.draw();
		if(this.rank > 0) {
			this.render.blit(this.pos2d, {shape: "rank"+this.rank}, this);
		}
	}
}