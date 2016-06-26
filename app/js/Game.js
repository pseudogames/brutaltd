import Vector  from "./Vector";
import Loader  from "./Loader";
import Grid    from "./Grid";
import {Sheet} from "./Sprite";
import Render  from "./Render";
import Entity  from "./Entity";

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

	add(e : Entity) : void {
		if(e.tick) this.entity.add(e);
	}

	delete(e : Entity) : void {
		if(e.tick) this.entity.delete(e);
		this.selector.delete(e);
		this.highlight.delete(e);
	}

	start(tier : number) {
		this.stop();

		this.selector = new Set();
		this.highlight = new Set();
		this.entity = new Set();
		this.tier  = this.info.tier[tier];
		this.resources = 10;

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
				this.delay_between_mobs = 1/60; // hours on analog clock

				this.render.setup(g,s);
				this.sheet.setup(this.time);
				this.grid.setup( (p,s) => Entity.load(this,p,s) );

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

	click(ev : Event) {
		if(this.highlight.size > 0) {
			this.highlight.forEach(e => e.blur());
		}

		let e = this.render.click(ev);
		if(e) {
			// click the top of the stack
			Array.from(this.grid.contact(e))
				.filter( e => e.click )
				.sort((a,b) => b.sprite.elevation - a.sprite.elevation)
				[0].click();
			
			// highlight the whole NEW stack
			Array.from(this.grid.contact(e))
				.filter( e => e.click )
				.forEach(e => e.focus());
		} else {
			this.selector.forEach(e => e.delete());
		}
	}

	clock(next : boolean = false) {
		const analog_to_virtual = 60000; // hour to millisec
		let time = Date.now();
		let real = time - this.time.start;
		let delta = real - this.time.real;
		this.time.real = real;
		this.time.delta =  delta * this.time.speed;
		this.time.virtual += this.time.delta;

		if(!this.running)
			return;

		if(next && this.wave.length > 0) {
			let s = this.wave[0].time - this.time.analog;
			if(s > this.delay_between_mobs)
				this.time.skip += s;
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

	spawn() : void {
		if(this.wave.length == 0)
			return;

		let wave = this.wave[0];
		if(wave.time < this.time.analog) {
			if(wave.quantity --> 0) {
				Entity.load(this, this.grid.path[0], 
					this.info.mobs[wave.entity]);
				wave.time += this.delay_between_mobs;
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

	collide(e : Entity) : ?Entity {
		let stack = this.grid.contact(e);
		if(stack == null || stack.size == 0)
			return null;
		stack = Array.from(stack)
			.filter((a) =>
				a != e &&
				a != e.info.parent &&
				a.sprite.elevation + a.pos.z >=
				e.sprite.elevation + e.pos.z 
			)
		if(stack.length == 0)
			return null;
		stack.sort((a,b) => b.sprite.elevation - a.sprite.elevation);
		console.log(stack[0]);
		return stack[0];
	}

	tick() : void {
		this.clock();

		if(!this.ended() && this.time.delta > 0) {
			this.spawn();

			this.entity.forEach(e => e.tick());
		}

		this.render.draw();
	}

	send_wave() {


	}
}
