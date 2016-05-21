export default class Render {
	constructor(grid, ctx) {
		console.log("New Render");
		this.grid = grid;
		this.context2D = ctx;
	}
	plot(vector) {
		console.log(`Reder.plot: Gonna plot a vector at: ${vector.x},${vector.y},${vector.z}`);
		// this.context2D.clearRect(0, 0, 512, 512);
		this.context2D.fillRect(vector.x,vector.y,16,16);
	}
}