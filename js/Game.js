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
	#StatManager;
	#FrontM;
	#Formula;
	#CHATFACTORY;
	#FactionManager;

	#targetNotification;
	#attackerCard;
	#attackerName;
	#attackerRole;
	#attackerHp;

	constructor(selectedFaction, selectedRole, uiElements) {
		this.playerFaction = selectedFaction;
		this.playerRole = selectedRole;
		this.#targetNotification = uiElements.targetNotification;
		this.#attackerCard = uiElements.attackerCard;
		this.#attackerName = uiElements.attackerName;
		this.#attackerRole = uiElements.attackerRole;
		this.#attackerHp = uiElements.attackerHp;
		this.#WindowActive = new WindowActive("Flat2");
		this.#Init();
	}
	#Init() {
		if (conslog) console.log("affichage actif:", conslog);
		if (conslog) console.log("Game Mounting !");
		//
		this.#GConfig = new GameConfig();
		if (conslog) console.log("this.#GConfig", this.#GConfig);

		this.#StatManager = new StatManager();

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

		this.#FactionManager = new FactionManager();

		const factionColor = this.#FactionManager.factions[this.playerFaction].color;
		this.#PlayerManager = new PlayerManager(
			0,
			0,
			0,
			this.#GConfig,
			this.#StatManager,
			this.#Camera,
			this.#Scene,
			this.playerFaction,
			factionColor,
			this.playerRole
		);

		this.#StatManager.initStats(this.#PlayerManager.stats);
		this.#FactionManager.addMobToFaction(this.#PlayerManager, this.#PlayerManager.faction);
		let playerPos = this.#PlayerManager.playerGroupe.position;

		// this.#PlayerManager.playerGroupe.add(this.#Camera)
		this.#Scene.add(this.#PlayerManager.playerGroupe);

		// this.#init_Player()

		// this.#CHATFACTORY = new ChatBotFactory();

		this.MobsManager = new Mobs(this.#GConfig, this.#FactionManager, this.playerFaction);

		this.MobsManager.addMobs(this.playerFaction);
		this.MobsManager.addClouds(5); // Add 5 clouds
		this.allMobs = this.MobsManager.get_allMobs();


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
				const player = this.#PlayerManager;
				const now = Date.now();
				const attackCooldown = 1000; // 1 second

				// --- Combat Phase ---
				this.allMobs.forEach((mob) => {
					if (mob.conf.states.dead) return;

					// Player vs Mob
					// Player vs Mob (non-neutral factions only)
					if (player.faction !== 'neutral' && mob.conf.faction !== 'neutral' && player.faction !== mob.conf.faction) {
						const distance = player.playerGroupe.position.distanceTo(mob.mesh.position);
						if (distance <= 2.0) {
							if (!player.lastAttack || now - player.lastAttack > attackCooldown) {
								mob.takeDamage(player.stats.force.current);
								player.lastAttack = now;
							}
							if (now - mob.conf.lastAttack > attackCooldown) {
								player.takeDamage(mob.conf.force);
								mob.conf.lastAttack = now;
							}
						}
					}

					// Mob vs Mob (non-neutral factions only)
					this.allMobs.forEach((otherMob) => {
						if (mob === otherMob || otherMob.conf.states.dead) return;
						if (mob.conf.faction !== 'neutral' && otherMob.conf.faction !== 'neutral' && mob.conf.faction !== otherMob.conf.faction) {
							const distance = mob.mesh.position.distanceTo(otherMob.mesh.position);
							if (distance <= 2.0) {
								if (now - mob.conf.lastAttack > attackCooldown) {
									otherMob.takeDamage(mob.conf.force);
									mob.conf.lastAttack = now;
								}
							}
						}
					});
				});

				// --- AI and Position Update Phase ---
				this.allMobs.forEach((mob) => {
					mob.update(player, this.allMobs, this.#Camera, this.#Scene);
				});

				// --- Cleanup Phase ---
				const deadMobs = this.allMobs.filter(mob => mob.conf.states.dead);
				deadMobs.forEach(mob => {
					this.#Scene.remove(mob.mesh);
					this.#FactionManager.removeMobFromFaction(mob);
				});

				this.allMobs = this.allMobs.filter(mob => !mob.conf.states.dead);

				// --- UI Update Phase ---
				const attacker = this.allMobs.find(mob => mob.conf.isTargetingPlayer);
				if (attacker) {
					this.#targetNotification.classList.remove('hidden');
					this.#attackerCard.classList.remove('hidden');
					this.#attackerName.textContent = attacker.conf.nickname;
					this.#attackerRole.textContent = attacker.conf.role;
					this.#attackerHp.textContent = attacker.conf.hp;
				} else {
					this.#targetNotification.classList.add('hidden');
					this.#attackerCard.classList.add('hidden');
				}
			}
		}
		// this.#things.update(this.#pause, this.#WindowActive.get_isWindowActive())
		requestAnimationFrame(this.#Animate);
		this.#Renderer.render(this.#Scene, this.#Camera);
		this.#Camera.updateProjectionMatrix();
	};
}
