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
		this.state = { score: 0 };

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

	end() {
		if(this.timer) {
			clearInterval(this.timer);
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
		this.end();
		this.opening = Date.now();
		this.time = 0;
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
				this.render.setup(g,s,this.state);
				this.grid.forEachItem( (p,e) => this.add( this.deserialize(p,e) ) );
				this.timer = setInterval(this.tick.bind(this), this.sheet.delay);
				this.send_wave(); // TODO button to start
			},
			error => {
				console.log("loading tier "+tier+": "+error);
			}
		);
	}

	tick() : void {
		this.time = Date.now() - this.opening;

		this.entity.forEach(e => e.tick());

		this.render.draw();
	}

	send_wave() {
		if(this.waves.length == 0) {
			this.end(); // TODO winning screen
			return;
		}

		let [quantity, entity, schedule, meeting] = this.waves.shift();
		while(quantity --> 0) {
			this.add( this.deserialize(this.grid.path[0], entity) );
		}

	}
}
