import Walker from "./Walker";

export default class Wave {
	constructor(quantity, sprite, speed, grid_path){
		this.sprite    = sprite;
		this.quantity  = quantity;
		this.speed     = speed;
		this.grid_path = grid_path;
		this.queue     = [];
		return this;
	}
	start() {
		this.time_elapsed = 0;
		return this;
	}
	update(time_elapsed) {
		this.time_elapsed += time_elapsed;

		let delta = time_elapsed / 1000;

		if(this.time_elapsed > 1000 / this.speed && this.queue.length < this.quantity) {
			this.time_elapsed = 0;
			this.queue.push(new Walker(this.grid_path, this.speed));
		}

		for(let walker of this.queue) {
			walker.move(delta);
		}
	}
	is_finished() {
		if(this.queue.length > 0) {
			return this.queue.map(w => w.completed_path).reduce((l,c) => l && c, true);
		}
		return false;
	}
}