import Vector from "./Vector";
import Loader from "./Loader";

export default class Grid {
	constructor(size : Vector, id : string) {
		this.size = size;
		Loader.json("grid/"+id+".json", json => this.info = json);
	}

	get(p : Vector) {
		if(!this.info) return [];

		if(!this.base) {
			this.base = [];
			for(let y=0; y<this.info.size[1]; y++) {
				this.base[y] = [];
				for(let x=0; x<this.info.size[0]; x++) {
					this.base[y][x] = this.info.sprites[this.info.base[y][x]]
				}
			}
		}
		
		return this.base[p.y][p.x];
	}
}


