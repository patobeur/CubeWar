class Mobs {
	#AllMobs
	#CurrentMobImmat
	#Formula
	constructor() {
		this.#AllMobs = []
		this.#CurrentMobImmat = 0
		this.#Formula = new Formula()
	}

	addMobs(mobNames, mobType = 'mobs') {
		mobNames.forEach(name => {
			let mob = this.addOne(name, mobType)
		});
		return this.get_allMobs()
	}

	addOne(nickname = false, mobType = 'mobs', color = null) {

		this.mobConf = new MobConfig()

		// i get a clone with the default config
		let conf = this.mobConf.get_(mobType)

		// adding basics to feet the needs
		conf.immat = this.#CurrentMobImmat
		conf.id = 'M_' + conf.immat
		conf.speed = conf.speed / 50
		//conf.divs.prima.size
		conf.position = this.#Formula.get_aleaPosOnFloor({ x: 20, y: 20, z: 0 })
		conf.nickname = (!nickname === false) ? nickname : new String('UnNamed_') + conf.immat;
		conf.theta.cur = this.#Formula.rand(0, 360)

		if (color) {
			conf.mesh.color = color;
		}

		// push a fresh mob with fresh conf to allMob arrray
		let newmob = new Mob(conf)
		this.#AllMobs.push(newmob)

		// set the new immat
		this.#CurrentMobImmat = this.#AllMobs.length

		return this.#AllMobs[this.#CurrentMobImmat - 1]
	}
	get_allMobs() {
		return this.#AllMobs.length > 0 ? this.#AllMobs : false;
	}
	set_allMobs(mobs) {
		this.#AllMobs = mobs;
	}
	updateAllMobs(foodItems, game) {
		this.#AllMobs.forEach(mob => {
			mob.update(this.#AllMobs, foodItems, game)
		});
	}

}
