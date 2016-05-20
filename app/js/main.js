'use strict';

// import Grid from "./_grid";
// import Render from "./_render";
// import Vector from "./_vector";

import Enemy from "./Enemy";

// Create the canvas
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
canvas.height = canvas.width = 512;
document.body.appendChild(canvas);

const e = new Enemy([
	[0,1],
	[0,32],
	[32,32],
	[32,0],
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

		if(this.time_elapsed > 20000) {
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

// let grid = new Grid(32,32);
// let render = new Render(grid, ctx);

// for(var y=0; y<grid.h; y++) {
// 	for(var x=0; x<grid.w; x++) {
// 		render.plot(new Vector(x,y,0));
// 	}
// }