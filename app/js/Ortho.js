import Vector from "./Vector";

export default class Ortho { // convert from 3D to orthogonal 2D 
	constructor(x,y,z) {
		this.axis = {
			right: x,
			front: y,
			up: z
		};
	}

	project(v) {
		return new Vector(
			v.x * this.axis.right.x + v.y * this.axis.front.x + v.z * this.axis.up.x,
			v.x * this.axis.right.y + v.y * this.axis.front.y + v.z * this.axis.up.y
		);
	}

}
