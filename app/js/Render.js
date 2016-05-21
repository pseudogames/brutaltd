
class Render {
	constructor(grid,canvas) {
		this.grid = grid;
		this.canvas = canvas;
	}

	grid_to_canvas(grid_pos) {
		return new Vector(
			grid_pos.x * 8 + grid_pos.y * 12,
			grid_pos.x * 12 + grid_pos.y * 8 + (grid_pos.z || 0) * 3
		);
	}

	plot(grid_pos, color) {
		let canvas_pos = this.grid_to_canvas(grid_pos);
		console.log(canvas_pos);
		this.canvas.fillStyle = color;
		this.canvas.fillRect(canvas_pos.x, canvas_pos.y, 3,3);
	}
}

