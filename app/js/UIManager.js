import * as MESSAGES from "./Messages";

export default class UIManager {
	constructor() {
		const NEXT_WAVE_TIMER = "next_wave_timer";
		const CURRENT_WAVE = "current_wave";

		this.create_ui(NEXT_WAVE_TIMER, MESSAGES.NEXT_WAVE_TIMER.replace("{{time}}", 0));
		this.create_ui(CURRENT_WAVE, MESSAGES.CURRENT_WAVE.replace("{{wave}}", 0));

		this.next_wave_timer = document.querySelector(`#${NEXT_WAVE_TIMER}`);
		this.current_wave = document.querySelector(`#${CURRENT_WAVE}`);
	}
	set_wave_timer(time) {
		this.next_wave_timer.innerHTML = MESSAGES.NEXT_WAVE_TIMER.replace("{{time}}", time);
	}
	set_wave(number) {
		this.current_wave.innerHTML = MESSAGES.CURRENT_WAVE.replace("{{wave}}", number);
	}
	create_ui(id, message) {
		const div = document.createElement("div");
		div.id = id;
		div.appendChild(document.createTextNode(message));
		document.body.appendChild(div);
	}
}