import Vector from "./Vector";

const limiter = {
	[-1] : Math.max,
	[1]  : Math.min
}

export default class Walker {
	constructor(path_instructions : Array<Vector> = [new Vector()]) {
		this.position = path_instructions.shift();
		this.speed = 1;
		this.path_instructions = path_instructions;
		this.next_instruction();
		this.completed_path = false;
	}

	move(amount) {
		if(this.completed_path === true || this.current_instruction == undefined) return;

		console.log(`amount ${amount}`);
		let {x : nx, y : ny} = this.current_instruction;
		console.log(`nx ${nx} ny ${ny}`);
		console.log(`this.position`, this.position);
		let {x,y}        = this.position;
		console.log(`x ${x} y ${y}`);
		let moved_amount = this.speed * amount;
		console.log(`moved_amount ${moved_amount}`);

		this.position.x = this.limit(this.x_direction, moved_amount, x, nx);
		this.position.y = this.limit(this.y_direction, moved_amount, y, ny);

		if(this.position.x == nx && this.position.y == ny) {
			this.next_instruction();
		}
	}

	next_instruction() {

		if(this.path_instructions.length == 0)  {
			this.completed_path = true;
			return;
		}

		this.current_instruction = this.path_instructions.shift();

		console.log("this.current_instruction", this.current_instruction);

		let {x : nx, y : ny} = this.current_instruction;
		console.log(`nx ${nx} ny ${ny}`);
		console.log(`this.position`, this.position);
		let {x,y}        = this.position;
		console.log(`x ${x} y ${y}`);

		this.x_direction = Math.sign(x-nx) * -1;
		this.y_direction = Math.sign(y-ny) * -1;
	}

	limit(direction, amount, current_position, next_position) {
		if(Math.abs(direction) == 0) return current_position;
		return limiter[direction](current_position + amount * direction, next_position);
	}
}