const conslog = false;
class Game {
	#pause = false;
	#WindowActive;
	#Config;
	#Scene; #Camera; #Renderer;
	#OrbitControls;
	#Dom;
	#clock;
	#domEvents // threex event
	#GLTFLoader;
	#things;
	#Pieces;
	#loadingmanager;
	#ImagesManager;
	#SceneManager;
	// #spaceShip;// test

	#PlayerManager;
	#FrontM;
	#Formula;
	#CHATFACTORY
	constructor() {
		this.#WindowActive = new WindowActive('Flat2');
		this.#Init()
	}
	#Init() {
		if (conslog) console.log('affichage actif:', conslog)
		if (conslog) console.log('Game Mounting !')
		//
		this.#Config = new Config()
		//
		// this.#FrontM = new FrontboardManager();

		this.#Formula = new Formula();
		this.#SceneManager = new SceneManager(this.#Config);
		this.#Scene = this.#SceneManager.get_Scene()
		this.#Camera = this.#SceneManager.get_Camera()
		this.#Renderer = this.#SceneManager.get_Renderer()
		this.#clock = this.#SceneManager.get_Clock()
		//
		// this.#ImagesManager = new ImagesManager();

		//this.#OrbitControls = new THREE.OrbitControls(this.#Camera, this.#Renderer.domElement)

		// this.#domEvents = new THREEx.DomEvents(this.#Camera, this.#Renderer.domElement)
		this.#Dom = new DomManager(this.#Renderer, this.#Camera)
		// --

		// test objects
		// this.#things = new Things(this.#domEvents, this.#Scene);


		// test Pieces
		// this.#Pieces = new Pieces(this.#domEvents, this.#Scene);
		// this.#Scene.add(this.#things.get_thingsGroup());ddd

		// --


		this.#PlayerManager = new PlayerManager(0, 0, 0, "player", this.#Config, this.#FrontM, this.#Camera)

		let playerPos = this.#PlayerManager.playerGroupe.position;

		// this.#PlayerManager.playerGroupe.add(this.#Camera)
		this.#Scene.add(this.#PlayerManager.playerGroupe)

		// this.#init_Player()

		// this.#CHATFACTORY = new ChatBotFactory();










		this.MobManag = new Mobs()

		this.rangers = ['Guillaume', 'Pyl', 'Charlotte', 'Frédéric', 'Rémi', 'Eslam', 'Charles-L', 'Audrey', 'Cédric', 'Antho', 'Renaud', 'Feun']
		this.allMobs = this.MobManag.addMobs(this.rangers, 'mobs')

		this.allMobs.forEach(mob => {
			this.#Scene.add(mob.mesh)
			console.log(mob)
		});








		this.#Animate()
	}

	#setCameraPositionOnPlayer() {
		// let player = this.#PlayerManager.playerGroupe.position;
		// this.#camera.position.set(
		// 	player.x + this.#Config.get_camera('decalage').x,
		// 	player.y + this.#Config.get_camera('decalage').y,
		// 	player.z + this.#Config.get_camera('decalage').z
		// );
		// this.#camera.lookAt(player.x, player.y, player.z);
	}
	#init_Player() {
		// this.#PlayerArray[this.#PlayerNum] = new PlayerManager(0, 0, 0);
		// MOBS[0] = new PlayerManager(5, 0, 0, "MOB");
		// MOBS[1] = new PlayerManager(5, 5, 0, "MOB");
	}

	#Animate = () => {
		if (!this.#pause && this.#WindowActive.get_isWindowActive()) {
			var delta = this.#clock.getDelta()
			var elapsed = this.#clock.elapsedTime
			this.#PlayerManager.update();
			//if (this.#OrbitControls) this.#OrbitControls.update(); // only if controls.enableDamping = true || controls.autoRotate = true


			if (this.allMobs) {

				this.MobManag.updateAllMobs()
				// this.allMobs.forEach(mob => {
				// });
			}
		}
		// this.#things.update(this.#pause, this.#WindowActive.get_isWindowActive())
		requestAnimationFrame(this.#Animate)
		this.#Renderer.render(this.#Scene, this.#Camera)
		this.#Camera.updateProjectionMatrix();

	}
}
