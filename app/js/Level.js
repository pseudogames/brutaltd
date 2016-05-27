import Grid    from "./Grid";
import Sprites from "./Sprites";
import Wave    from "./Wave";

export default class Level {
	static load(level_info : Object) {
		return new Promise(
			function (resolve, reject) {
				Promise
					.all([
						Sprites.create(level_info.sprites),
						Grid.create(level_info.grid)
					])
					.then(
						([s, g]) => {
							resolve(new Level(s,g,level_info.wave));
						},
						(error) => {
							reject(error);
						}
					)
			}
		)
	}

	constructor(sprites : Sprites, grid : Grid, waves) {
		this.sprites = sprites;
		this.grid    = grid;
		this.waves   = waves;
	}

	send_wave() {
		let wave_info = this.waves.shift();
		if(wave_info !== undefined) {
			let [quantity,sprite_entity,speed] = wave_info;
			this.wave = new Wave(quantity,sprite_entity,speed, this.grid.path).start();
			return true;
		}
		return false;
	}

	wave_is_finished() {
		return this.wave.is_finished();
	}

	update(time_elapsed : number) {
		this.wave.update(time_elapsed);
		let sprites_to_render = [];
		for(let walker of this.wave.queue) {
			if(!walker.completed_path) {
				let state = this.sprites.get_state(walker.direction);
				let frame = Math.floor(Date.now() / 100 * this.wave.speed) % this.sprites.animated[this.wave.sprite_entity][state].length;
				// TODO: should this be an Object? like new RenderableSprite????
				sprites_to_render.push({
					grid_pos : walker.position,
					entity   : this.wave.sprite_entity,
					state    : state,
					frame    : frame
				});
			}
		}
		return sprites_to_render;
	}
}