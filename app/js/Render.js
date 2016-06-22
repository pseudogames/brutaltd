import Vector from "./Vector";
import Bounds from "./Bounds";
import Tween from "./Tween";
import Grid from "./Grid";
import {Sheet,Frame} from "./Sprite";
import SortedSet from "./SortedSet";
import Entity from "./Entity";

export default class Render {

	constructor() {
		//this.debug = true;
		this.fps = 30;
		this.screen_canvas = document.createElement("canvas");
		this.screen_ctx = this.screen_canvas.getContext("2d");
		this.smooth(this.screen_ctx, false);

		this.click_canvas = document.createElement("canvas");
		this.click_ctx = this.click_canvas.getContext("2d");
		this.smooth(this.click_ctx, false);

		this.canvas = this.debug ? this.click_canvas : this.screen_canvas;
		document.body.appendChild(this.canvas);
	}

	setup(grid : Grid, sheet : Sheet) {
		this.grid = grid;
		this.sheet = sheet;
		this.projection = sheet.projection;

		this.scroll_rel = 0.5;
		this.scaler = new Tween(this, "scale", _ => this.rezoom(), this.fps);

		this.cleanup();
		this.entity    = new SortedSet((a,b) => a.pos2d.z - b.pos2d.z);
		this.clickable = new SortedSet((a,b) => a.pos2d.z - b.pos2d.z);

		this.resize(); // draw

		window.addEventListener('resize', this.resize.bind(this));

		this.timestamp = 0;
		this.delay = 1000 / this.fps;

		return this;
	}

	cleanup() {
		delete this.entity;
		delete this.clickable;
		this.scaler.cleanup();
		window.removeEventListener('resize', this.resize.bind(this));
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

		this.click_canvas.width  = this.viewport.x;
		this.click_canvas.height = this.viewport.y;

		this.rezoom();
	}

	project() {
		this.entity.forEach(e => e.project());
		// this.clickable is contained on entity
	}

	rezoom() {
		this.scroll_abs = Bounds.min(this.viewport.sub(this.bounds.size.scale(this.scale)), Vector.zero())
		this.size2d = this.sheet.size.scale(this.scale).floor();

		this.tint_canvas = document.createElement("canvas");
		this.tint_canvas.width  = this.size2d.x;
		this.tint_canvas.height = this.size2d.y;
		this.tint_ctx = this.tint_canvas.getContext("2d");
		this.smooth(this.tint_ctx, false);

		this.project();
		this.draw();
	}

	zoom() {
		this.scaler.animate(this.scaler.target == this.scale_in ? this.scale_out : this.scale_in);
	}

	scroll(y : number) {
		this.scroll_rel = Math.max(0,Math.min(1,this.scroll_rel + Math.sign(y)/12));
		this.project();
	}

	pos2d(pos3d : Vector, elevation : number) : Vector {
		return this.projection.project(pos3d, elevation)
			.add(this.origin)
			.scale(this.scale)
			.add(this.scroll_abs.scale(this.scroll_rel));
	}

	add(e : Entity) {
		this.entity.add(e);
		if(e.click || this.debug) this.clickable.add(e);
	}

	delete(e : Entity) {
		this.entity.delete(e);
		if(e.click || this.debug) this.clickable.delete(e);
	}

	smooth(ctx : CanvasRenderingContext2D, enabled : boolean) : void {
		if(ctx.imageSmoothingEnabled !== undefined) {
			ctx.imageSmoothingEnabled = enabled;
		} else {
			ctx.webkitImageSmoothingEnabled = enabled;
			ctx.mozImageSmoothingEnabled = enabled;
			ctx.msImageSmoothingEnabled = enabled;
			ctx.oImageSmoothingEnabled = enabled;
		}
	}

	draw_frame(pos2d : Vector, frame : Object, op : string = "source-over",
		ctx : CanvasRenderingContext2D = this.screen_ctx) : void
	{
		// FIXME declare frame as type Frame, 
		// 	for some reason this is not working now

		let {image, geometry:{x,y,w,h}} = frame;

		if(op) ctx.globalCompositeOperation = op;
		ctx.drawImage(
			image, x,y,w,h,
			pos2d.x,
			pos2d.y,
			this.size2d.x,
			this.size2d.y
		);
		if(op) ctx.globalCompositeOperation = "source-over";
	}

	blit_clickable(e : Entity, frame : Object = e.sprite.frame) : void {
		// FIXME declare frame as type Frame, 
		// 	for some reason this is not working now

		// XXX clickable elements cannot have alpha gradients

		let color = "#"+("00000"+(this.tint_color+=4).toString(16)).slice(-6);
		this.click_entity[color] = e;
		this.tint_ctx.fillStyle = color;
		this.tint_ctx.fillRect(0,0, this.size2d.x, this.size2d.y);
		this.draw_frame(Vector.zero(), frame, "destination-atop", this.tint_ctx);
		
		this.click_ctx.drawImage(
			this.tint_canvas,
			e.pos2d.x,
			e.pos2d.y
		);

	}

	blit_screen(e : Entity, frame : Object = e.sprite.frame) : void {
		// FIXME declare frame as type Frame, 
		// 	for some reason this is not working now

		this.draw_frame(e.pos2d, frame);

		if(e.highlight) {
			this.draw_frame(e.pos2d, frame, "lighter");
		}
	}

	click(ev : ?Event) {
		this.click_ctx.clearRect(0, 0, this.viewport.x, this.viewport.y);

		this.click_entity = {};
		this.tint_color = 1;
		this.blit = this.blit_clickable;
		this.clickable.forEach(e => e.draw());

		if(!ev || ev.button != 0) return;
		let p = this.click_ctx.getImageData(ev.x, ev.y, 1, 1).data; 
		let c = "#"+Array.prototype.slice.call(p,0,3).map(a => ("0"+(a).toString(16)).slice(-2)).join("");
		return this.click_entity[c];
	}

	text(pos2d: Vector, text : string) : void {
		this.screen_ctx.save();
		this.screen_ctx.fillStyle="#ffffff";
		this.screen_ctx.font="10px Arial";
		this.screen_ctx.textAlign="center";
		this.screen_ctx.shadowColor = "black";
		this.screen_ctx.shadowOffsetX = 1; 
		this.screen_ctx.shadowOffsetY = 1; 
		this.screen_ctx.shadowBlur = 3;
		this.screen_ctx.fillText(text, pos2d.x, pos2d.y);
		this.screen_ctx.restore();
	}

	draw() {
		let time = Date.now();
		if(time < this.timestamp + this.delay)
			return;
		this.timestamp = time;

		this.screen_ctx.clearRect(0, 0, this.viewport.x, this.viewport.y);
		this.blit = this.blit_screen;
		this.entity.forEach(e => e.draw());

		if(this.debug) this.click();
	}

}
