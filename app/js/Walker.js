import Vector from "./Vector";

const limiter = {
	[-1] : Math.max,
	[1]  : Math.min
}

export default class Walker {
	constructor(path_instructions : Array<Vector> = [new Vector()]) {
		this.position = new Vector(0,0,0);
		this.speed = 15;
		this.path_instructions = path_instructions;
		this.current_instruction = -1;
		this.next_instruction();
		this.completed_path = false;
	}

	move(amount) {
		if(this.completed_path === true) return;

		let {x : nx, y : ny} = this.path_instructions[this.current_instruction];
		let {x,y}        = this.position;
		let moved_amount = this.speed * amount;

		this.position.x = this.limit(this.x_direction, moved_amount, x, nx);
		this.position.y = this.limit(this.y_direction, moved_amount, y, ny);

		if(this.position.x == nx && this.position.y == ny) {
			if(this.current_instruction == this.path_instructions.length -1) {
				this.completed_path = true;
			} else {
				this.next_instruction();
			}
		}
	}

	next_instruction() {
		this.current_instruction++;

		let {x : nx, y : ny} = this.path_instructions[this.current_instruction];
		let {x,y}        = this.position;

		this.x_direction = Math.sign(x-nx) * -1;
		this.y_direction = Math.sign(y-ny) * -1;
	}

	limit(direction, amount, current_position, next_position) {
		if(Math.abs(direction) == 0) return current_position;
		return limiter[direction](current_position + amount * direction, next_position);
	}
}