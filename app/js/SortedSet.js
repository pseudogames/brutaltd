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
		let i = this.list.indexOf(val);
		if(i<0 || i>=this.list.length) return;
		this.list.splice(i,1);
	}

	forEach(fn : Function) : void {
		this.list.sort(this.compare);
		this.list.forEach(fn);
	}
}
