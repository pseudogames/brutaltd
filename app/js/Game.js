import Walker from "./Walker";
import Vector from "./Vector";
import Ortho from "./Ortho";
import Grid from "./Grid";
import Sprites from "./Sprites";
import Render from "./Render";

export default class Game {
	constructor() {
		console.log(`There's a new game in town`);
		this.render = new Render();
		return this;
	}
	start(sprite_name : string, grid_name : string) {
		Promise
			.all([
				Sprites.create(new Vector(66,96), sprite_name),
				Grid.create(new Vector(16,9,1), grid_name)
			])
			.then( ([s, g]) => {
				this.sprites = s;
				this.grid    = g;
				this.render.setup(g,s).draw();
			})
			.catch(err => {
				console.log(`Game.start err`, err);
			});
	}
}