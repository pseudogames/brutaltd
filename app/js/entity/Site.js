import {Animated} from "./Animated";
import {Tower}    from "./Tower";

export class Site extends Animated {

	click() {
		this.game.add(new Tower(this.game,this.pos,"tower1",
			{shot:{damage:1, speed: 1, shape: "mob1"}}));
	}
}