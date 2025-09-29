class Floors {
	#Config;
	#Scene;
	constructor(Scene, Config) {
		this.#Scene = Scene
		this.#Config = Config
		this.#Init()
	}
	#Init() {
		if (conslog) console.log('Floors Mounted !')
		this.#init_floor()
	}
	#init_floor() {
		// somme shape and colors
		const groundGeometry = new THREE.BoxGeometry(90, 90, .2);
		const groundMaterial = new THREE.MeshPhongMaterial({ color: 0xFFFFFF });
		// create mesh
		var mesh = new THREE.Mesh(groundGeometry, groundMaterial);
		// somme updates
		mesh.receiveShadow = true;
		// mesh.rotation.x = - Math.PI;
		mesh.position.z = -.1
		mesh.name = "floor";
		// add to scene
		this.#Scene.add(mesh);
	}
}
