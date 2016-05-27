'use strict';

import Game from "./Game";

const BrutalTD = new Game();

let level_btn = document.querySelectorAll('.load_level');

for(let b of level_btn) {
	b.addEventListener("click", (e) => BrutalTD.load_level(parseInt(e.target.getAttribute("data-level"))) );
}