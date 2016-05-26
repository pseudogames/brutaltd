import Walker from "./Walker";
import Vector from "./Vector";
import Ortho from "./Ortho";
import Grid from "./Grid";
import Sprites from "./Sprites";
import Render from "./Render";
import Loader from "./Loader";
import Wave   from "./Wave";
import UIManager from "./UIManager";
import Hermes from "./Hermes";
import * as EVENTS from "./Events";

export default class Game {
	constructor() {
		console.log(`There's a new game in town`);

		this.ui_manager = new UIManager();
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
		this.current_wave = 0;
		Hermes.subscribe(EVENTS.SEND_WAVE, this.send_wave.bind(this));
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
				// this.set_wave_timer();
			})
			.catch(err => {
				console.log(`Game.start err`, err);
			});
	}
	set_wave_timer() {
		if(this.wave_timer || this.level.wave.length == 0) return

		this.wave_timer = setTimeout(()=> {
			this.send_wave();
		}, 10000);

		this.time_to_next_wave = 10000;
		this.ui_manager.set_wave_timer(this.time_to_next_wave/1000);
		this.wave_timer_counter = setInterval(()=>{
			this.time_to_next_wave -= 1000;
			this.ui_manager.set_wave_timer(this.time_to_next_wave/1000);
		}, 1000);
	}
	send_wave() {
		if(this.wave_timer) {
			clearTimeout(this.wave_timer);
			clearInterval(this.wave_timer_counter);
			this.ui_manager.set_wave_timer(0);
			this.wave_timer = undefined;
		}

		let wave_info = this.level.wave.shift();
		if(wave_info !== undefined) {
			this.current_wave++;
			this.ui_manager.set_wave(this.current_wave);
			this.then = Date.now();
			this.wave = new Wave(...wave_info, this.grid.path).start();
			this.update();
		} else {
			this.end();
		}
	}
	update() {
		this.now = Date.now();
		let time_elapsed = (this.now - this.then);

		this.wave.update(time_elapsed);

		this.render.begin();
		for(let walker of this.wave.queue) {
			if(!walker.completed_path) {
				this.render.sprite(walker.position, this.wave.sprite, "enter", 0);
			}
		}
		this.render.draw();
		this.render.end();

		this.then = this.now;
		this.raf = requestAnimationFrame( ()=> this.update() );

		if(this.wave.is_finished()) {
			this.set_wave_timer();
		}
	}
	end() {
		cancelAnimationFrame(this.raf);
	}
}