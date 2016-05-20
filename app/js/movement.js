var element = {
	x     : 0,
	y     : 0,

	moved_y : 0,
	moved_x : 0,

	speed : grid_unit * 8,
	currentMovement : 0
};

var movements = [
	[0,1],
	[0,1],
	[0,1],
	[0,1],
	[0,1],
	[0,1],
	[0,1],
	[0,1],
	[0,1],
	[0,1],
	[0,1],
	[0,1],
	[0,1],
	[0,1],
	[0,1],
	[0,1],
	[0,0],
	[0,1],
	[0,1],
	[0,1],
	[0,1],
	[0,1],
	[0,1],
	[0,1],
	[0,1],
	[0,1],
	[0,1],
	[0,1],
	[0,1],
	[0,1],

	[1,0],
	[1,0],
	[1,0],
	[1,0],
	[1,0],
	[1,0],
	[1,0],
	[1,0],
	[1,0],
	[1,0],
	[1,0],
	[1,0],
	[1,0],
	[1,0],
	[1,0],
	[1,0],
	[1,0],
	[1,0],
	[1,0],
	[1,0],
	[1,0],
	[1,0],
	[1,0],
	[1,0],
	[1,0],
	[1,0],
	[1,0],
	[1,0],
	[1,0]

];

function update(modifier) {
	if(element.currentMovement < movements.length) {
		var x = movements[element.currentMovement][0],
			y = movements[element.currentMovement][1];

		var move_y = (y * element.speed * modifier);
		var move_x = (x * element.speed * modifier);

		element.y = Math.min(element.y + move_y, canvas.height - grid_unit);
		element.x = Math.min(element.x + move_x, canvas.height - grid_unit);

		element.moved_y = element.moved_y + move_y;
		element.moved_x = element.moved_x + move_x;

		if(element.moved_y >= (y * grid_unit) && element.moved_x >= (x * grid_unit)) {
			element.moved_y = 0;
			element.moved_x = 0;
			element.currentMovement++;
		}

	}
}

function render() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.beginPath();
	ctx.rect(element.x, element.y, grid_unit, grid_unit);
	ctx.fillStyle = "#ff0000";
	ctx.fill();
	ctx.closePath();
}

var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);
};

main();