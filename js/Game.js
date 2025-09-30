const conslog = false;
class Game {
	#pause = false;
	#WindowActive;
	#GConfig;
	#Scene;
	#Camera;
	#Renderer;
	// #OrbitControls;
	#Dom;
	#clock;
	// #domEvents; // threex event
	// #GLTFLoader;
	// #things;
	// #Pieces;
	// #loadingmanager;
	// #ImagesManager;
	#SceneManager;

	#PlayerManager;
	#FrontM;
	#Formula;
	#CHATFACTORY;
	constructor() {
		this.HowManyMobs = 25;
		this.#WindowActive = new WindowActive("Flat2");
		this.#Init();
	}
	#Init() {
		if (conslog) console.log("affichage actif:", conslog);
		if (conslog) console.log("Game Mounting !");
		//
		this.#GConfig = new GameConfig();
		if (conslog) console.log("this.#GConfig", this.#GConfig);

		this.stats = {
			hp: {
				name: "Hit Point",
				current: 25,
				max: 100,
				regen: 0.1,
				backgroundColor: "rgba(250, 59, 9, 0.644)",
			},
			energy: {
				name: "Energy",
				current: 100,
				max: 100,
				regen: 1.5,
				backgroundColor: "rgba(9, 223, 20, 0.644)",
			},
			def: {
				name: "defense",
				current: 1,
				max: 100,
				regen: 3,
				backgroundColor: "rgba(9, 59, 223, 0.644)",
			},
		};

		this.#FrontM = new FrontboardManager(this.stats);

		this.#Formula = new Formula();

		this.#SceneManager = new SceneManager(this.#GConfig);

		this.#Scene = this.#SceneManager.get_Scene();
		this.#Camera = this.#SceneManager.get_Camera();
		this.#Renderer = this.#SceneManager.get_Renderer();
		this.#clock = this.#SceneManager.get_Clock();
		//
		// this.#ImagesManager = new ImagesManager();

		//this.#OrbitControls = new THREE.OrbitControls(this.#Camera, this.#Renderer.domElement)

		// this.#domEvents = new THREEx.DomEvents(this.#Camera, this.#Renderer.domElement)
		this.#Dom = new DomManager(this.#Renderer, this.#Camera);
		// --

		// test objects
		// this.#things = new Things(this.#domEvents, this.#Scene);

		// test Pieces
		// this.#Pieces = new Pieces(this.#domEvents, this.#Scene);
		// this.#Scene.add(this.#things.get_thingsGroup());ddd

		// --

		this.#PlayerManager = new PlayerManager(
			0,
			0,
			0,
			this.#GConfig,
			this.#FrontM,
			this.#Camera,
			this.#Scene
		);

		let playerPos = this.#PlayerManager.playerGroupe.position;

		// this.#PlayerManager.playerGroupe.add(this.#Camera)
		this.#Scene.add(this.#PlayerManager.playerGroupe);

		// this.#init_Player()

		// this.#CHATFACTORY = new ChatBotFactory();

		this.MobsManager = new Mobs(this.#GConfig);

		this.allMobs = this.MobsManager.addMobs(this.HowManyMobs, "mobs");

		this.allMobs.forEach((mob) => {
			this.#Scene.add(mob.mesh);
			// this.#Scene.add(mob.bbhelper)
		});

		// console.log('#PlayerManager', this.#PlayerManager)

		this.#Animate();
	}

	#setCameraPositionOnPlayer() {
		// let player = this.#PlayerManager.playerGroupe.position;
		// this.#camera.position.set(
		// 	player.x + this.#GConfig.get_camera('decalage').x,
		// 	player.y + this.#GConfig.get_camera('decalage').y,
		// 	player.z + this.#GConfig.get_camera('decalage').z
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
			var delta = this.#clock.getDelta();
			var elapsed = this.#clock.elapsedTime;
			this.#PlayerManager.update();
			//if (this.#OrbitControls) this.#OrbitControls.update(); // only if controls.enableDamping = true || controls.autoRotate = true

			if (this.allMobs) {
				// this.MobsManager.updateAllMobs()
				let i = 0;
				this.allMobs.forEach((mob) => {
					// console.log(mob)
					let dist = mob.bbox.distanceToPoint(
						this.#PlayerManager.playerGroupe.position
					);
					// console.log(mob.conf.immat, dist)
					if (dist > 2) {
						if (mob.conf.states.collide) {
							if (mob.conf.states.collide.changed === true) {
								console.log(
									"<-- fin de collision avec " + mob.conf.nickname
								);
								mob.mobMesh.material.color =
									mob.conf.states.collide.color.saved;
								mob.conf.states.collide.changed = false;
								// document.getElementById(['mob_' + i]).textContent = Math.floor(dist * 10) / 10
								mob.conf.states.collide.color.saved = false;
								mob.conf.states.collide.color.current = false;
							}
						}
						// console.log(this.#PlayerManager.PlayerMesh.material.color = 'red')
					} else {
						// BOOOOOOM
						if (mob.conf.states.collide.changed === false) {
							mob.conf.states.collide.color.saved =
								mob.mobMesh.material.color;
							mob.conf.states.collide.changed = true;
							// document.getElementById(['mob_' + i]).textContent = Math.floor(dist * 10) / 10
							mob.mobMesh.material.color =
								this.#PlayerManager.PlayerMesh.material.color;
							//{ r: 1, g: 1, b: 1 }
							console.log(
								"--> début de collision avec " + mob.conf.nickname
							);
						}
					}
					mob.update();
					i++;
				});
			}
		}
		// this.#things.update(this.#pause, this.#WindowActive.get_isWindowActive())
		requestAnimationFrame(this.#Animate);
		this.#Renderer.render(this.#Scene, this.#Camera);
		this.#Camera.updateProjectionMatrix();
	};
}
