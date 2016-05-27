import Vector from "./Vector";
import Loader from "./Loader";

export default class Grid {

	static create(id : string) {
		console.log(`Grid.create ${id}`);
		return new Promise(
			function (resolve, reject) {
				Loader
					.json("grid/"+id+".json")
					.then(
						(json) => {
							console.log("Grid.create success");
							resolve(new Grid(JSON.parse(json)));
						},
						(error) => {
							console.error("Grid.create error", error);
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
		for(let z=0; z<this.size.z; z++) {
			this.base[z] = [];
			for(let y=0; y<this.size.y; y++) {
				this.base[z][y] = [];
				for(let x=0; x<this.size.x; x++) {
					this.base[z][y][x] = this.info.sprites[this.info.base[z][y][x]];
				}
			}
		}
	}

	get(p : Vector) {
		return this.base[p.z][p.y][p.x];
	}
}


