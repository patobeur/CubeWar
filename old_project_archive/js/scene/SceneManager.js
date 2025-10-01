class SceneManager {
	#Config;
	#Scene; #Camera; #Renderer;
	#Lights;
	#Floors
	#Clock;
	constructor(Config) {
		this.#Config = Config;
		this.#Init()
	}
	#Init() {
		if (conslog) console.log('SceneManager Mounted !')
		this.#init_Scene()// -- SCENE
		this.#init_add_floor()// -- Floor
		this.#init_Camera()// -- CAMERA
		this.#init_Renderer()// -- RENDER
		this.#init_add_Lights()// -- LIGHTS
		this.#init_Clock()// -- Timer
	}
	#init_Scene() {
		this.#Scene = new THREE.Scene()
		this.#Scene.name = this.#Config.sceneName
	}
	#init_Camera() {
		this.#Camera = new THREE.PerspectiveCamera(
			this.#Config.get_camera('fov'),
			this.#Config.get_camera('aspect'),
			this.#Config.get_camera('near'),
			this.#Config.get_camera('far'),
		)
		this.#Camera.name = this.#Config.get_camera('name')
		// this.#Camera.aspect = window.innerWidth / window.innerHeight;

		this.#Camera.position.x = this.#Config.get_camera('position').x
		this.#Camera.position.y = this.#Config.get_camera('position').y
		this.#Camera.position.z = this.#Config.get_camera('position').z
		if (conslog) console.log('init Camera.position', this.#Camera.position)


		this.#Camera.position.set(
			this.#Camera.position.x + this.#Config.get_camera('decalage').x,// + player.x,
			this.#Camera.position.y + this.#Config.get_camera('decalage').y,// + player.y,
			this.#Camera.position.z + this.#Config.get_camera('decalage').z,// + player.z
		);
		if (conslog) console.log('init Camera.position decalage', this.#Camera.position)

		// this.#Camera.lookAt.x = this.#Config.get_camera('lookat').x
		// this.#Camera.lookAt.y = this.#Config.get_camera('lookat').y
		// this.#Camera.lookAt.z = this.#Config.get_camera('lookat').z

		this.#Camera.updateProjectionMatrix();
	}
	#init_Renderer() {
		this.#Renderer = new THREE.WebGLRenderer()

		this.#Renderer.domElement.id = this.#Config.canvasId
		this.#Renderer.setSize(window.innerWidth, window.innerHeight)
		this.#Renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

		this.#Renderer.outputEncoding = THREE.sRGBEncoding;
		this.#Renderer.shadowMap.enabled = true;
		// this.#Renderer.outputEncoding = this.#Config.get_renderer('outputEncoding')
		// this.#Renderer.shadowMap.enabled = this.#Config.get_renderer('shadowMapenabled')

		this.#Renderer.shadowMap.type = this.#Config.get_renderer('shadowMaptype')

		this.#Renderer.setClearColor(
			this.#Config.get_renderer('clearcolor'),
			this.#Config.get_renderer('intensity')
		)
		// console.log('Renderer', this.#Renderer)
	}
	#init_add_Lights = () => {
		this.#Lights = new Lights(this.#Scene, this.#Config)
	}
	#init_add_floor() {
		this.#Floors = new Floors(this.#Scene, this.#Config)
	}
	#init_Clock() {
		this.#Clock = new THREE.Clock();
	}
	get_Clock() {
		return this.#Clock
	}
	get_Scene() {
		return this.#Scene
	}
	get_Camera() {
		return this.#Camera
	}
	get_Renderer() {
		return this.#Renderer
	}
}
