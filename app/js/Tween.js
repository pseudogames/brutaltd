
export default class Tween {
	constructor(obj : Object, key : string, change : Function, fps : number = 30) {
		this.object = obj;
		this.key = key;
		this.change = change;
		this.fps = fps;
	}

	cleanup() {
		if(this.timer) {
			clearTimeout(this.timer);
			this.timer = null;
		}
	}

	animate(target : number, factor : number = 0.2) {
		this.cleanup();

		this.target = target;

		var delay = 1000 / this.fps
		var dest = factor, src = 1-dest;
		var tick = _ => {
			this.object[this.key] = this.object[this.key] * src + this.target * dest;
			if(Math.abs(this.object[this.key] - this.target) < 0.01) {
				this.object[this.key] = this.target;
				this.timer = null;
			} else {
				this.timer = setTimeout(tick, delay);
			}
			this.change();
		};
		tick();
	}
}
