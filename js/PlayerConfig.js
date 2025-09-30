class PlayerConfig {
	#config
	constructor() {
		this.#config = {
			pos: { x: 0, y: 0, z: 0 },
			playerColor: 'red',
			hp: { name: 'Hit Point', current: 25, max: 100, regen: .1, backgroundColor: 'rgba(250, 59, 9, 0.644)' },
			energy: { name: 'Energy', current: 100, max: 100, regen: 1.5, backgroundColor: 'rgba(9, 223, 20, 0.644)' },
			def: { name: 'defense', current: 1, max: 100, regen: 3, backgroundColor: 'rgba(9, 59, 223, 0.644)' }
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
