
export default class Tween {
	constructor(obj,key,change,fps) {
		this.object = obj; // Object
		this.key = key; // String
		this.change = change; // Function
		this.fps = fps || 30; // Number
	}

	cleanup() {
		if(this.timer) {
			clearTimeout(this.timer);
			this.timer = null;
		}
	}

	animate(target,factor,fps) {
		this.cleanup();

		this.target = target;

		var delay = 1000 / this.fps
		var dest = factor || 0.2, src = 1-dest;
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
