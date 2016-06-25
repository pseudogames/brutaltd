import Vector from "./Vector";

export default class Bounds {
	// useful methods, but misleading if on Vector

	static scale(a : Vector, b : Vector) : Vector {
		return new Vector(
			a.x * b.x,
			a.y * b.y,
			a.z * b.z
		);
	}

	static norm(a : Vector, b : Vector) : Vector {
		return new Vector(
			a.x / b.x,
			a.y / b.y,
			a.z / b.z
		);
	}

	static min(a : Vector, b : Vector) : Vector {
		return new Vector(
			Math.min(a.x, b.x),
			Math.min(a.y, b.y),
			Math.min(a.z, b.z)
		);
	}

	static max(a : Vector, b : Vector) : Vector {
		return new Vector(
			Math.max(a.x, b.x),
			Math.max(a.y, b.y),
			Math.max(a.z, b.z)
		);
	}

	static inside0(p : Vector, size : Vector) : boolean
	{
		return p.x >= 0 &&
		       p.y >= 0 &&
		       p.z >= 0 &&
		       p.x <  size.x &&
		       p.y <  size.y &&
		       p.z <  size.z;
	}

	static inside(p : Vector, size : Vector,
		origin : Vector = Vector.zero()) : boolean
	{
		return p.x >= origin.x &&
		       p.y >= origin.y &&
		       p.z >= origin.z &&
		       p.x <  origin.x + size.x &&
		       p.y <  origin.y + size.y &&
		       p.z <  origin.z + size.z;
	}

}
