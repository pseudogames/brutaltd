import Vector from "../Vector";
import Game   from "../Game";

export class Entity {
		
	constructor(game : Game, pos : Vector, shape : string, info : Object) {
		this.pos = pos;
		this.info = info;
		this.game = game;
		this.grid = game.grid;
		this.sheet = game.sheet;
		this.render = game.render;
		this.highlight = false;
		this.sprite = {
			state: this.sheet.initial_state(shape),
			elevation: this.sheet.get_elevation(shape)
		};
		this.init();
		this.frame();
		this.project();
	}

	init() {
	}

	focus() {
		this.highlight = true;
		this.game.selected.add(this);
		console.log("focus",this);
	}

	blur() {
		this.highlight = false;
		this.game.selected.delete(this);
	}

	frame() {
		this.sprite.frame = this.sheet.get(this.sprite.state);
	}

	project() {
		this.pos2d = this.render.pos2d(this.pos, this.sprite.elevation);
	}

	draw() {
		this.render.blit(this);
	}
}