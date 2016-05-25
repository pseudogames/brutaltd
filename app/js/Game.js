export default class Game {
	constructor() {
		console.log(`There's a new game in town`);

		this.render = new Render();
	}
	start() {
		//temporary
		let o = new Ortho(
			new Vector( 46.55, 17.88, 17.88),
			new Vector(-18.44, 45.00, 45.00),
			new Vector(  0   ,-31.55,  0.1 )
		);

		Promise.all([
			Grid.create("teste"),
			Sprite.create("sample")
		])
		.then(([g, s]) => {
			this.grid   = g; //is it necessary for game to have a grid prop?
			this.sprite = s; //is it necessary for game to have a sprite prop?
			render.setup(g,s,o);
		})
		.catch(err => {
			//deal with it
		});
	}
}