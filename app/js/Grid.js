import Vector from "./Vector";
import Loader from "./Loader";
import {Entity} from "./entity/Entity";

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
					let items = this.info.sprites[this.info.base[z][y][x]];
					for(let i=0; i<items.length; i++) {
						fn(new Vector(x,y,z), items[i]);
					}
				}
			}
		}
	}

	add(e : Entity, p : Vector = e.pos.floor()) : void {
		this.cell[p.z][p.y][p.x].add(e);
	}

	move(e : Entity, fn : Function) : boolean {
		let p0 = e.pos.floor();
		fn();
		let p1 = e.pos.floor();
		
		if(!p0.equals(p1)) {
			if(p1.x < 0 ||
			   p1.y < 0 ||
			   p1.z < 0 || 
			   p1.x >= this.size.x ||
			   p1.y >= this.size.y ||
			   p1.z >= this.size.z) {
				e.pos = p0; // FIXME hack to avoid out of bounds
				return false;
			}
			this.delete(e, p0);
			this.add(e, p1);
		}
		return true;
	}


	delete(e : Entity, p : Vector = e.pos.floor()) : void {
		this.cell[p.z][p.y][p.x].delete(e);
	}

	get(p : Vector) : Set {
		p = p.floor();
		return this.cell[p.z][p.y][p.x];
	}

}


