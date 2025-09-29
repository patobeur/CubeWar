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

		this.#Scene.add(this.#PlayerManager.playerGroupe)

        this.projectiles = [];
		this.colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff];
		this.foodItems = [];
		this.MobManag = new Mobs()

		this.allMobs = [];
		for (let i = 0; i < 39; i++) {
			this.#spawnMob();
		}
		this.allMobs = this.MobManag.get_allMobs();

		for (let i = 0; i < 10; i++) {
			this.#spawnFood();
		}

		this.#Animate()
	}

	#spawnFood() {
		const position = this.#Formula.get_aleaPosOnFloor({ x: 40, y: 40, z: 0 });
		const food = new Food(position);
		this.foodItems.push(food);
		this.#Scene.add(food.mesh);
	}

    spawnProjectile(position, direction, shooter) {
        const projectile = new Projectile(position, direction);
        projectile.shooter = shooter; // Keep track of who shot
        this.projectiles.push(projectile);
        this.#Scene.add(projectile.mesh);
    }

	#spawnMob() {
		const color = this.colors[this.#Formula.rand(0, this.colors.length - 1)];
		const mob = this.MobManag.addOne(false, 'mobs', color);
		this.#Scene.add(mob.mesh);
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
			this.#PlayerManager.update(this);

            // Update projectiles
			const activeProjectiles = [];
			this.projectiles.forEach(projectile => {
				projectile.update();

				let hit = false;
				// Check for collision with mobs
				this.allMobs.forEach(mob => {
                    if (projectile.shooter !== mob && projectile.mesh.position.distanceTo(mob.mesh.position) < 1.0) {
						mob.stats.hp.current -= projectile.damage;
						hit = true;
					}
				});

                // check collision with player
                if(projectile.shooter !== this.#PlayerManager && projectile.mesh.position.distanceTo(this.#PlayerManager.playerGroupe.position) < 1.0) {
                    this.#PlayerManager.stats.hp.current -= projectile.damage;
                    hit = true;
                }

				// Remove projectiles that are out of bounds or hit something
				if (hit || projectile.mesh.position.length() > 100) {
					this.#Scene.remove(projectile.mesh);
				} else {
					activeProjectiles.push(projectile);
				}
			});
			this.projectiles = activeProjectiles;

			if (this.allMobs) {
				this.MobManag.updateAllMobs(this.foodItems, this);

				const consumedFood = new Set();
				this.allMobs.forEach(mob => {
					this.foodItems.forEach(food => {
						if (!consumedFood.has(food) && mob.mesh.position.distanceTo(food.mesh.position) < 1.5) {
							mob.stats.hp.current = Math.min(mob.stats.hp.current + food.nutritionalValue, mob.stats.hp.max);
							consumedFood.add(food);
						}
					});
				});

				if (consumedFood.size > 0) {
					consumedFood.forEach(food => {
						this.#Scene.remove(food.mesh);
					});
					this.foodItems = this.foodItems.filter(food => !consumedFood.has(food));
				}

				let deadMobsCount = 0;
				const aliveMobs = [];

				this.allMobs.forEach(mob => {
					if (mob.stats.hp.current <= 0) {
						deadMobsCount++;
						this.#Scene.remove(mob.mesh);
					} else {
						aliveMobs.push(mob);
					}
				});

				for (let i = 0; i < deadMobsCount; i++) {
					this.#spawnMob();
				}

				if (deadMobsCount > 0) {
					this.allMobs = this.MobManag.get_allMobs();
				}
			}
		}
		// this.#things.update(this.#pause, this.#WindowActive.get_isWindowActive())
		requestAnimationFrame(this.#Animate)
		this.#Renderer.render(this.#Scene, this.#Camera)
		this.#Camera.updateProjectionMatrix();

	}
}