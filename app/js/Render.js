import Vector from "./Vector";
import Bounds from "./Bounds";
import Tween from "./Tween";
import Grid from "./Grid";
import Sprites from "./Sprites";

export default class Render {

	constructor() {
		this.canvas = document.createElement("canvas");
		this.screen = this.canvas.getContext("2d");
		document.body.appendChild(this.canvas);
	}

	setup(grid : Grid, sprites : Sprites) {
		this.grid = grid;
		this.sprites = sprites;
		this.projection = this.sprites.projection;
		this.queue = [];

		this.scroll_rel = 0.5;
		this.scaler = new Tween(this, "scale", _ => this.rezoom());

		this.cleanup();

		this.resize();

		this.resizer = _ => this.resize();
		this.zoomer = e => e.button == 1 && this.zoom();
		this.scroller = e => this.scroll(e.deltaY);

		window.addEventListener('resize', this.resizer);
		window.addEventListener('click', this.zoomer);
		window.addEventListener('wheel', this.scroller);

		return this;
	}

	cleanup() {
		this.scaler.cleanup();
		window.removeEventListener('resize', this.resizer);
		window.removeEventListener('click', this.zoomer);
		window.removeEventListener('wheel', this.scroller);
	}

	resize() {
		this.viewport = new Vector(
			this.canvas.width  = window.innerWidth,
			this.canvas.height = window.innerHeight
		);

		this.bounds = {
			min: new Vector(Number.MAX_VALUE, Number.MAX_VALUE),
			max: new Vector(0, 0)
		};

		for(let z=0; z<this.grid.size.z; z+=Math.max(1,this.grid.size.z-1)) {
			for(let y=0; y<this.grid.size.y; y+=Math.max(1,this.grid.size.y-1)) {
				for(let x=0; x<this.grid.size.x; x+=Math.max(1,this.grid.size.x-1)) {
					let p = this.projection.project(new Vector(x,y,z));
					this.bounds.min = Bounds.min(this.bounds.min, p);
					this.bounds.max = Bounds.max(this.bounds.max, p);
				}
			}
		}

		this.bounds.max = this.bounds.max.add(this.sprites.size);
		this.bounds.size = this.bounds.max.sub(this.bounds.min);

		this.origin = this.projection.project(Vector.zero()).sub(this.bounds.min);

		let s = Bounds.norm(this.viewport, this.bounds.size);
		let so = Math.min(s.x, s.y);
		let si = Math.max(s.x, s.y);
		this.scale = this.scaler.target = 
			this.scaler.target && this.scaler.target === this.scale_in ? si : so;
		this.scale_out = so;
		this.scale_in  = si;

		this.rezoom();
	}

	rezoom() {
		this.scroll_abs = Bounds.min(this.viewport.sub(this.bounds.size.scale(this.scale)), Vector.zero())
		this.sprite_size = this.sprites.size.scale(this.scale).floor();
		this.begin(); this.draw(); this.end();
	}

	zoom() {
		this.scaler.animate(this.scaler.target == this.scale_in ? this.scale_out : this.scale_in);
	}

	scroll(y : number) {
		this.scroll_rel = Math.max(0,Math.min(1,this.scroll_rel + Math.sign(y)/8));
		this.begin(); this.draw(); this.end();
	}

	grid_to_canvas(grid_pos : Vector) : Vector {
		return this.projection.project(grid_pos)
			.add(this.origin)
			.scale(this.scale)
			.add(this.scroll_abs.scale(this.scroll_rel));
	}

	begin() {
		this.queue = [];
	}

	plot(grid_pos : Vector, color : string = "rgba("+Bounds.norm(grid_pos,this.grid.size).scale(255).floor().toString()+",0.5)") {
		let canvas_pos = this.grid_to_canvas(grid_pos).floor();
		this.queue.push({z: canvas_pos.z, f: _ => {
			this.screen.fillStyle = color;
			this.screen.fillRect(canvas_pos.x, canvas_pos.y, this.sprite_size.x, this.sprite_size.y);
		}});;
	}

	sprite(grid_pos : Vector, entity : string, state : string = "", frame : number = 0) {
		var {img, geometry:{x,y,z,w,h}} = this.sprites.get(entity, state, frame);
		let canvas_pos = this.grid_to_canvas(grid_pos);
		let layer = canvas_pos.add(this.projection.project(new Vector(0,0,z)).scale(this.scale));
		this.queue.push({z: canvas_pos.z + layer.z, f: _ => {
			this.screen.drawImage(img, x,y,w,h, canvas_pos.x, canvas_pos.y, this.sprite_size.x, this.sprite_size.y);
		}});;
	}

	end() {
		this.screen.clearRect(0, 0, this.viewport.x, this.viewport.y);
		this.queue.sort((a,b) => a.z - b.z).forEach(d => d.f());
	}

	draw() {
		// this.begin();

		for(let z=0; z<this.grid.size.z; z++) {
			for(let y=0; y<this.grid.size.y; y++) {
				for(let x=0; x<this.grid.size.x; x++) {
					let p = new Vector(x,y,z);
					let frame = Math.floor(Date.now() / 300) % 3;
					this.grid.get(p).forEach(e => e == "lava" ? this.sprite(p, e, "still", frame) : this.sprite(p, e) );
				}
			}
		}

		// this.end();
	}

}

