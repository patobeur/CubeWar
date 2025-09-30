class Floors {
	#Config;
	#Scene;
	#currentImmat = 0
	constructor(Scene, Config) {
		this.#Scene = Scene
		this.#Config = Config
		this.#Init()
	}
	#Init() {
		if (conslog) console.log('Floors Mounted !')
		// console.log('Config', this.#Config)
		this.#init_floor()
	}
	#init_floor() {
		let config = this.get_currentFloorConf()
		this.#Config.floor = config

		// somme shape and colors
		const groundGeometry = new THREE.BoxGeometry(config.size.x, config.size.y, config.size.z);
		const groundMaterial = new THREE.MeshPhongMaterial({ color: config.color });
		// create mesh
		var mesh = new THREE.Mesh(groundGeometry, groundMaterial);
		// somme updates
		mesh.receiveShadow = true;
		// mesh.rotation.x = - Math.PI;
		mesh.position.z = config.position.z
		mesh.name = config.groundZero;
		// add to scene
		this.#Scene.add(mesh);
	}
	get_currentFloorConf = () => {
		let floors = {
			0: {
				name: 'groundZero',
				size: { x: 128, y: 64, z: .2 },
				position: { x: -32, y: -32, z: -.1 },
				color: 0xFFFFFF,
				receiveShadow: true
			}
		}
		return floors[this.#currentImmat]
	}
}
