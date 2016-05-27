import Vector from "./Vector";
import Loader from "./Loader";

export default class Grid {

	static create(id : string) {
		return new Promise(
			function (resolve, reject) {
				Loader
					.json("grid/"+id+".json")
					.then(
						(json) => {
							resolve(new Grid(JSON.parse(json)));
						},
						(error) => {
							reject(error);
						}
				);
			}
		);
	}

	constructor(info : Object) {
		this.size = new Vector(...info.size);
		this.info = info;
		this.path = this.info.path.map( (p) => new Vector(...p) )
		this.base = [];
		for(let y=0; y<this.size.y; y++) {
			this.base[y] = [];
			for(let x=0; x<this.size.x; x++) {
				this.base[y][x] = this.info.sprites[this.info.base[y][x]]
			}
		}
	}

	get(p : Vector) {
		return this.base[p.y][p.x];
	}
}


