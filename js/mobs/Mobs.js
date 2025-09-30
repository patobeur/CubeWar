class Mobs {
	#Config;
	#AllMobs;
	#CurrentMobImmat;
	#Formula;

	constructor(Config) {
		this.#Config = Config;
		this.#AllMobs = [];
		this.#CurrentMobImmat = 0;
		this.#Formula = new Formula();
		// console.log(this.#Config)
	}

	addMobs(howmanyMobs, mobType = false) {
		for (let i = 0; i < howmanyMobs; i++) {
			// let name = this.rangers[this.#Formula.rand(0, this.rangers.length - 1)]
			let name = this.get_AName(8);
			let mob = this.addOne(name, mobType ?? "mobs");
		}
		return this.get_allMobs();
	}

	addOne(nickname = false, mobType = "mobs") {
		this.mobConf = new MobConfig(this.#Formula.rand(0, 5));

		// i get a clone with the default config
		let conf = this.mobConf.get_(mobType);

		// adding basics to feet the needs
		conf.immat = this.#CurrentMobImmat;
		conf.id = "M_" + conf.immat;
		conf.speed = conf.speed / 50;

		// console.log(this.#Config.floor.size)
		conf.position = this.#Formula.get_aleaPosOnFloor(this.#Config.floor.size);
		conf.position.z = conf.mesh.altitude;
		// console.log(conf.position)

		conf.nickname =
			!nickname === false ? nickname : new String("UnNamed_") + conf.immat;
		conf.theta.cur = this.#Formula.rand(0, 360);
		// add floor conf to mob
		conf.floor = this.#Config.floor;

		// push a fresh mob with fresh conf to allMob arrray
		let newmob = new Mob(conf);
		this.#AllMobs.push(newmob);

		// set the new immat
		this.#CurrentMobImmat = this.#AllMobs.length;

		return this.#AllMobs[this.#CurrentMobImmat - 1];
	}
	get_allMobs() {
		return this.#AllMobs.length > 0 ? this.#AllMobs : false;
	}
	updateAllMobs(Player) {
		this.#AllMobs.forEach((mob) => {
			if (mob.conf.states.dead != true) {
				mob.update();
				// // console.log('Animate', mob.conf.position)
				// let nearest = { distance: 0, immat: 0 }
				// let stop = false
				// this.#AllMobs.forEach(othermob => {
				// 	if (mob != othermob && mob.conf.states.dead != true && othermob.conf.states.dead != true) {
				// 		// let dist = mob.bbox.distanceToPoint(new THREE.Vector3(2, 2, 2))
				// 		let dist = mob.bbox.distanceToPoint(othermob.mesh.position)
				// 		console.log(dist)
				// 		if (nearest.distance < dist) { }
				// 		if (dist < 1) {
				// 			nearest.distance = dist
				// 			nearest.immat = othermob.conf.immat

				// 			mob.conf.states.dead = true
				// 			othermob.conf.states.dead = true

				// 			stop = true
				// 			console.log('booom', mob.conf.immat, nearest)
				// 		}
				// 	}
				// 	// console.log('Animate', mob.conf.position)
				// });
			}
		});
	}
	get_distanceFromPlayer(playerPosition, mob) {
		let dist = mob.bbox.distanceToPoint(othermob.mesh.position);
	}
	// addtempodivs(i, mob) { // this need to be remove
	// 	let tempo_mobdiv = document.createElement('div')
	// 	tempo_mobdiv.id = 'mob_' + i
	// 	tempo_mobdiv.textContent = '++' + mob.conf.nickname
	// 	document.getElementById('lesmobs').appendChild(tempo_mobdiv)
	// }
	get_AName(length) {
		let lettreMIN = [
			"a",
			"b",
			"c",
			"d",
			"e",
			"f",
			"g",
			"h",
			"i",
			"j",
			"k",
			"l",
			"m",
			"n",
			"o",
			"p",
			"q",
			"r",
			"s",
			"t",
			"u",
			"v",
			"w",
			"x",
			"y",
			"z",
		];
		let name = "";

		for (let i = 0; i < 3; i++) {
			let lettre = lettreMIN[this.#Formula.rand(0, lettreMIN.length - 1)];
			name += lettre.toUpperCase();
		}

		name += "-";
		name += this.#Formula.rand(666, 999);

		// name += '-'
		// for (let i = 0; i < 5; i++) {
		// 	let lettre = lettreMIN[this.#Formula.rand(0, lettreMIN.length - 1)]
		// 	name += lettre.toUpperCase()
		// }

		return name;
	}
	get_rangersName() {
		return [
			"Guillaume",
			"Pyl",
			"Charlotte",
			"Frédéric",
			"Rémi",
			"Eslam",
			"Charles-L",
			"Audrey",
			"Cédric",
			"Antho",
			"Renaud",
			"Feun",
			"Guillaume",
			"Pyl",
			"Charlotte",
			"Frédéric",
			"Rémi",
			"Eslam",
			"Charles-L",
			"Audrey",
			"Cédric",
			"Antho",
			"Renaud",
			"Feun",
		];
	}
}
