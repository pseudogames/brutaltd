import Vector from "./Vector";
import {Sheet,Frame,State} from "./Sprite";
import Render from "./Render";
import Game   from "./Game";

export class Entity {
		
	constructor(pos : Vector, shape : string, game : Game, info : Object) {
		this.pos = pos;
		this.info = info;
		this.game = game;
		this.sheet = game.sheet;
		this.render = game.render;
		this.sprite = {
			state: this.sheet.initial_state(this.game.time, shape),
			z_offset: this.sheet.get_z(shape)
		};
		this.prepare_frame();
		this.prepare_pos();
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

	constructor(pos : Vector, shape : string, game : Game, info : Object) {
		super(pos, shape, game, info);
	}

	tick() {
		// loop animation
		
		if(this.sheet.animate(this.game.time, this.sprite.state)) {
			this.prepare_frame();
		}
	}

}

export class Mob extends Animated {
	
	constructor(pos : Vector, shape : string, game : Game, info : Object) {
		let instructions = game.grid.path.slice().map(v => Vector.copy(v));

		super(instructions.shift(), shape, game, info);

		this.speed = info.speed;
		this.path_instructions = instructions;
		this.next_instruction();
		this.completed_path = false;
	}

	move(amount) {
		if(this.completed_path === true || this.current_instruction == undefined) return this.remove();

		let {x : nx, y : ny} = this.current_instruction;
		let {x,y}        = this.pos;
		let moved_amount = this.speed * amount;

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
	}

	tick() {
		// move through the path
		//super.tick();
		this.move(1);
		this.prepare_frame();
		this.prepare_pos();
	}
}

export class Tower extends Animated {

	constructor(pos : Vector, shape : string, game : Game, info : Object) {
		super(pos, shape, game, info);
		this.rank = 0;
	}

	tick() {
		// point and shoot mobs on range
		//super.tick();
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
	
	tick() {
		// balistic movement and collision check
		super.tick();
	}
}

export class Clock extends Animated {
	// TODO Clock
}

// TODO Elevator

