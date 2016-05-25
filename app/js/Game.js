import Walker from "./Walker";
import Vector from "./Vector";
import Ortho from "./Ortho";
import Grid from "./Grid";
import Sprites from "./Sprites";
import Render from "./Render";

export default class Game {
	constructor() {
		console.log(`There's a new game in town`);
		this.render = new Render();
		this.now = Date.now();
		this.then = Date.now();
		this.time_elapsed = 0;
		this.wave = [];
		return this;
	}
	start(sprite_name : string, grid_name : string) {
		Promise
			.all([
				Sprites.create(new Vector(66,96), sprite_name),
				Grid.create(new Vector(16,9,1), grid_name)
			])
			.then( ([s, g]) => {
				this.sprites = s;
				this.grid    = g;
				this.render.setup(g,s).draw();
			})
			.catch(err => {
				console.log(`Game.start err`, err);
			});
	}
	send_wave() {
		this.then = Date.now();
		this.time_elapsed = 0;
		this.update();
	}
	update() {
		this.now = Date.now();
		let timeelapsed = (this.now - this.then);
		let delta = timeelapsed / 1000;

		this.time_elapsed += timeelapsed;

		if(this.time_elapsed > 400 && this.wave.length < 10) {
			this.time_elapsed = 0;
			this.wave.push(new Walker(this.grid.path));
		}

		this.render.begin();
		for(let walker of this.wave) {
			if(!walker.completed_path) {
				walker.move(delta);
				this.render.sprite(walker.position, "mob1", "enter", 0);
			}
		}
		this.render.draw();
		this.render.end();

		this.raf = requestAnimationFrame( ()=> this.update() );
		this.then = this.now;
	}
}