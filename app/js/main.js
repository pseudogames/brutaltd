'use strict';

import Grid from "./_grid";
import Render from "./_render";
import Vector from "./_vector";

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.height = canvas.width = 512;
document.body.appendChild(canvas);

let grid = new Grid(32,32);
let render = new Render(grid, ctx);

for(var y=0; y<grid.h; y++) {
	for(var x=0; x<grid.w; x++) {
		render.plot(new Vector(x,y,0));
	}
}