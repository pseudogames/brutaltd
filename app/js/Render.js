import Vector from "./Vector";
import Bounds from "./Bounds";
import Tween from "./Tween";
import Grid from "./Grid";
import {Sheet,Frame} from "./Sprite";
import SortedSet from "./SortedSet";
import {Entity} from "./Entity";

export default class Render {

	constructor() {
		this.canvas = document.createElement("canvas");
		this.screen = this.canvas.getContext("2d");
		document.body.appendChild(this.canvas);
	}

	setup(grid : Grid, sheet : Sheet, state : Object) {
		this.grid = grid;
		this.sheet = sheet;
		this.hud = state;
		this.projection = sheet.projection;

		this.scroll_rel = 0.5;
		this.scaler = new Tween(this, "scale", _ => this.rezoom());

		this.cleanup();
		this.entity = new SortedSet((a,b) => a.pos2d.z - b.pos2d.z);

		this.resize(); // draw, request animation frame cycle

		this.resizer = _ => this.resize();
		this.zoomer = e => e.button == 1 && this.zoom();
		this.scroller = e => this.scroll(e.deltaY);

		window.addEventListener('resize', this.resizer);
		window.addEventListener('click', this.zoomer);
		window.addEventListener('wheel', this.scroller);
		// this.raf = requestAnimationFrame( this.draw.bind(this) );

		return this;
	}

	cleanup() {
		delete this.entity;
		// if(this.raf) {
		// 	cancelAnimationFrame(this.raf);
		// 	delete this.raf;
		// }
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

		this.bounds.max = this.bounds.max.add(this.sheet.size);
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

	prepare_pos() {
		this.entity.forEach(e => e.prepare_pos());
	}

	rezoom() {
		this.scroll_abs = Bounds.min(this.viewport.sub(this.bounds.size.scale(this.scale)), Vector.zero())
		this.size2d = this.sheet.size.scale(this.scale).floor();
		this.prepare_pos();
	}

	zoom() {
		this.scaler.animate(this.scaler.target == this.scale_in ? this.scale_out : this.scale_in);
	}

	scroll(y : number) {
		this.scroll_rel = Math.max(0,Math.min(1,this.scroll_rel + Math.sign(y)/12));
		this.prepare_pos();
	}

	pos2d(pos3d : Vector, z_offset : number) : Vector {
		return this.projection.project(pos3d, z_offset)
			.add(this.origin)
			.scale(this.scale)
			.add(this.scroll_abs.scale(this.scroll_rel));
	}

	
	add(e : Entity) {
		this.entity.add(e);
	}

	delete(e : Entity) {
		this.entity.delete(e);
	}

	blit(pos2d : Vector, frame : Object) : void {
		let {image, geometry:{x,y,w,h}} = frame;
		this.screen.drawImage(
			image, x,y,w,h,
			pos2d.x,
			pos2d.y,
			this.size2d.x,
			this.size2d.y
		);
	}

	draw() {
		this.screen.clearRect(0, 0, this.viewport.x, this.viewport.y);
		this.entity.forEach(e => e.draw());

		// TODO hud

	}

}

