import Entity from "../Entity";
import Mobile from "./Mobile";
import Vector from "../Vector";
import Game   from "../Game";

export default class Mob extends Mobile {
	
	constructor(game : Game, pos : Vector, shape : string, info : Object) {
		let instructions = game.grid.path.slice().map(v => v.copy());

		super(game, instructions.shift(), shape, info);

		this.speed = info.speed;
		this.path_instructions = instructions;
		this.next_instruction();
		this.completed_path = false;
		this.moved_at = this.game.time.virtual;
	}

	move() {
		// move through the path

		if(this.completed_path === true || this.current_instruction == undefined) {
			this.game.lives --;
			return this.delete();
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

}

Entity.register(Mob);
