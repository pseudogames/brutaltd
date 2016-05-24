import Vector from "./Vector";

export default class Ortho { // convert from 3D to orthogonal 2D 
	constructor(x : Vector, y : Vector, z : Vector) {
		this.axis = {
			right: x,
			front: y,
			up: z
		};
	}

	project(v : Vector) : Vector {
		return new Vector(
			v.x * this.axis.right.x + v.y * this.axis.front.x + v.z * this.axis.up.x, // screen x
			v.x * this.axis.right.y + v.y * this.axis.front.y + v.z * this.axis.up.y, // screen y
			v.x * this.axis.right.z + v.y * this.axis.front.z + v.z * this.axis.up.z  // z-order
		);
	}

}
