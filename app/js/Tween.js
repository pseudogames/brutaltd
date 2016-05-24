
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
		var that = this;
		var tick = function() {
			that.object[that.key] = that.object[that.key] * src + that.target * dest;
			if(Math.abs(that.object[that.key] - that.target) < 0.01) {
				that.object[that.key] = that.target;
				that.timer = null;
			} else {
				that.timer = setTimeout(tick, delay);
			}
			that.change();
		};
		tick();
	}
}
