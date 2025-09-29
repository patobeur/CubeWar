class PlayerConfig {
	#config
	constructor() {
		this.#config = {
			pos: { x: 0, y: 0, z: 0 },
			playerColor: 'red',
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
