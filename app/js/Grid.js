import Vector from "./Vector";
import Loader from "./Loader";

export default class Grid {
	constructor(size : Vector, id : string) {
		this.size = size;
		Loader.json("grid/"+id+".json", json => this.info = json);
	}

	get(p : Vector) {
		if(!this.info) return "";

		if(!this.scene) {
			this.scene = [];
			for(let y=0; y<this.info.size[1]; y++) {
				this.scene[y] = [];
				for(let x=0; x<this.info.size[0]; x++) {
					this.scene[y][x] = this.info.sprites[this.info.scene[y][x]]
				}
			}
		}
		
		return this.scene[p.y][p.x];
	}
}


