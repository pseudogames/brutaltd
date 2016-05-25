import Vector from "./Vector";
import Loader from "./Loader";
import Ortho  from "./Ortho";

export default class Sprites {
	static create(size : Vector, id : string) {
		return new Promise(
			function (resolve, reject) {
				Promise.all([
					Loader.image("sprite/"+id+".png"),
					Loader.json("sprite/"+id+".json")
				])
				.then(
					([img, json]) => {
						resolve(new Sprites(size, img, JSON.parse(json)));
					},
					(error) => {
						reject(error)
					}
				);
			}
		);
	}

	constructor(size : Vector, img : Object, info : Object) {
		this.size = size;
		this.img  = img;
		this.info = info;
		//TODO: CHECK INFO BEFORE TRY TO INSTANTIATE
		this.projection = new Ortho(
			new Vector(...this.info.projection[0]),
			new Vector(...this.info.projection[1]),
			new Vector(...this.info.projection[2])
		);
	}

	get(entity : string, state : string, frame : number) : Object {
		if(!this.img || !this.info) {
			return Sprites.dummy;
		}

		if(!this.index) {
			this.index = {};
			for(let g in this.info.group) {
				for(let i in this.info.group[g].entity) {
					let e = this.info.group[g].entity[i];
					this.index[e] = {};
					for(let j in this.info.group[g].state) {
						let c = this.info.group[g].state[j];
						this.index[e][c] = [];
						for(let f=0; f < this.info.frames_per_state; f++) {
							this.index[e][c][f] = {
								x: this.size.x*(this.info.frames_per_state * (j|0) + f),
								y: this.size.y*(this.info.group[g].row + (i|0)),
								w: this.size.x,
								h: this.size.y
							};
						}
					}
				}
			}
		}

		if(!this.index[entity] || !this.index[entity][state] || !this.index[entity][state][frame])
			return Sprites.dummy;
		return {img: this.img, rect: this.index[entity][state][frame]};
	}
}

Sprites.empty = new Image(1,1);
Sprites.dummy =  {img: Sprites.empty, rect: {x:0,y:0,w:1,h:1}};

