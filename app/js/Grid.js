import Vector from "./Vector";
import Bounds from "./Bounds";
import Loader from "./Loader";
import Entity from "./Entity";

// Space subdivision, collision

export default class Grid {

	static load(id : string) : Promise {
		return new Promise(
			function (resolve, reject) {
				Loader
					.json("grid/"+id+".json")
					.then(
						info  => resolve(new Grid(info)),
						error => reject(error)
				);
			}
		);
	}

	forEach(fn : Function) : Array {
		let res = [];
		for(let z=0; z<this.size.z; z++) {
			res[z] = [];
			for(let y=0; y<this.size.y; y++) {
				res[z][y] = [];
				for(let x=0; x<this.size.x; x++) {
					res[z][y][x] = fn(x,y,z);
				}
			}
		}
		return res;
	}


	constructor(info : Object) : void {
		this.size = new Vector(...info.size);
		this.info = info;
		this.path = this.info.path.map( (p) => new Vector(...p) )
		this.cell = [];
		for(let z=0; z<this.size.z; z++) {
			this.cell[z] = [];
			for(let y=0; y<this.size.y; y++) {
				this.cell[z][y] = [];
				for(let x=0; x<this.size.x; x++) {
					this.cell[z][y][x] = new Set();
				}
			}
		}
	}

	setup(fn : Function) {
		for(let z=0; z<this.size.z; z++) {
			for(let y=0; y<this.size.y; y++) {
				for(let x=0; x<this.size.x; x++) {
					let items = this.info.sprite[this.info.base[z][y][x]];
					for(let i=0; i<items.length; i++) {
						fn(new Vector(x,y,z), items[i]);
					}
				}
			}
		}
	}

	add(e : Entity) : boolean {
		let inside = false;
		let p = e.pos.add(Grid.pivot).floor();

		if(e.gridpos) {
			if(p.equals(e.gridpos)) {
				return true;
			} else {
				this.delete(e);
			}
		}

		if(Bounds.inside0(p, this.size)) {
			this.cell[p.z][p.y][p.x].add(e);
			e.gridpos = p;
			return true;
		}

		return false;
	}

	delete(e : Entity) : void {
		if(e.gridpos) {
			let p = e.gridpos;
			this.cell[p.z][p.y][p.x].delete(e);
			e.gridpos = null;
		}
	}

	contact(e : Entity) : Set {
		return e.gridpos ?
			this.cell[e.gridpos.z][e.gridpos.y][e.gridpos.x] : 
			Grid.empty;
	}

	get(p : Vector) : Set {
		p = p.floor();
		return Bounds.inside0(p, this.size) ?
			this.cell[p.z][p.y][p.x] : Grid.empty;
	}
}

Grid.pivot = new Vector(0.5, 0.5, 0.5);
Grid.empty = new Set();
