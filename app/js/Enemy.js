export default class Enemy {

	constructor(path_instructions) {
		console.log("A new Enemy has come to life");

		this.position = {
			x : 0,
			y : 0
		}

		this.speed = 3;

		this.path_instructions = path_instructions;

		this.current_instruction = null;

		this.set_instruction();
	}

	move(amount) {
		let [nx,ny] = this.path_instructions[this.current_instruction];
		let {x,y}   = this.position;
		let moved   = this.speed * amount;

		x = this.limit(this.x_direction, moved, x, nx);
		y = this.limit(this.y_direction, moved, y, ny);

		this.position = { x, y };

		if(x == nx && y == ny) {
			if(this.current_instruction < this.path_instructions.length -1) {
				this.set_instruction();
			}
		}

		console.log(`Enemy.move current position: ${this.position.x},${this.position.y}`);
	}

	set_instruction() {
		console.log(`Enemy.move.set_instruction`);
		if(this.current_instruction === null ) this.current_instruction = -1;

		this.current_instruction++;

		let [nx,ny] = this.path_instructions[this.current_instruction];
		let {x,y}   = this.position;

		this.x_direction = Math.sign(x-nx) * -1;
		this.y_direction = Math.sign(y-ny) * -1;
	}

	limit(direction, amount, current_position, next_position) {
		let new_position = current_position;
		if(direction < 0) {
			new_position = Math.max(current_position + amount * direction, next_position);
		} else {
			new_position = Math.min(current_position + amount * direction, next_position);
		}
		return new_position;
	}
}