export default class Vector {

	static copy(v : Vector) : Vector {
		return new Vector(v.x,v.y,v.z);
	}

	constructor(x,y,z) {
		this.x = x || 0; // Number
		this.y = y || 0; // Number
		this.z = z || 0; // Number
	}

	add(v) : Vector {
		return new Vector(
			this.x + v.x,
			this.y + v.y,
			this.z + v.z
		);
	}

	sub(v) : Vector {
		return new Vector(
			this.x - v.x,
			this.y - v.y,
			this.z - v.z
		);
	}

	scale(a) : Vector {
		return new Vector(
			this.x * a,
			this.y * a,
			this.z * a
		);
	}

	floor() : Vector {
		return new Vector(
			Math.floor(this.x),
			Math.floor(this.y),
			Math.floor(this.z)
		);
	}

	sign() : Vector {
		return new Vector(
			Math.sign(this.x),
			Math.sign(this.y),
			Math.sign(this.z)
		);
	}

	static zero() : Vector {
		return new Vector(0,0,0);
	}

	toString() : string {
		return "" + this.x + "," + this.y + "," + this.z;
	}
}
