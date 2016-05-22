import Vector from "./Vector";
import Box from "./Box";

export default class Render {

	constructor(grid,sprites,projection) {
		this.grid = grid; // Grid
		this.sprites = sprites; // Sprites
		this.projection = projection; // Ortho
		this.canvas = document.createElement("canvas");
		this.screen = this.canvas.getContext("2d");
		document.body.appendChild(this.canvas);
		this.resize();
	}

	resize() {

		this.viewport = new Vector(
			this.canvas.width  = window.innerWidth,
			this.canvas.height = window.innerHeight
		);
		console.log(this.viewport);

		this.bounds = {
			min: new Vector(Number.MAX_VALUE, Number.MAX_VALUE),
			max: new Vector(0, 0)
		};

		for(let z=0; z<this.grid.size.z; z+=Math.max(1,this.grid.size.z-1)) {
			for(let y=0; y<this.grid.size.y; y+=Math.max(1,this.grid.size.y-1)) {
				for(let x=0; x<this.grid.size.x; x+=Math.max(1,this.grid.size.x-1)) {
					let p = this.projection.project(new Vector(x,y,z));
					this.bounds.min = Box.min(this.bounds.min, p);
					this.bounds.max = Box.max(this.bounds.max, p);
				}
			}
		}

		this.bounds.max = this.bounds.max.add(this.sprites.size);
		this.bounds.size = this.bounds.max.sub(this.bounds.min);

		this.origin = this.projection.project(Vector.zero()).sub(this.bounds.min);

		let s = Box.norm(this.viewport, this.bounds.size);
		this.scale = Math.min(s.x, s.y);

		this.draw();
	}

	grid_to_canvas(grid_pos) {
		return this.projection.project(grid_pos).add(this.origin).scale(this.scale);
	}

	plot(grid_pos, color) {
		let canvas_pos = this.grid_to_canvas(grid_pos);
		if(!color) color = "rgb("+Box.norm(grid_pos,this.grid.size).scale(255).floor().toString()+")";
		this.screen.fillStyle = color;
		this.screen.fillRect(canvas_pos.x, canvas_pos.y, 3,3);
	}

	draw() {
		this.screen.clearRect(0, 0, this.viewport.width, this.viewport.height);
		for(let z=0; z<this.grid.size.z; z++) {
			for(let y=0; y<this.grid.size.y; y++) {
				for(let x=0; x<this.grid.size.x; x++) {
					this.plot(new Vector(x,y,z));
				}
			}
		}
	}

}

