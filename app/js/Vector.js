export default class Vector {

	constructor(x : number = 0, y : number = 0, z : number = 0) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	copy() : Vector {
		return new Vector(this.x, this.y, this.z);
	}

	add(v : Vector) : Vector {
		return new Vector(
			this.x + v.x,
			this.y + v.y,
			this.z + v.z
		);
	}

	sub(v : Vector) : Vector {
		return new Vector(
			this.x - v.x,
			this.y - v.y,
			this.z - v.z
		);
	}

	scale(a : number) : Vector {
		return new Vector(
			this.x * a,
			this.y * a,
			this.z * a
		);
	}

	circle_ground(angle : number, radius : number) {
		return new Vector(
			this.x - Math.cos(angle) * radius,
			this.y + Math.sin(angle) * radius,
			this.z
		)
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

	equals(v : Vector) : boolean {
		return this.x == v.x &&
		       this.y == v.y &&
		       this.z == v.z;
	}

	static zero() : Vector {
		return new Vector(0,0,0);
	}

	toString() : string {
		return "" + this.x + "," + this.y + "," + this.z;
	}
}
