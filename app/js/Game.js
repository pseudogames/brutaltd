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
		this.time = {};
		this.running = false;

		// TODO: deal with exceptions
		Loader
			.json("game.json")
			.then(
				info  => this.init(info),
				error => { throw "error loading game: "+error }
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
			throw "bad entity definition '"+serialized+"'";
		}

		let Type = type ? Entity[type] :
			this.sheet.is_animated(shape) ? Entity.Animated : Entity.Still;

		if(!Type) {
			throw `type '${type}' does not exist, review 'grid/${this.tier.grid}.json' file`;
		}
		if(Type.prototype instanceof Entity.Animated && !this.sheet.is_animated(shape)) {
			throw `type '${type}' is animated but shape '${shape}' is not check 'grid/${this.tier.grid}.json' file`;
		}

		info = info ? JSON.parse(info.replace(/'/g,'"')) : {};
		return new Type(this, pos, shape, info);
	}

	start(tier : number) {
		this.stop();

		this.entity = new Set();
		this.tier  = this.info.tier[tier];

		if(!this.tier) {
			throw "tier "+this.tier+" not found";
		}

		this.lives = this.tier.lives;
		this.wave = this.tier.wave.map(wave => {
			let [quantity, entity, schedule, meeting] = wave;
			return {
				quantity: quantity,
				entity:   entity,
				schedule: schedule,
				time: schedule,
				meeting:  meeting
			};
		});

		Promise.all([
			Sheet.load(this.tier.sheet),
			Grid.load(this.tier.grid)
		])
		.then(
			([s, g]) => {
				this.sheet = s;
				this.grid = g;

				this.time.start = Date.now();
				this.time.real = 0;
				this.time.virtual = 0;
				this.time.animation = 0;
				this.time.skip = 0;
				this.time.open = this.wave[0].schedule - 1;

				this.render.setup(g,s);
				this.sheet.setup(this.time);
				this.grid.setup( (p,e) => this.add( this.deserialize(p,e) ) );

				this.running = true;
				this.speed(1);
			},
			error => {
				throw "loading tier "+tier+": "+error;
			}
		);
	}

	speed(s : number) : void {
		if(!this.sheet || this.sheet.delay == 0)
			return;
		this.stop();
		this.time.speed = s;
		let d = Math.floor(this.sheet.delay / s);
		if(d > 0) {
			this.time.interval = setInterval(this.tick.bind(this), d);
		}
	}

	clock(next : boolean = false) {
		const analog_to_virtual = 60000; // hour to millisec
		let time = Date.now();
		let real = time - this.time.start;
		let delta = real - this.time.real;
		this.time.real = real;
		this.time.virtual += delta * this.time.speed;

		if(!this.running)
			return;

		if(next && this.wave.length > 0) {
			this.time.skip += this.wave[0].time - this.time.analog;
		}
		this.time.analog = this.time.virtual / analog_to_virtual + this.time.open + this.time.skip;

		let hh = ""+Math.floor(this.time.analog);
		let mm = ""+(Math.floor(this.time.analog * 60) % 60);
		this.time.digital = hh+":"+("0"+mm).slice(-2);
		document.getElementById("clock").innerText = this.time.digital + 
				(this.wave.length == 0 ? "" :
					" (" + this.wave[0].schedule + "h " + 
						this.wave[0].meeting + ") ");
	}

	next() : void {
		if(!this.running || !this.wave || this.wave.length == 0)
			return;
		this.clock(true);
	}

	arrival() : void {
		if(this.wave.length == 0)
			return;

		let wave = this.wave[0];
		if(wave.time < this.time.analog) {
			if(wave.quantity --> 0) {
				this.add( this.deserialize(this.grid.path[0], wave.entity) );
				wave.time += 1/60;
			} else {
				this.wave.shift();
			}
		}
	}

	ended() : boolean {
		if(this.running) {
			let result;
			if(this.wave.length == 0 && Entity.Mob.count == 0) {
				result = "won";
				this.running = false;
			} else if(this.lives <= 0) {
				result = "lost";
				this.running = false;
			} else {
				result = this.lives + " lives";
			}
			document.getElementById("state").innerText = result;
		}
		return !this.running;
	}

	tick() : void {
		this.clock();

		if(!this.ended()) {
			this.arrival();

			this.entity.forEach(e => e.tick());
		}

		this.render.draw();
	}

	send_wave() {


	}
}
