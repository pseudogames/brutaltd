import Vector from "./Vector";
import Bounds from "./Bounds";
import Tween from "./Tween";
import Grid from "./Grid";
import {Sheet,Frame} from "./Sprite";
import SortedSet from "./SortedSet";
import {Entity} from "./entity/Entity";

export default class Render {

	constructor() {
		// this.debug = true;
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

		this.resize(); // draw, request animation frame cycle

		this.resizer = _ => this.resize();
		this.zoomer = e => e.button == 1 && this.zoom();
		this.scroller = e => this.scroll(e.deltaY);
		this.clicker = e => this.click(e);

		window.addEventListener('resize', this.resizer);
		this.canvas.addEventListener('click', this.zoomer);
		this.canvas.addEventListener('click', this.clicker);
		this.canvas.addEventListener('wheel', this.scroller);
		// this.raf = requestAnimationFrame( this.draw.bind(this) );

		this.timestamp = 0;
		this.delay = 1000 / this.fps;

		return this;
	}

	cleanup() {
		delete this.entity;
		delete this.clickable;
		// if(this.raf) {
		// 	cancelAnimationFrame(this.raf);
		// 	delete this.raf;
		// }
		this.scaler.cleanup();
		window.removeEventListener('resize', this.resizer);
		this.canvas.removeEventListener('click', this.zoomer);
		this.canvas.removeEventListener('click', this.clicker);
		this.canvas.removeEventListener('wheel', this.scroller);
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

	pos2d(pos3d : Vector, z_offset : number) : Vector {
		return this.projection.project(pos3d, z_offset)
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

	blit_tinted(pos2d : Vector, frame : Object, e : Entity) : void {
		if(this.tint_index >= Render.palette.length) {
			throw "not enough color ids for that many clickable entities";
		}
		let color = Render.palette[this.tint_index++];
		this.tint_ctx.fillStyle = color;
		this.tint_ctx.globalCompositeOperation = "source-over";
		this.tint_ctx.fillRect(0,0,this.size2d.x, this.size2d.y);
		this.tint_ctx.globalCompositeOperation = "destination-atop";
		this.click_map[color] = e;

		let {image, geometry:{x,y,w,h}} = frame;

		this.tint_ctx.drawImage(
			image, x,y,w,h,
			0,0,
			this.size2d.x,
			this.size2d.y
		);
		
		this.click_ctx.drawImage(
			this.tint_canvas,
			pos2d.x,
			pos2d.y
		);

	}

	blit_normal(pos2d : Vector, frame : Object, e : Entity) : void {
		let {image, geometry:{x,y,w,h}} = frame;
		this.screen_ctx.drawImage(
			image, x,y,w,h,
			pos2d.x,
			pos2d.y,
			this.size2d.x,
			this.size2d.y
		);
	}

	click(ev : ?Event) {
		this.click_ctx.clearRect(0, 0, this.viewport.x, this.viewport.y);

		this.click_map = {};
		this.tint_index = 0;
		this.blit = this.blit_tinted;
		this.clickable.forEach(e => e.draw());

		if(!ev || ev.button != 0) return;
		let p = this.click_ctx.getImageData(ev.x, ev.y, 1, 1).data; 
		let c = "#"+Array.prototype.slice.call(p,0,3).map(a => ("0"+(a).toString(16)).slice(-2)).join("").toUpperCase();
		let e = this.click_map[c];
		if(this.debug) console.log(e.x,e.y,c,e);
		if(e) e.click();
	}

	draw() {
		let time = Date.now();
		if(time < this.timestamp + this.delay)
			return;
		this.timestamp = time;

		this.screen_ctx.clearRect(0, 0, this.viewport.x, this.viewport.y);
		this.blit = this.blit_normal;
		this.entity.forEach(e => e.draw());

		if(this.debug) this.click();

	}

}

Render.palette = [
	"#FFFF00", "#1CE6FF", "#FF34FF", "#FF4A46", "#008941",
	"#006FA6", "#A30059", "#FFDBE5", "#7A4900", "#0000A6",
	"#63FFAC", "#B79762", "#004D43", "#8FB0FF", "#997D87",
	"#5A0007", "#809693", "#FEFFE6", "#1B4400", "#4FC601",
	"#3B5DFF", "#4A3B53", "#FF2F80", "#61615A", "#BA0900",
	"#6B7900", "#00C2A0", "#FFAA92", "#FF90C9", "#B903AA",
	"#D16100", "#DDEFFF", "#000035", "#7B4F4B", "#A1C299",
	"#300018", "#0AA6D8", "#013349", "#00846F", "#372101",
	"#FFB500", "#C2FFED", "#A079BF", "#CC0744", "#C0B9B2",
	"#C2FF99", "#00489C", "#6F0062", "#0CBD66", "#EEC3FF",
	"#456D75", "#B77B68", "#7A87A1", "#788D66", "#885578",
	"#FAD09F", "#FF8A9A", "#D157A0", "#BEC459", "#456648",
	"#0086ED", "#886F4C", "#34362D", "#B4A8BD", "#00A6AA",
	"#452C2C", "#636375", "#A3C8C9", "#FF913F", "#938A81",
	"#575329", "#00FECF", "#B05B6F", "#8CD0FF", "#3B9700",
	"#04F757", "#C8A1A1", "#1E6E00", "#7900D7", "#A77500",
	"#6367A9", "#A05837", "#6B002C", "#772600", "#D790FF",
	"#9B9700", "#549E79", "#FFF69F", "#72418F", "#BC23FF",
	"#99ADC0", "#3A2465", "#922329", "#5B4534", "#FDE8DC",
	"#404E55", "#0089A3", "#CB7E98", "#A4E804", "#324E72",
	"#6A3A4C", "#83AB58", "#D1F7CE", "#004B28", "#C8D0F6",
	"#A3A489", "#806C66", "#BF5650", "#E83000", "#66796D",
	"#DA007C", "#FF1A59", "#8ADBB4", "#5B4E51", "#C895C5",
	"#320033", "#FF6832", "#66E1D3", "#CFCDAC", "#D0AC94",
	"#7ED379", "#012C58", "#7A7BFF", "#D68E01", "#353339",
	"#78AFA1", "#FEB2C6", "#75797C", "#837393", "#943A4D",
	"#B5F4FF", "#D2DCD5", "#9556BD", "#6A714A", "#02525F",
	"#0AA3F7", "#E98176", "#DBD5DD", "#5EBCD1", "#3D4F44",
	"#7E6405", "#02684E", "#962B75", "#8D8546", "#9695C5",
	"#E773CE", "#D86A78", "#3E89BE", "#CA834E", "#518A87",
	"#5B113C", "#55813B", "#E704C4", "#00005F", "#A97399",
	"#4B8160", "#59738A", "#FF5DA7", "#F7C9BF", "#643127",
	"#513A01", "#6B94AA", "#51A058", "#A45B02", "#E20027",
	"#E7AB63", "#4C6001", "#9C6966", "#64547B", "#97979E",
	"#006A66", "#391406", "#F4D749", "#0045D2", "#006C31",
	"#DDB6D0", "#7C6571", "#9FB2A4", "#00D891", "#15A08A",
	"#BC65E9", "#FFFFFE", "#C6DC99", "#203B3C", "#671190",
	"#6B3A64", "#F5E1FF", "#FFA0F2", "#CCAA35", "#374527",
	"#8BB400", "#797868", "#C6005A", "#3B000A", "#C86240",
	"#29607C", "#402334", "#7D5A44", "#CCB87C", "#B88183",
	"#AA5199", "#B5D6C3", "#A38469", "#9F94F0", "#A74571",
	"#B894A6", "#71BB8C", "#00B433", "#789EC9", "#6D80BA",
	"#953F00", "#5EFF03", "#E4FFFC", "#1BE177", "#BCB1E5",
	"#76912F", "#003109", "#0060CD", "#D20096", "#895563",
	"#5B3213", "#A76F42", "#89412E", "#1A3A2A", "#494B5A",
	"#A88C85", "#F4ABAA", "#A3F3AB", "#00C6C8", "#EA8B66",
	"#958A9F", "#BDC9D2", "#9FA064", "#BE4700", "#658188",
	"#83A485", "#453C23", "#47675D", "#3A3F00", "#DFFB71",
	"#868E7E", "#98D058", "#6C8F7D", "#D7BFC2", "#3C3E6E",
	"#D83D66", "#2F5D9B", "#6C5E46", "#D25B88", "#5B656C",
	"#00B57F", "#545C46", "#866097", "#365D25", "#252F99",
	"#00CCFF", "#674E60", "#FC009C", "#92896B", "#FFFFFF"
];

