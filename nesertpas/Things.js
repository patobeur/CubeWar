class Things {
	#thingsGroup;
	#domEvents;
	#actions;
	#allItems;
	#Scene;
	#test;
	#gap = .2; // espace entre les cases
	#cote = 8;// nombre de case sur un cote
	#formula;
	constructor(domEvents, Scene) {
		// this.#test = 'toto';
		this.#Scene = Scene;
		this.#allItems = [];
		this.#actions = {
			groupRotating: true
		}
		this.#domEvents = domEvents
		this.#Init()
	}
	#Init() {
		if (conslog) console.log('Things Mounted !')
		this.#init_things()
		this.#Scene.add(this.#get_thingsGroup());
	}
	update = (pause, Listener) => {
		if (!Listener && this.#actions.groupRotating) {
			this.#thingsGroup.rotation.z += (Math.PI / 360) / 5
		}
		this.#allItems.forEach(element => {
			element.update();
		});
	}
	#get_thingsGroup() {
		return this.#thingsGroup ?? false
	}
	#init_things() {

		this.#thingsGroup = new THREE.Group()
		this.#thingsGroup.rotation.x = -Math.PI / 2
		// let origine = new THREE.Vector3(0, 0, 0)

		let datas = {
			size: { x: 1, y: 1, z: .1 },
			position: { x: 0, y: 0, z: 0 },
			name: '',
			id: '',
			rotate: false
		}

		let gap = .2;
		let cote = 10;
		let width = (cote * datas.size.x) + ((cote - 1) * gap)
		let height = (cote * datas.size.y) + ((cote - 1) * gap)
		let depth = datas.size.z


		for (let row = 0; row < cote; row++) {
			for (let col = 0; col < cote; col++) {

				datas.position.x = (row * 1) + (row * gap) - (width / 2) + (datas.size.x / 2)
				datas.position.y = (col * 1) + (col * gap) - (height / 2) + (datas.size.y / 2)
				datas.position.z = (depth / 2) + (datas.size.z / 2)

				datas.name = 'box_' + row + '_' + col
				datas.id = row + '_' + col

				let newthing = new Thing(datas, this.#domEvents, this.#Scene);
				let newthingmesh = newthing.get_mesh();

				// this.#allItems.push({
				// 	mesh: newthing,
				// 	datas: datas
				// })

				this.#allItems.push(newthing)
				this.#thingsGroup.add(newthingmesh)
			}
		}
		// this.#thingsGroup.add(this.#get_ASphere())

	}
	#get_ASphere = (pos) => {
		const geometry = new THREE.SphereGeometry(0.3, 32, 16);
		const material = new THREE.MeshToonMaterial({ color: 0xffFF00 });

		const aSphere = new THREE.Mesh(geometry, material);
		aSphere.castShadow = true;
		aSphere.position.x = 0;
		aSphere.position.y = 0;
		aSphere.position.z = 0;
		return aSphere
	}
}
