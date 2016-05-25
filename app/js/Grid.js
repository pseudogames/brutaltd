import Vector from "./Vector";
import Loader from "./Loader";

export default class Grid {

	static create(size : Vector, id : string) {
		return new Promise(
			function (resolve, reject) {
				Loader
					.json("grid/"+id+".json")
					.then(
						(json) => {
							resolve(new Grid(size, JSON.parse(json)));
						},
						(error) => {
							reject(error);
						}
				);
			}
		);
	}

	constructor(size : Vector, info : Object) {
		this.size = size;
		this.info = info;
		this.path = this.info.path.map( (a) => new Vector(...a) )
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


