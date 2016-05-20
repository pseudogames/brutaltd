export default class Enemy {

	constructor(path_instructions) {
		console.log("A new Enemy has come to life");

		this.position = {
			x : 0,
			y : 0
		}

		this.speed = 3;

		this.path_instructions = path_instructions;

		this.current_instruction = 0;

		this.last_move = {x : 0, y : 0};

		this.set_instruction();
	}

	move(amount) {

		//this.set_instruction();

		let [nx,ny] = this.path_instructions[this.current_instruction];
		let {x,y}   = this.position;
		let moved   = this.speed * amount;

		x += moved * this.x_direction;
		y += moved * this.y_direction;

		this.position = { x, y };

		// console.log(`Enemy.move: towards ${nx},${ny} by ${this.speed * amount}`);
		console.log(`Enemy.move current position: ${this.position.x},${this.position.y}`);
	}

	set_instruction(go_next) {
		if(go_next === true) {
			this.current_instruction++;
		}

		let [nx,ny] = this.path_instructions[this.current_instruction];
		let {x,y}   = this.position;

		this.x_direction = Math.sign(x-nx) * -1;
		this.y_direction = Math.sign(y-ny) * -1;
	}
}