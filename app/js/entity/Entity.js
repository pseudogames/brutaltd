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
		this.sprite = {
			state: this.sheet.initial_state(shape),
			z_offset: this.sheet.get_z(shape)
		};
		this.init();
		this.frame();
		this.project();
	}

	init() {
	}

	frame() {
		this.sprite.frame = this.sheet.get(this.sprite.state);
	}

	project() {
		this.pos2d = this.render.pos2d(this.pos, this.sprite.z_offset);
	}

	draw() {
		this.render.blit(this.pos2d, this.sprite.frame, this);
	}
}