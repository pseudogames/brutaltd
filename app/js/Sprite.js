import Vector from "./Vector";
import Loader from "./Loader";
import Ortho  from "./Ortho";

// Sprite sheet subdivision

export type Frame = {
	image: Image,
	geometry: {
		x: number,
		y: number,
		w: number,
		h: number
	}
};

export type State = {
	shape: string,
	cycle?: string,
	frame?: number
};

export class Sheet {
	static load(id : string) : Promise {
		return new Promise(
			function (resolve, reject) {
				Promise.all([
					Loader.image("sprite/"+id+".png"),
					Loader.json("sprite/"+id+".json")
				])
				.then(
					([image, info]) => resolve(new Sheet(image, info)),
					error           => reject(error)
				);
			}
		);
	}

	build_index_still(info : Object) : void {
		this.still = {};
		for(let g in this.info.still) {
			let [x0,y] = this.info.still[g].pos;
			for(let i in this.info.still[g].shape) {
				let z_offset = 0;
				let x = x0;
				for(let j in this.info.still[g].shape[i]) {
					let e = this.info.still[g].shape[i][j];
					if(typeof(e) == "number") {
						z_offset = e;
						continue;
					}
					this.z_offset[e] = z_offset;
					this.still[e] = {
						x: this.size.x * x,
						y: this.size.y * y,
						w: this.size.x,
						h: this.size.y
					};
					x++;
				}
				y++;
			}
		}
	}

	build_index_animated(info : Object) : void {
		this.animated = {};
		for(let g in this.info.animated) {
			let [x0,y] = this.info.animated[g].pos;
			let z_offset = 0;
			for(let i in this.info.animated[g].shape) {
				let e = this.info.animated[g].shape[i];
				if(typeof(e) == "number") {
					z_offset = e;
					continue;
				}
				this.z_offset[e] = z_offset;
				this.animated[e] = {};
				let frames_per_state = 1;
				let x = x0;
				for(let j in this.info.animated[g].cycle) {
					let s = this.info.animated[g].cycle[j];
					if(typeof(s) == "number") {
						frames_per_state = s;
						continue;
					}
					this.animated[e][s] = [];
					for(let f=0; f < frames_per_state; f++) {
						this.animated[e][s][f] = {
							x: this.size.x * x,
							y: this.size.y * y,
							w: this.size.x,
							h: this.size.y
						};
						// if(!this.still[e]) {
						// 	this.still[e] = this.animated[e][s][f];
						// }
						x++;
					}
				}
				y++;
			}
		}
	}

	constructor(image : Image, info : Object) {
		this.size  = new Vector(...info.size);
		this.image = image;
		this.info  = info;
		//TODO check info before try to instantiate
		this.projection = new Ortho(
			new Vector(...info.projection[0]),
			new Vector(...info.projection[1]),
			new Vector(...info.projection[2])
		);
		this.z_offset = {};
		this.build_index_still(info);
		this.build_index_animated(info);
	}

	is_animated(shape : string) : number {
		if(this.animated[shape]) return 1;
		if(this.still[shape]) return 0;
		throw `no sprite for shape '${shape}'`;
	}

	get_z(shape : string) : number {
		return this.z_offset[shape];
	}

	get(d : State) : Frame {
		return {
			image: this.image, 
			geometry: d.cycle ?
				this.animated[d.shape][d.cycle][d.frame] :
				this.still[d.shape]
		};
	}

	get_state(direction : Vector) : string {
		return this.info.faces[ [direction.x,direction.y].join("") ];
	}
}

