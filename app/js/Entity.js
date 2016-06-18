import Vector from "./Vector";
import {Sheet,Frame,State} from "./Sprite";
import Render from "./Render";

export class Entity {
		
	constructor(pos : Vector, info : Object) {
		this.pos = pos;
		this.info = info;
		this.game = info.game;
		this.sheet = info.game.sheet;
		this.render = info.game.render;
		this.init();
		this.prepare_frame();
		this.prepare_pos();
	}

	init() {
		this.sprite = {
			state: {
				shape: this.info.shape
			},
			z_offset: this.sheet.get_z(this.info.shape)
		};
	}

	prepare_frame() {
		this.sprite.frame = this.sheet.get(this.sprite.state);
	}

	prepare_pos() {
		this.pos2d = this.render.pos2d(this.pos, this.sprite.z_offset);
	}

	draw() {
		this.render.blit(this.pos2d, this.sprite.frame);
	}
}

export class Still extends Entity {
	
}

export class Animated extends Entity {

	constructor(pos : Vector, info : Object) {
		super(pos, info);
	}

	init() {
		super.init();
		this.sprite.state.cycle = "idle";
		this.sprite.state.frame = 0;
	}

	tick(time : number) {
		// loop animation
		this.prepare_frame();
	}

}

export class Mob extends Animated {
	
	tick(time : number) {
		// move through the path
		//super.tick(time);
		this.prepare_frame();
		this.prepare_pos();
		return res;
	}
}

export class Tower extends Animated {

	constructor(pos : Vector, info : Object) {
		super(pos, info);
		this.rank = 0;
	}

	tick(time : number) {
		// point and shoot mobs on range
		//super.tick(time);
		this.prepare_frame();
		this.game.add(new Shot(this.pos,this.info));
		return res;
	}

	draw() {
		super.draw();
		if(this.rank > 0) {
			this.render.blit(this.pos2d, {shape: "rank"+this.rank});
		}
	}
}

export class Shot extends Animated {
	
	tick(time : number) {
		// balistic movement and collision check
		super.tick(time);
	}
}

// TODO Elevator

// TODO Clock
export class Clock extends Animated {

	constructor(pos : Vector, info : Object) {
		super(pos,info);
		console.log(arguments);
	}
}
