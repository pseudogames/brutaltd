import Vector from "./Vector";
import Loader from "./Loader";

export default class Sprites {
	constructor(size : Vector, id : string) {
		this.size = size;
		Loader.image("sprite/"+id+".png", img => this.img = img);
		Loader.json("sprite/"+id+".json", json => this.info = json);
	}

	get(group : string, entity : string, state : string, frame : number) : Object {
		if(!this.img || !this.info) {
			return {img: Sprites.empty, rect: {x:0,y:0,w:1,h:1}};
		}

		if(!this.index) {
			this.index = {};
			for(let g in this.info.group) {
				this.index[g] = {};
				for(let i in this.info.group[g].entity) {
					let e = this.info.group[g].entity[i];
					this.index[g][e] = {};
					for(let j in this.info.group[g].state) {
						let c = this.info.group[g].state[j];
						this.index[g][e][c] = [];
						for(let f=0; f < this.info.frames_per_state; f++) {
							this.index[g][e][c][f] = {
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

		return {img: this.img, rect: this.index[group][entity][state][frame]};
	}
}

Sprites.empty = new Image(1,1);


