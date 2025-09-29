class SpaceShip {
	#spaceShipGroup
	#helice
	constructor() {
		this.#Init()
	}
	#Init() {
		if (conslog) console.log('SpaceShip Mounted !')
		this.#init_spaceShipGroup()
	}
	update = () => {
		this.#helice.rotation.x += Math.PI / 3.6
		this.#spaceShipGroup.rotation.y += Math.PI / 360
	}
	get_spaceShipGroup() {
		return this.#spaceShipGroup ?? false
	}
	#init_spaceShipGroup() {
		this.#spaceShipGroup = new THREE.Group()
		// let origine = new THREE.Vector3(0, 0, 0)

		const bg3 = new THREE.BoxGeometry(1, 1, 0.5);
		const bm1 = new THREE.MeshToonMaterial({ color: 0xff0000 });
		const sm1 = new THREE.MeshToonMaterial({ color: 0xffff00 });
		const sg1 = new THREE.SphereGeometry(0.3, 32, 16);

		const bg1 = new THREE.BoxGeometry(1, 1, 1);
		const box1 = new THREE.Mesh(bg1, bm1);
		box1.castShadow = true;
		box1.position.x = 0;
		box1.position.y = 0;
		box1.position.z = 0;

		const bg2 = new THREE.BoxGeometry(2, .7, .7);
		const box2 = new THREE.Mesh(bg2, bm1);
		box2.castShadow = true;
		box2.position.x = 1;
		box2.position.y = 0;
		box2.position.z = 0.05;
		// box2.rotation.y = -(Math.PI / 30);

		const box3 = new THREE.Mesh(bg3, bm1);
		box3.castShadow = true;
		box3.position.x = .5;
		box3.position.y = 0;
		box3.position.z = .5;
		// box3.rotation.y = (Math.PI / 10);

		// const bg4 = new THREE.BoxGeometry(3, .3, 0.5);
		// const box4 = new THREE.Mesh(bg4, bm1);
		// box4.castShadow = true;
		// box4.position.x = 1.5;
		// box4.position.y = 0;
		// box4.position.z = .1;
		// box4.rotation.y = -(Math.PI / 30);

		const sph1 = new THREE.Mesh(sg1, sm1);
		sph1.castShadow = true;
		sph1.position.x = -0.5;
		sph1.position.y = 0;
		sph1.position.z = 0;

		// this.#helice
		const hg = new THREE.BoxGeometry(.05, 3, 0.3);
		this.#helice = new THREE.Mesh(hg, sm1);
		this.#helice.castShadow = true;
		this.#helice.position.x = -.7;
		this.#helice.position.y = 0;
		this.#helice.position.z = 0;

		const wg = new THREE.BoxGeometry(.7, 5, .2);
		const wings = new THREE.Mesh(wg, sm1);
		wings.castShadow = true;
		wings.position.x = 0;
		wings.position.y = 0;
		wings.position.z = 0;

		const wg2 = new THREE.BoxGeometry(.6, 2, .1);
		const wings2 = new THREE.Mesh(wg2, sm1);
		wings2.castShadow = true;
		wings2.position.x = 1.75;
		wings2.position.y = 0;
		wings2.position.z = .25;


		this.#spaceShipGroup.add(box1, box2, box3, sph1, this.#helice, wings, wings2)

		// this.#spaceShipGroup.rotation.x = -Math.PI / 2

		console.log(this.#spaceShipGroup)
	}
}
