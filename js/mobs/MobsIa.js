class MobsIa {
	constructor() {
		this.Formula = new Formula()
	}
	iaAction(conf) {
		if (conf.ia.changeAction.cur === 0) {
			// save old action
			// conf.ia.changeAction.lastAction = conf.ia.changeAction.currentAction
			// new random action
			let randDir = this.Formula.rand(0, 4)

			// console.log(conf.ia.changeAction.currentAction)
			switch (randDir) {
				case 0:
				case 1:
				case 2:
				case 3:
					break;
				case 4:
					this.#chooseDir(conf)
					break;
				default:
					break;
			}
		}
		else {
			this.#keepMoving(conf)
		}

		// set current tics to min if current is bigger than max
		conf.ia.changeAction.cur = conf.ia.changeAction.cur > conf.ia.changeAction.max
			? 0
			: conf.ia.changeAction.cur + 1
	}
	#chooseDir(conf) {
		let dir = this.Formula.rand(0, 1) > .5 ? 1 : -1;
		conf.theta.cur += Math.floor(dir * conf.ia.dirAmplitude)
		// console.log(conf.ia.dirAmplitude, conf.theta.cur)
	}
	#keepMoving(conf) {

		// let nextpos = this.Formula.get_NextThreePos(conf.position.x, conf.position.y, conf.theta.cur, conf.speed)

		conf.position.x = conf.position.x = conf.position.x - Math.sin(conf.theta.cur) * conf.speed
		conf.position.y = conf.position.y = conf.position.y + Math.cos(conf.theta.cur) * conf.speed

		// limits
		if (conf.position.x < -(conf.floor.size.x / 2)) conf.position.x = conf.floor.size.x / 2
		if (conf.position.x > (conf.floor.size.x / 2)) conf.position.x = -(conf.floor.size.x / 2)
		if (conf.position.y < -(conf.floor.size.y / 2)) conf.position.y = conf.floor.size.y / 2
		if (conf.position.y > (conf.floor.size.y / 2)) conf.position.y = -(conf.floor.size.y / 2)

	}
	#changeDir(conf) {
		conf.theta.cur = this.Formula.rand(
			conf.theta.min,
			conf.theta.max
		)
	}
	#check
}
