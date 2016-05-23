'use strict';

import Enemy from "./Enemy";

import Vector from "./Vector";
import Ortho from "./Ortho";
import Grid from "./Grid";
import Sprites from "./Sprites";
import Render from "./Render";

// Create the canvas
// const canvas = document.createElement("canvas");
// const ctx = canvas.getContext("2d");
// canvas.height = canvas.width = 512;
// document.body.appendChild(canvas);

let grid = new Grid(new Vector(16,9,4));
let sprites = new Sprites(new Vector(66,96));
let render = new Render(grid, sprites,
	new Ortho(
		new Vector( 46.55, 17.88),
		new Vector(-18.44, 45.00),
		new Vector(  0   ,-31.55)
	)
);

const e = new Enemy([
	[0,16],
	[16,16],
	[16,20],
	[0,20],
	[0,25],
	[16,25],
	[32,25],
	[32,32],
	[16,32],
	[16,16],
	[16,0],
	[0,0]
]);

class App {
	constructor() {
		this.then  = Date.now();
		this.now   = Date.now();
	}
	main () {
		this.now = Date.now();

		let delta = (this.now - this.then) / 1000;

		this.time_elapsed += 1000;

		e.move(delta);

		this.then = this.now;

		render.plot(e.position, "#F90000");

		if(e.completed_path) {
			this.end();
		} else {
			this.raf = requestAnimationFrame( ()=> this.main() );
		}
	}
	start() {
		this.time_elapsed = 0;
		this.raf = requestAnimationFrame( ()=> this.main() );
	}
	end() {
		cancelAnimationFrame(this.raf);
	}
}

const app = new App();
app.start();