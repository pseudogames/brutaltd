import Vector from "./Vector";

export default class Box {
	// useful methods, but misleading if on Vector

	static norm(a,b) {
		return new Vector(
			a.x / b.x,
			a.y / b.y,
			a.z / b.z
		);
	}

	static min(a,b) {
		return new Vector(
			Math.min(a.x, b.x),
			Math.min(a.y, b.y),
			Math.min(a.z, b.z)
		);
	}

	static max(a,b) {
		return new Vector(
			Math.max(a.x, b.x),
			Math.max(a.y, b.y),
			Math.max(a.z, b.z)
		);
	}

}
