import Vector  from "./Vector";
import Loader  from "./Loader";
import Grid    from "./Grid";
import {Sheet} from "./Sprite";
import Render  from "./Render";
import * as Entity  from "./Entity";


// Logic to send waves

export default class Game {

	constructor() {
		this.render = new Render();
		this.entity = new Set();
		this.time = {};

		// TODO: deal with exceptions
		Loader
			.json("game.json")
			.then(
				info  => this.init(info),
				error => console.log("error", error)
			);
	}


	init(info : Object) {
		this.info = info;
		this.start(0); // TODO menu to choose
	}

	stop() {
		if(this.time.interval) {
			clearInterval(this.time.interval);
			delete this.time.interval;
		}
	}

	add(e : Entity.Entity) : void {
		if(e.tick) this.entity.add(e);
		this.render.add(e);
		this.grid.add(e);
	}

	delete(e : Entity.Entity) : void {
		if(e.tick) this.entity.delete(e);
		this.render.delete(e);
		this.grid.delete(e);
	}

	deserialize(pos : Vector, serialized : string) : Entity.Entity {
		let [,shape,,type,info] = serialized.match(/^(\w+)(\s*:\s*(\w+)\(((.*))?\))?/)
		// for instance, "larry : Mob({health:10,speed:20})"

		if(!shape) {
			console.log("bad entity definition '"+serialized+"'");
			return null;
		}

		let Type = type ? Entity[type] :
			this.sheet.is_animated(shape) ? Entity.Animated : Entity.Still;

		if(Type.prototype instanceof Entity.Animated && !this.sheet.is_animated(shape))
			throw `type '${type}' is animated but shape '${shape}' is not check your 'grid/${this.tier.grid}.json' file`;

		info = info ? JSON.parse(info) : {};
		return new Type(pos, shape, this, info);
	}

	start(tier : number) {
		this.stop();

		this.tier  = this.info.tier[tier];
		this.waves = this.tier.wave.slice(); // copy
		if(!this.tier) {
			console.log("tier "+this.tier+" not found");
			return;
		}

		Promise.all([
			Sheet.load(this.tier.sheet),
			Grid.load(this.tier.grid)
		])
		.then(
			([s, g]) => {
				this.sheet = s;
				this.grid = g;
				this.clock(true);
				this.render.setup(g,s);
				this.sheet.setup(this.time);
				this.grid.setup( (p,e) => this.add( this.deserialize(p,e) ) );
				this.speed(1);
			},
			error => {
				console.log("loading tier "+tier+": "+error);
			}
		);
	}

	speed(s : number) : void {
		this.stop();
		this.time.speed = s;
		let d = Math.floor(this.sheet.delay / s);
		if(d > 0) {
			this.time.interval = setInterval(this.tick.bind(this), d);
		}
	}

	clock(reset : ?boolean = false) {
		let time = Date.now();
		if(reset) {
			this.time.speed = 1;
			this.time.start = time;
			this.time.real = 0;
			this.time.virtual = 0;
		}
		let real = time - this.time.start;
		let delta = real - this.time.real;
		this.time.real = real;
		this.time.virtual += delta * this.time.speed;
		this.time.animation = this.time.virtual;
		this.time.analog = this.time.virtual / 60000 + 7;
		let hh = ""+Math.floor(this.time.analog);
		let mm = ""+(Math.floor(this.time.analog * 60) % 60);
		this.time.digital = hh+":"+(mm.length == 1 ? "0" : "")+mm;
		document.getElementById("clock").innerText = this.time.digital; // FIXME
	}

	tick() : void {
		this.clock();

		this.entity.forEach(e => e.tick());

		this.render.draw();
	}

	send_wave() {
		if(this.waves.length == 0) {
			this.stop(); // TODO winning screen
			return;
		}

		let [quantity, entity, schedule, meeting] = this.waves.shift();
		while(quantity --> 0) {
			this.add( this.deserialize(this.grid.path[0], entity) );
		}

	}
}
