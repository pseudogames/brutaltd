'use strict';

import Game from "./Game";

let game = new Game();

for(let b of document.querySelectorAll('.start')) {
	b.addEventListener("click", (e) => game.start(parseInt(e.target.getAttribute("data-level"))) );
}

for(let b of document.querySelectorAll('.speed')) {
	b.addEventListener("click", (e) => game.speed(parseInt(e.target.getAttribute("data-level"))) );
}

for(let b of document.querySelectorAll('.next')) {
	b.addEventListener("click", (e) => game.next() );
}

window.addEventListener('click', e => game.click(e));
window.addEventListener('click', e => e.button == 1 && game.render.zoom());
window.addEventListener('wheel', e => game.render.scroll(e.deltaY));

