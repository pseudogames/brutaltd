import Vector from "./Vector";
import {Sheet,Frame,State} from "./Sprite";
import Render from "./Render";
import Game   from "./Game";

export class Entity {
		
	constructor(game : Game, pos : Vector, shape : string, info : Object) {
		this.pos = pos;
		this.info = info;
		this.game = game;
		this.grid = game.grid;
		this.sheet = game.sheet;
		this.render = game.render;
		this.highlight = false;
		this.sprite = {
			state: this.sheet.initial_state(shape),
			elevation: this.sheet.get_elevation(shape)
		};
		this.init();
		this.frame();
		this.project();
	}

	init() {
	}

	focus() {
		this.highlight = true;
		this.game.selected.add(this);
		console.log("focus",this);
	}

	blur() {
		this.highlight = false;
		this.game.selected.delete(this);
	}

	frame() {
		this.sprite.frame = this.sheet.get(this.sprite.state);
	}

	project() {
		this.pos2d = this.render.pos2d(this.pos, this.sprite.elevation);
	}

	draw() {
		this.render.blit(this);
	}
}

export class Still extends Entity {
	
}

export class Animated extends Entity {

	tick() {
		// loop animation
		if(this.sheet.animate(this.sprite.state, this.info.speed || 1)) {
			this.frame();
		}
	}

}

export class Site extends Animated {

	click() {
		this.game.add(new Tower(this.game,this.pos,"tower1",
			{shot:{damage:1, speed: 1, shape: "mob1"}}));
	}

}


export class Mobile extends Animated {

	init() {
		this.vel = this.info.vel;
	}

	move() {
		this.pos = this.pos.add(this.vel.scale(this.game.time.delta / 1000));
	}

	tick() {
		super.tick();
		if(!this.grid.move(this, this.move.bind(this))) {
			this.game.delete(this);
		}
		this.project();
	}
}


export class Mob extends Mobile {
	
	constructor(game : Game, pos : Vector, shape : string, info : Object) {
		let instructions = game.grid.path.slice().map(v => v.copy());

		super(game, instructions.shift(), shape, info);

		this.speed = info.speed;
		this.path_instructions = instructions;
		this.next_instruction();
		this.completed_path = false;
		this.moved_at = this.game.time.virtual;
		Mob.count ++;
	}

	move() {
		// move through the path

		if(this.completed_path === true || this.current_instruction == undefined) {
			this.game.lives --;
			return this.remove();
		}

		let {x : nx, y : ny} = this.current_instruction;
		let {x,y}        = this.pos;
		let moved_amount = this.speed * this.game.time.delta / 1000;

		this.pos.x = this.limit(this.direction.x, moved_amount, x, nx);
		this.pos.y = this.limit(this.direction.y, moved_amount, y, ny);

		if(this.pos.x == nx && this.pos.y == ny) {
			this.next_instruction();
		}
	}

	next_instruction() {
		if(this.path_instructions.length == 0)  {
			this.completed_path = true;
			return;
		}

		this.current_instruction = this.path_instructions.shift();
		this.direction = this.current_instruction.sub(this.pos).sign();
	}

	limit(direction, amount, current_position, next_position) {
		if(Math.abs(direction) == 0) return current_position;
		return {[-1] : Math.max, [1]  : Math.min }[direction](current_position + amount * direction, next_position);
	}

	remove() {
		this.game.delete(this);
		Mob.count --;
	}

}

export class Tower extends Animated {

	constructor(game : Game, pos : Vector, shape : string, info : Object) {
		super(game, pos, shape, info);
		this.rank = 0;
		this.forward = new Vector(1,0,0.2);
		this.target = null;
		this.shot_at = this.game.time.virtual;
	}

	click() {
		// TODO upgrade tower
		this.game.delete(this);
	}

	tick() {
		// point and shoot mobs on range
		super.tick();

		let delay = 1000 / (this.info.shot.rate || 1);
		if(this.game.time.virtual > this.shot_at + delay) {
			this.shot_at = this.game.time.virtual;
			this.game.add(new Shot(
				this.game,
				this.pos,
				this.info.shot.shape || this.sprite.state.shape+"_shot",
				{
					damage: this.info.shot.damage || 1,
					vel: this.forward.scale(this.info.shot.speed || 1)
				}
			));
		}
	}

	draw() {
		super.draw();
		if(this.rank > 0) {
			this.render.blit(this, {shape: "rank"+this.rank});
		}
	}
}

export class Shot extends Mobile {

	move() {
		// balistic movement and collision check
		this.vel = this.vel.scale(0.999);
		super.move();
	}

}

export class Clock extends Animated {
	// TODO Clock
}

// TODO Elevator

