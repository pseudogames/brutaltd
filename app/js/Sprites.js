import Vector from "./Vector";
import Loader from "./Loader";
import Ortho  from "./Ortho";

export default class Sprites {
	static create(id : string) {
		return new Promise(
			function (resolve, reject) {
				Promise.all([
					Loader.image("sprite/"+id+".png"),
					Loader.json("sprite/"+id+".json")
				])
				.then(
					([img, json]) => {
						resolve(new Sprites(img, JSON.parse(json)));
					},
					(error) => {
						reject(error)
					}
				);
			}
		);
	}

	build_index_still(info : Object) {
		this.still = {};
		for(let g in this.info.still) {
			let [x0,y] = this.info.still[g].pos;
			for(let i in this.info.still[g].entity) {
				let z_offset = 0;
				let x = x0;
				for(let j in this.info.still[g].entity[i]) {
					let e = this.info.still[g].entity[i][j];
					if(typeof(e) == "number") {
						z_offset = e;
						continue;
					}
					this.still[e] = {
						x: this.size.x * x,
						y: this.size.y * y,
						z: z_offset,
						w: this.size.x,
						h: this.size.y
					};
					x++;
				}
				y++;
			}
		}
	}

	build_index_animated(info : Object) {
		this.animated = {};
		for(let g in this.info.animated) {
			let [x0,y] = this.info.animated[g].pos;
			let z_offset = 0;
			for(let i in this.info.animated[g].entity) {
				let e = this.info.animated[g].entity[i];
				if(typeof(e) == "number") {
					z_offset = e;
					continue;
				}
				this.animated[e] = {};
				let frames_per_state = 1;
				let x = x0;
				for(let j in this.info.animated[g].state) {
					let s = this.info.animated[g].state[j];
					if(typeof(s) == "number") {
						frames_per_state = s;
						continue;
					}
					this.animated[e][s] = [];
					for(let f=0; f < frames_per_state; f++) {
						this.animated[e][s][f] = {
							x: this.size.x * x,
							y: this.size.y * y,
							z: z_offset,
							w: this.size.x,
							h: this.size.y
						};
						if(!this.still[e]) {
							this.still[e] = this.animated[e][s][f];
						}
						x++;
					}
				}
				y++;
			}
		}
	}


	constructor(img : Object, info : Object) {
		this.size = new Vector(...info.size);
		this.img  = img;
		this.info = info;
		//TODO: CHECK INFO BEFORE TRY TO INSTANTIATE
		this.projection = new Ortho(
			new Vector(...info.projection[0]),
			new Vector(...info.projection[1]),
			new Vector(...info.projection[2])
		);
		this.build_index_still(info);
		this.build_index_animated(info);
	}

	get(entity : string, state : string = "", frame : number = 0) : Object {
		return {img: this.img, geometry: state ? this.animated[entity][state][frame] : this.still[entity]};
	}

	facing(direction : Vector) {
		return this.info.faces[ [direction.x,direction.y].join("") ];
	}
}

