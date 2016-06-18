'use strict';

import Game from "./Game";

let game = new Game();

for(let b of document.querySelectorAll('.load_level')) {
	b.addEventListener("click", (e) => game.start(parseInt(e.target.getAttribute("data-level"))) );
}
