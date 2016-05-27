import Vector  from "./Vector";
import Loader  from "./Loader";
import Grid    from "./Grid";
import Sprites from "./Sprites";
import Render  from "./Render";
import Walker  from "./Walker";
import Wave    from "./Wave";
import Level   from "./Level";

export default class Game {
	constructor() {
		console.log(`There's a new game in town`);
		this.render = new Render();

		// TODO: deal with exceptions
		Loader
			.json('game/game.json')
			.then(
				(game_info) => this.start(JSON.parse(game_info)),
				(error) => console.log("error", error)
			);

		return this;
	}
	start(game_info : Object) {
		this.game_info = game_info;
		this.load_level(0);
	}
	load_level(level_number : number) {
		this.end();
		let level_info = this.game_info.level[level_number];
		// TODO: deal with exceptions
		if(level_info !== undefined) {
			Level
				.load(level_info)
				.then(level => {
					this.level = level;
					this.render.setup(this.level.grid, this.level.sprites);
					this.send_wave();
				});
		}
	}
	send_wave() {
		this.then = Date.now();
		let wave_sent = this.level.send_wave();
		if(wave_sent === true) {
			this.update();
		} else {
			this.end();
		}
	}
	update() {
		this.now = Date.now();
		let time_elapsed = (this.now - this.then);

		this.render
			.begin()
			.enqueue_sprites(this.level.update(time_elapsed))
			.draw()
			.end();

		this.then = this.now;
		this.raf = requestAnimationFrame( ()=> this.update() );

		if(this.level.wave_is_finished()) {
			this.send_wave();
		}
	}
	end() {
		if(this.raf) {
			cancelAnimationFrame(this.raf);
		}
	}
}