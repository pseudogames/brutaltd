import Entity from "../Entity";
import Moving from "./Moving";
import Vector from "../Vector";
import Game   from "../Game";

export default class Mob extends Moving {

	init() {
		super.init();
		this.speed = this.info.speed;
		this.path = this.game.grid.path.slice().map(v => v.copy());
		this.goal = this.path.shift();
		this.birth = this.game.time.virtual;
		this.mileage = 0;
		this.age = 0;
	}

	tick() {
		// move through the path
		let step = this.speed * this.game.time.delta / 1000;

		this.age = this.game.time.virtual - this.birth;
		this.mileage += step;

		while(step > 0) {

			let dir = this.goal.sub(this.pos);
			let dist = dir.magnitude();

			if(dist < 0.01) {
				if(this.path.length == 0) {
					this.game.lives --;
					return this.delete();
				}
				this.goal = this.path.shift();
				this.sheet.change(
					this.sprite.state,
					this.sheet.get_dir_cycle(dir)
				);
				continue;
			}

			this.pos = this.pos.add(
				step > dist ? dir : dir.norm(dist).scale(step)
			);
			step -= Math.min(step, dist);
		}

		super.tick();
	}

}

Entity.register(Mob);
