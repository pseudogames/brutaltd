import Entity from "../Entity";
import Animated from "./Animated";

export default class Site extends Animated {

	click() {

		this.selector(
			this.pos.copy(),
			this.game.tier.towers.map(id => {
				let serialized = this.game.info.towers[id];
				let {shape,info} = Entity.parse(this.sheet, serialized);
				return {
					label: `${id} $${info.price}`,
					shape: shape,
					action: () => {
						this.game.resources -= info.price;
						Entity.load(this.game,this.pos,serialized);
					}
				}
			})
		);

	}

}

Entity.register(Site);
