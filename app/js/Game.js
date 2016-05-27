import Vector from "./Vector";
import Loader from "./Loader";
import Grid from "./Grid";
import Sprites from "./Sprites";
import Render from "./Render";
import Walker from "./Walker";
import Wave   from "./Wave";

export default class Game {
	constructor() {
		console.log(`There's a new game in town`);

		this.render = new Render();

		Loader
			.json('game/game.json')
			.then(
				(game_info) => this.start(JSON.parse(game_info)),
				(error) => console.log("error", error)
			);

		return this;
	}
	start(game_info : Object) {
		this.info = game_info;
		this.load_level(this.info.level[0]);
	}
	load_level(level : Object) {
		this.level = level;
		Promise
			.all([
				Sprites.create(level.sprites),
				Grid.create(level.grid)
			])
			.then( ([s, g]) => {
				this.sprites = s;
				this.grid    = g;
				this.render.setup(g,s);
				this.send_wave();
			})
			//.catch(err => {
			//	console.log(`Game.start err`, err);
			//});
	}
	send_wave() {
		this.then = Date.now();
		let wave_info = this.level.wave.shift();
		if(wave_info !== undefined) {
			let [quantity,sprite,speed] = wave_info;
			this.wave = new Wave(quantity,sprite,speed, this.grid.path).start();
			this.update();
		} else {
			this.end();
		}
	}
	update() {
		this.now = Date.now();
		let timeelapsed = (this.now - this.then);

		this.wave.update(timeelapsed);

		this.render.begin();
		for(let walker of this.wave.queue) {
			if(!walker.completed_path) {
				let frame = Math.floor(Date.now() / 100 * this.wave.speed) % this.sprites.animated[this.wave.sprite]["east"].length;
				this.render.sprite(walker.position, this.wave.sprite, this.sprites.facing(walker.x_direction, walker.y_direction), frame);
			}
		}
		this.render.draw();
		this.render.end();

		this.then = this.now;
		this.raf = requestAnimationFrame( ()=> this.update() );

		if(this.wave.is_finished()) {
			this.send_wave();
		}
	}
	end() {
		cancelAnimationFrame(this.raf);
	}
}
