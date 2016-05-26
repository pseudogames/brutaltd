import Walker from "./Walker";
import Vector from "./Vector";
import Ortho from "./Ortho";
import Grid from "./Grid";
import Sprites from "./Sprites";
import Render from "./Render";
import Loader from "./Loader";

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
				Sprites.create(new Vector(66,96), level.sprites),
				Grid.create(new Vector(16,9,1), level.grid)
			])
			.then( ([s, g]) => {
				this.sprites = s;
				this.grid    = g;
				this.render.setup(g,s).draw();
				this.send_wave();
			})
			.catch(err => {
				console.log(`Game.start err`, err);
			});
	}
	send_wave() {
		this.then = Date.now();
		this.time_elapsed = 0;
		this.wave = this.level.wave.shift();
		if(this.wave !== undefined) {
			this.wave_queue = [];
			this.update();
		} else {
			this.end();
		}
	}
	update(wave_sprite) {
		this.now = Date.now();
		let timeelapsed = (this.now - this.then);
		let delta = timeelapsed / 1000;

		this.time_elapsed += timeelapsed;

		if(this.time_elapsed > 400 && this.wave_queue.length < this.wave[0]) {
			this.time_elapsed = 0;
			this.wave_queue.push(new Walker(this.grid.path));
		}

		this.render.begin();
		for(let walker of this.wave_queue) {
			if(!walker.completed_path) {
				walker.move(delta);
				this.render.sprite(walker.position, this.wave[1], "enter", 0);
			}
		}
		this.render.draw();
		this.render.end();

		this.then = this.now;
		this.raf = requestAnimationFrame( ()=> this.update() );

		if(this.wave_queue.length > 0) {
			let wave_over = this.wave_queue.map(w => w.completed_path).reduce((l,c) => l && c, true);
			if(wave_over) this.send_wave();
		}

	}
	end() {
		cancelAnimationFrame(this.raf);
	}
}