export default class SortedSet {

	// FIXME super simple implementation

	constructor(compare : Function) {
		this.compare = compare;
		this.list = [];
	}

	add(val : any) : void {
		this.list.push(val);
	}

	delete(val : any) : void {
		this.list.splice(this.list.indexOf(val),1);
	}

	forEach(fn : Function) : void {
		this.list.sort(this.compare);
		this.list.forEach(fn);
	}
}
