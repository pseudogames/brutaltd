import Vector from "./Vector";
import Loader from "./Loader";

export default class Sprites {
	constructor(size : Vector, id : string) {
		this.size = size;
		Loader.image("sprite/"+id+".png", img => this.img = img);
		Loader.json("sprite/"+id+".json", json => this.info = json);
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
			console.log(this.index);
		}

		console.log(entity);
		if(!this.index[entity] || !this.index[entity][state] || !this.index[entity][state][frame])
			return Sprites.dummy;
		return {img: this.img, rect: this.index[entity][state][frame]};
	}
}

Sprites.empty = new Image(1,1);
Sprites.dummy =  {img: Sprites.empty, rect: {x:0,y:0,w:1,h:1}};

