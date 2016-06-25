import Vector from "./Vector";
import Game   from "./Game";
import Render from "./Render";
import {Sheet,Frame,State} from "./Sprite";

export default class Entity {

	static parse(sheet : Sheet, serialized : string) : Object {
		let [,shape,,typename,info] = serialized.match(/^(\w+)(\s*:\s*(\w+)\(((.*))?\))?/)
		// for instance, "larry : Mob({'health':10,'speed':20})"

		if(!shape) {
			throw "bad entity definition '"+serialized+"'";
		}

		if(!Entity.registry.Animated || !Entity.registry.Still) {
			throw "basic entities Still and Animated not loaded";
		}

		let Type = typename ? Entity.registry[typename] :
			sheet.is_animated(shape) ?
				Entity.registry.Animated : 
				Entity.registry.Still;

		if(!Type) {
			throw `type '${typename}' does not exist, review 'grid/${this.tier.grid}.json' file`;
		}

		if(Type.prototype instanceof Entity.registry.Animated &&
			!sheet.is_animated(shape))
		{
			throw `type '${typename}' is animated but shape '${shape}' is not check 'grid/${this.tier.grid}.json' file`;
		}

		info = info ? JSON.parse(info.replace(/'/g,'"')) : {};

		return {
			typename: typename,
			Type: Type,
			shape: shape,
			info: info
		};
	}

	static load(game : Game, pos : Vector, serialized : string) : Entity {
		let {Type,shape,info} = this.parse(game.sheet, serialized);
		return new Type(game, pos, shape, info);
	}


	constructor(game : Game, pos : Vector, shape : string, info : Object) {
		this.pos = pos;
		this.info = info;
		this.game = game;
		this.grid = game.grid;
		this.sheet = game.sheet;
		this.render = game.render;
		this.highlight = false;
		this.sprite = {
			state: this.sheet.start(shape),
			elevation: this.sheet.get_elevation(shape)
		};
		this.init();
		this.frame();
		this.project();

		// add
		this.grid.add(this);   // collision
		this.render.add(this); // draw
		this.game.add(this);   // tick

		this.constructor.count ++;
	}

	delete() : void {
		this.game.delete(this);
		this.render.delete(this);
		this.grid.delete(this);
		this.constructor.count --;
	}

	init() {
	}

	focus() {
		this.highlight = true;
		this.game.highlight.add(this);
	}

	blur() {
		this.highlight = false;
		this.game.highlight.delete(this);
	}

	frame() {
		this.sprite.frame = this.sheet.get(this.sprite.state);
	}

	project() {
		this.pos2d = this.render.pos2d(this.pos, this.sprite.elevation);
	}

	draw() {
		this.render.blit(this);
	}

	selector(origin : Vector, option : Array) {
		let step = Math.PI * 2 / option.length;
		let angle = 0;

		this.game.selector.forEach(e => e.delete());
		option.forEach(opt => {
			let action = new Entity.registry.Action(
				this.game,
				origin.circle_ground(angle, 1.25),
				opt.shape,
				{
					origin : origin,
					label: opt.label,
					callback: opt.action,
				}
			);
			this.game.add(action);
			this.game.selector.add(action);
			angle += step;
		});
	}


	static register(Type : Class) : void {
		Entity.registry[Type.name] = Type;
	}
}

Entity.registry = {};
