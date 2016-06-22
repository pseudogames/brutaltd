import Entity   from "../Entity";
import Animated from "./Animated";
import Shot     from "./Shot";
import Vector   from "../Vector";
import Game     from "../Game";

export default class Tower extends Animated {

	constructor(game : Game, pos : Vector, shape : string, info : Object) {
		super(game, pos, shape, info);
		this.rank = 0;
		this.forward = new Vector(1,0,0.2);
		this.target = null;
		this.shot_at = this.game.time.virtual;
	}

	click() {
		// TODO upgrade tower
		this.delete();
	}

	tick() {
		// point and shoot mobs on range
		super.tick();

		let delay = 1000 / (this.info.shot.rate || 1);
		if(this.game.time.virtual > this.shot_at + delay) {
			this.shot_at = this.game.time.virtual;
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
			this.render.blit(this, {shape: "rank"+this.rank});
		}
	}
}

Entity.register(Tower);
