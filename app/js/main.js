// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
var grid_unit = 16,
	grid_columns = 32;

var then = Date.now();

canvas.height = canvas.width = grid_unit * grid_columns;

document.body.appendChild(canvas);