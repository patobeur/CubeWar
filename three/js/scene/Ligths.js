class Lights {
	#Config;
	#Scene;
	#ambientLight; #directionalLight;
	#helperON
	constructor(Scene, Config) {
		this.#helperON = false
		this.#Scene = Scene
		this.#Config = Config
		this.#Init()
	}
	#Init() {
		if (conslog) console.log('Lights Mounted !')
		this.#init_Lights()
	}
	#init_Lights() {
		this.#init_AmbientLight();
		// this.#init_DirectionalLight();
		this.#testingPointLight()
		// this.#testingspotLight2()
	}
	#init_AmbientLight() {
		this.#ambientLight = new THREE.AmbientLight(
			this.#Config.get_ambientLight('color'),
			this.#Config.get_ambientLight('intensity')
		)
		this.#Scene.add(this.#ambientLight)
	}
	#init_DirectionalLight() {
		this.#directionalLight = new THREE.DirectionalLight(
			this.#Config.get_directionalLight('color'),
			this.#Config.get_directionalLight('intensity')
		);
		this.#directionalLight.penumbra = this.#Config.get_directionalLight('penumbra');
		this.#directionalLight.decay = this.#Config.get_directionalLight('decay');
		this.#directionalLight.distance = this.#Config.get_directionalLight('distance');
		this.#directionalLight.shadow.mapSize.width = this.#Config.get_directionalLight('shadow').mapSize.width;
		this.#directionalLight.shadow.mapSize.height = this.#Config.get_directionalLight('shadow').mapSize.height;
		this.#directionalLight.shadow.camera.near = this.#Config.get_directionalLight('shadow').camera.near;
		this.#directionalLight.shadow.camera.far = this.#Config.get_directionalLight('shadow').camera.far;
		this.#directionalLight.shadow.focus = this.#Config.get_directionalLight('shadow').focus;
		this.#directionalLight.castShadow = this.#Config.get_directionalLight('castShadow')

		this.#directionalLight.position.set(this.#Config.get_directionalLight('position'))
		this.#directionalLight.target.position.set(this.#Config.get_directionalLight('lookat'));

		this.#Scene.add(this.#directionalLight);
		// if (this.#helperON) {
		let DirectionalLightHelper = new THREE.DirectionalLightHelper(this.#directionalLight);
		this.#Scene.add(DirectionalLightHelper);

		// }

	}
	#testingPointLight() {
		let size = { x: 90, y: 90 } // map size
		let spot = [
			{ x: -(size.x / 4), y: -(size.y / 4) },
			{ x: -(size.x / 4), y: (size.y / 4) },
			{ x: (size.x / 4), y: -(size.y / 4) },
			{ x: (size.x / 4), y: (size.y / 4) },
		]
		for (let i = 0; i < 2; i++) {
			let pointLight = new THREE.PointLight(0xFFFFFF, .1);
			pointLight.castShadow = true;
			pointLight.shadow.bias = 0.0001;
			pointLight.shadow.mapSize.width = 2048;
			pointLight.shadow.mapSize.height = 2048;
			pointLight.position.set(
				spot[i].x,
				spot[i].y,
				30
			);
			pointLight.name = 'pointLight_' + i;
			this.#Scene.add(pointLight);

		}
	}
	#testingspotLight2() {
		// set up spot light + helper
		const spotLight = new THREE.SpotLight(0xffffff, .5);
		spotLight.position.set(20, 20, 80);
		// spotLight.angle = Math.PI / 3;
		spotLight.penumbra = 1;
		spotLight.decay = 0;
		spotLight.distance = 100;

		spotLight.castShadow = true;
		spotLight.shadow.focus = 1;
		spotLight.shadow.mapSize.width = 2048;
		spotLight.shadow.mapSize.height = 2048;
		spotLight.shadow.camera.near = 1;
		spotLight.shadow.camera.far = 2000;
		if (this.#helperON) {
			const slHelper = new THREE.SpotLightHelper(spotLight);
			this.#Scene.add(slHelper);
		}

		this.#Scene.add(spotLight, spotLight.target);
	}
}
