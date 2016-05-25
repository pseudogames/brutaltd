'use strict';

import Walker from "./Walker";
import Vector from "./Vector";
import Ortho from "./Ortho";
import Grid from "./Grid";
import Sprites from "./Sprites";
import Render from "./Render";


let grid = new Grid(new Vector(16,9,1), "test");
let sprites = new Sprites(new Vector(66,96), "sample");
let render = new Render(grid, sprites,
	new Ortho(
		new Vector( 46.55, 17.88, 17.88),
		new Vector(-18.44, 45.00, 45.00),
		new Vector(  0   ,-31.55,  0.1 )
	)
);

setTimeout(_ => render.draw(), 500); // wait for load

class App {
	constructor(level) {
		this.then  = Date.now();
		this.now   = Date.now();
		this.wave = [];
		this.level = level;
		this.time_elapsed = 0;
	}
	main () {
		this.now = Date.now();
		let timeelapsed = (this.now - this.then);
		let delta = timeelapsed / 1000;

		this.time_elapsed += timeelapsed;

		if(this.time_elapsed > 400 && this.wave.length < 10) {
			this.time_elapsed = 0;
			this.wave.push(new Walker(this.level.path));
		}

		render.begin();
		for(let e of this.wave) {
			if(!e.completed_path) {
				e.move(delta);
				render.plot(e.position, "#EC0000");
			}
		}
		render.end();

		this.raf = requestAnimationFrame( ()=> this.main() );
		this.then = this.now;
	}
	start() {
		this.raf = requestAnimationFrame( ()=> this.main() );
	}
	end() {
		cancelAnimationFrame(this.raf);
	}
}

class Level {
	constructor() {
		this.path = 
		[
			[0,0],
			[16,0],
			[16,9],
			[0,9],
			[0,0],
			[16,0],
			[16,9],
			[0,9],
			[0,0]
		].map( (a) => new Vector(...a) )
	}
}

// const app = new App(new Level());
// app.start();
