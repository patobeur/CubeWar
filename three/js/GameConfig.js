class Config {
	version = 0.000001;
	sceneName = 'FlatWorld';
	canvasId = 'game';
	#renderer = false;
	// config;
	#camera;
	#directionalLight = false;
	#ambientLight = false;
	#spotLight = false;
	#orbitcontrols = true;
	constructor() {
		this.#Init()
	}
	#Init() {
		if (conslog) console.log('Config Mounted !')
		this.#renderer = {
			color: 0x000000,
			// color: 0xB7C3F3,
			clearcolor: 0xFFFFFF,
			intensity: new Number(0.0),
			shadowMapenabled: true,
			shadowMaptype: THREE.PCFSoftShadowMap,
			outputEncoding: THREE.sRGBEncoding
		}
		this.#ambientLight = {
			color: 0xFFFFFF,
			intensity: 0.4
		}
		this.#directionalLight = {
			color: 0xFFFFFF,
			intensity: .7,
			castShadow: true,
			position: new THREE.Vector3(0, 0, 10),
			lookat: new THREE.Vector3(0, 0, 0),
			penumbra: 1,
			decay: 1,
			distance: 5000,
			shadow: {
				mapSize: {
					width: 2048,
					height: 2048
				},
				camera: {
					near: 1,
					far: 5000
				},
				focus: 1
			},
			lookat: new THREE.Vector3(0, 0, 0),
		}
		this.#spotLight = {
			color: 0xffffff,
			intensity: 0.5,
			position: new THREE.Vector3(1, 1, 1),
			angle: Math.PI / 4,
			penumbra: 0.1,
			decay: 0.1,
			distance: 1,
			castShadow: {
				mapSize: {
					width: 512,
					height: 512
				},
				camera: {
					near: 1,
					far: 5000
				},
				focus: 1
			},
			lookat: new THREE.Vector3(0, 0, 0),
		}
		this.#camera = {
			name: 'Camera',
			fov: 40,
			aspect: window.innerWidth / window.innerHeight,
			near: 1,
			far: 5000,
			zoom: { step: .5, zmin: 10, zmax: 80 },
			position: new THREE.Vector3(0, 5, 0),
			decalage: { x: 0, y: 0, z: 40 },
			lookat: { x: 0, y: 0, z: 0 },
		}
	}
	get_camera(value) {
		if (this.#camera && this.#camera[value]) {
			return this.#camera[value]
		}
		console.log("'" + value + '" n\'existe pas (get_camera)')
	}
	get_renderer(value) {
		if (this.#renderer && this.#renderer[value]) {
			return this.#renderer[value]
		}
		console.log("'" + value + '" n\'existe pas (get_renderer)')

	}
	get_directionalLight(value) {
		if (this.#directionalLight && this.#directionalLight[value]) {
			return this.#directionalLight[value]
		}
		console.log("'" + value + '" n\'existe pas (get_directionalLight)')
	}
	get_ambientLight(value) {
		if (this.#ambientLight && this.#ambientLight[value]) {
			return this.#ambientLight[value]
		}
		console.log("'" + value + '" n\'existe pas (get_ambientLight)')
	}
	get_orbitcontrols() {
		return this.#orbitcontrols
	}
}
