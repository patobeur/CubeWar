class PlayerConfig {
	#config
	constructor() {
		this.#config = {
			pos: { x: 0, y: 0, z: 0 },
			playerColor: 'red',
			stats: {
				hp: 120,
				stamina: 150,
				food: 100,
				morale: 100,
				strength: 15,
				speed: 1.2,
				perception: 7,
				aggressiveness: 0.7,
				intelligence: 0.8,
				resistance: 1
			}
		}
		this.#Init()
	}
	#Init() {
		let test = this.get_value('pos', 'x');
	}
	get_value(parent, value) {
		if (this.#config[parent]) {
			if (this.#config[parent][value]) {
				return this.#config[parent][value]
			}
			else {
				return this.#config[parent]
			}
		}
		else {
			console.log('PlayerConfig.' + parent + ' n\'existe pas !')
		}
		return false
	}
}
