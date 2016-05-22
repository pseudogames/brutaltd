
export default class Vector {

	constructor(x,y,z) {
		this.x = x || 0; // Number
		this.y = y || 0; // Number
		this.z = z || 0; // Number
	}

	add(v) {
		return new Vector(
			this.x + v.x,
			this.y + v.y,
			this.z + v.z
		);
	}

	sub(v) {
		return new Vector(
			this.x - v.x,
			this.y - v.y,
			this.z - v.z
		);
	}

	scale(a) {
		return new Vector(
			this.x * a,
			this.y * a,
			this.z * a
		);
	}

	floor() {
		return new Vector(
			Math.floor(this.x),
			Math.floor(this.y),
			Math.floor(this.z)
		);
	}

	static zero() {
		return new Vector(0,0,0);
	}

	toString() {
		return "" + this.x + "," + this.y + "," + this.z;
	}
}
