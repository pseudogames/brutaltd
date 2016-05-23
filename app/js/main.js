'use strict';

import Vector from "./Vector";
import Ortho from "./Ortho";
import Grid from "./Grid";
import Sprites from "./Sprites";
import Render from "./Render";

let grid = new Grid(new Vector(16,9,4));
let sprites = new Sprites(new Vector(66,96));
let render = new Render(grid, sprites,
	new Ortho(
		new Vector( 46.55, 17.88),
		new Vector(-18.44, 45.00),
		new Vector(  0   ,-31.55)
	)
);

//window.setInterval(_ => render.draw(), 1000/30);

