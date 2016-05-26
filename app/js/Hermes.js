var EventBus = {
	topics: {},

	subscribe: function(topic, listener) {
		if(!this.topics[topic]) this.topics[topic] = [];
		this.topics[topic].push(listener);
	},

	publish: function(topic, data) {
		if(!this.topics[topic] || this.topics[topic].length < 1) return;
		this.topics[topic].forEach(function(listener) {
			listener(data || {});
		});
	}
};

//messenger of the gods
export default class Hermes {
	constructor(){
		throw new Error("Cannot instatiate");
	}
	static subscribe(topic, listener) {
		EventBus.subscribe(topic, listener);
	}
	static publish(topic, data) {
		EventBus.publish(topic, data);
	}
}