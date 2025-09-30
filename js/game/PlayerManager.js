"use strict";
class PlayerManager {
	#GConfig;
	#PConfig
	#Camera
	#StatManager
	constructor(x = 0, y = 0, z = 0, GConfig, StatManager, Camera, Scene, faction = 'blue', role = 'protecteur') {
		this.scene = Scene

		this.type = 'player';
		this.#GConfig = GConfig;
		this.#PConfig = new PlayerConfig(role);
		this.stats = this.#PConfig.get_stats();
		this.id = 'Player_1'; // Unique ID for the player
		this.faction = faction; // Default faction
		this.lastAttack = 0; // Timestamp of the last attack



		this.ControlsM = new ControlsManager(this.type, this.#GConfig);

		this.#StatManager = StatManager;
		this.Formula = new Formula();
		this.#Camera = Camera

		this.playerGroupe = new THREE.Group();

		this.position = {
			x: x,
			y: y,
			z: z,
			thetaDeg: 0
		};

		// this.playerOpacity = .8
		// this.canonPosition.set(0, .5, 0);
		this.playerMeshName = "Noob";

		this.regenTimer = { current: 0, max: 10 };

		this.damaged = false;

		this.largeur = 1;
		this.longueur = 1;
		this.hauteur = 1;

		// this.rotatioYAngle = THREE.Math.degToRad(1); // 1deg

		// this.rotation = {
		// 	_x: 0,
		// 	_y: 0,
		// 	_z: 0,
		// };
		this.receiveShadow = true;
		this.castShadow = true;
		this.rotatioYAngle = 0;

		this.playerColor = this.#PConfig.get_value('playerColor');

		this.torche = this.getTorchlight();
		this.#addPlayerOrbiter({ x: -.5, y: 0, z: .5 }, { x: .25, y: .25, z: .25 });

		this.#init();
		this.#init_camera();

	}

	takeDamage(amount) {
		if (this.stats.hp.current <= 0) return;

		this.stats.hp.current -= amount;
		this.#StatManager.refresh('hp', this.stats.hp.current);

		if (this.stats.hp.current <= 0) {
			console.log("Player has been defeated.");
			// Handle player death (e.g., show a game over screen)
		}
	}

	#init_camera() {

		this.#Camera.position.set(
			this.#GConfig.get_camera('decalage').x + this.playerGroupe.position.x,
			this.#GConfig.get_camera('decalage').y + this.playerGroupe.position.y,
			this.#GConfig.get_camera('decalage').z + this.playerGroupe.position.z
		);
		this.#Camera.lookAt = (new THREE.Vector3(this.playerGroupe.position.x, this.playerGroupe.position.y, this.playerGroupe.position.z));

	}
	#init() {
		if (conslog) console.log('PlayerManager Mounted !')
		this.#addMeshToModel();
		this.#addModelToGroupe();


		// SkillsManager
		this.missiles = [];

		this.skillsInUse = []
		this.SkillsImmat = this.skillsInUse.length - 1;


	}
	update() {
		console.log('player update -->')
		this.#playerMoveActions();
		this.#updateShoots();
		if (this.playerOrbiter) {
			this.Formula.get_NextOrbitPosXYZ2(
				this.playerOrbiter,
				this.playerGroupe);
		}

		this.#regen();
	}
	#addPlayerOrbiter(pos, size) {
		let player = this.playerGroupe.position;
		let color = "white";//this.playerColor
		let material = new THREE.MeshPhongMaterial({ color: color, wireframe: false });
		this.playerOrbiter = new THREE.Mesh(
			new THREE.BoxGeometry(size.x, size.y, size.z),
			material
		);
		this.playerOrbiter.material.transparent = true
		this.playerOrbiter.material.opacity = .8

		this.playerOrbiter.name = "playerOrbiter";
		this.playerOrbiter.position.set(player.x + pos.x, player.y + pos.y, player.z + pos.z);
		// this.playerOrbiter.position.set(player.x + pos.x - (size.x / 2), player.y + pos.y - (size.y / 2), player.z + pos.z - (size.z / 2));

		this.playerOrbiter.centerDistance = this.Formula.getDistanceXYZ(this.playerGroupe, this.playerOrbiter);
		this.step = 1 / 10
		this.playerOrbiter.castShadow = true;
		this.playerOrbiter.receiveShadow = true;
		this.playerOrbiter.matrixAutoUpdate = true;
		this.playerOrbiter.theta = { x: [0, 360, this.step], y: [0, 360, this.step], z: [0, 360, 0], delay: { current: 0, max: 1000 } };

		this.playerGroupe.add(this.playerOrbiter);
		//console.log(this.playerGroupe)
	}

	#regen() {
		// this.stats.energy.current += this.stats.energy.regen
		if (this.regenTimer.current === this.regenTimer.max) {
			this.regenTimer.current = 0;
			for (var key in this.stats) {
				if (this.stats[key].regen) {
					if (this.stats[key].current <= this.stats[key].max - this.stats[key].regen) {
						this.stats[key].current += this.stats[key].regen
						// if (this.type === "PLAYER") {
						//console.log("PLAYER PLAYERPLAYER PLAYERPLAYER PLAYERPLAYER PLAYERPLAYER PLAYERPLAYER PLAYERPLAYER PLAYERPLAYER PLAYERPLAYER PLAYERPLAYER PLAYERPLAYER PLAYERPLAYER PLAYERPLAYER PLAYERPLAYER PLAYER")
						if (this.#StatManager) {
							this.#StatManager.refresh(key, this.stats[key].current)
						}
						else { console.log('no this.#StatManager') }
						// }
					}
				}
			}
		}
		this.regenTimer.current++
	}
	getTorchlight() {
		let torchlight = {
			x: 1, y: 1, z: .5,
			delta: 0,
			PointLight: [0xffEEEE, .6, 20]
		}
		return torchlight;
	}
	#addMeshToModel() {
		// cube player object
		let playerMesh = new THREE.Mesh(
			new THREE.BoxGeometry(this.largeur, this.longueur, this.hauteur),
			new THREE.MeshPhongMaterial({ color: this.playerColor, wireframe: false })
		);
		// playerMesh.position.set(this.position.x, this.position.y, this.position.z);
		playerMesh.receiveShadow = this.receiveShadow;
		playerMesh.castShadow = this.castShadow;
		playerMesh.material.transparent = true
		playerMesh.material.opacity = .8
		playerMesh.name = this.playerMeshName;
		// playerMesh.traverse(n => {
		// 	if (n.isMesh) {
		// 		n.castShadow = true;
		// 		n.receiveShadow = true;
		// 		if (n.material.map) n.material.map.anisotropy = 16;
		// 	}
		// });
		this.PlayerMesh = playerMesh
	}
	#addModelToGroupe() {
		// if (this.torche) this.playerGroupe.add(this.torche);
		this.playerGroupe.add(this.PlayerMesh)
		let canonPart = new THREE.Mesh(
			new THREE.BoxGeometry(.5, .8, .5),
			new THREE.MeshPhongMaterial({ color: this.playerColor, wireframe: false })
		);
		canonPart.name = "Cannon";
		canonPart.material.transparent = true
		canonPart.material.opacity = .8
		canonPart.position.set(0, .5, 0);
		canonPart.receiveShadow = this.receiveShadow;
		canonPart.castShadow = this.castShadow;
		this.playerGroupe.add(canonPart);
		this.playerGroupe.position.set(this.position.x, this.position.y, this.position.z);
	}
	#playerMoveActions() {
		if (this.ControlsM) {
			const speed = this.stats.speed.current / 10; // Use configured speed with scaling
			this.position.thetaDeg = this.ControlsM.thetaDeg
			this.playerGroupe.rotation.z = THREE.Math.degToRad(this.position.thetaDeg);
			// console.log('rot deg:', this.ControlsM.thetaDeg)

			if (this.ControlsM.forward || this.ControlsM.reverse || this.ControlsM.left || this.ControlsM.right) {
				if (this.ControlsM.forward) { this.playerGroupe.position.y += speed }//; direction.angle = 0 }
				if (this.ControlsM.reverse) { this.playerGroupe.position.y -= speed }//; direction.angle = 180 }
				if (this.ControlsM.left) { this.playerGroupe.position.x -= speed }//; direction.angle = 90 }
				if (this.ControlsM.right) { this.playerGroupe.position.x += speed }//; direction.angle = 270 }
				this.#Camera.position.set(
					this.#GConfig.get_camera('decalage').x + this.playerGroupe.position.x,
					this.#GConfig.get_camera('decalage').y + this.playerGroupe.position.y,
					this.#GConfig.get_camera('decalage').z + this.playerGroupe.position.z
				);
				// this.#Camera.lookAt.set(
				// 	this.playerGroupe.position.x,
				// 	this.playerGroupe.position.y,
				// 	this.playerGroupe.position.z
				// );
			}
			// TSM.setCameraPosition();
		}
		else {
			// this is a mOB
		}
	}
	// addPlayers() {
	// 	this.#addPlayerGroupeToScene();
	// }
	// #addPlayerGroupeToScene() {
	// 	scene.addThis(this.playerGroupe);
	// }

	// ----------------------------------------------------------------------------------
	// Shoot manager
	// ----------------------------------------------------------------------------------
	#shoot(skillname) {
		if (this.ControlsM) {
			if (this.missiles.length < 5) {
				let skill = new SkillsManager(
					skillname,
					this.playerGroupe.position,
					this.playerGroupe.rotation,
					this.hauteur,
					this.scene
				);

				// console.log('--------------------------------')
				// console.log(skill.skillDatas.recastTimer)
				// console.log(skill.birthDay - new Date())
				// console.log(new Date())
				// console.log(skill)
				if (skill.skillDatas.energyCost < this.stats.stamina.current) {
					this.stats.stamina.current -= skill.skillDatas.energyCost;
					if (this.#StatManager) {
						this.#StatManager.refresh('stamina', this.stats.stamina.current)
					}
					skill.init();
				}

			}
		}
	}
	#updateShoots() {
		if (this.ControlsM.shoot1) {
			this.ControlsM.shoot1 = false;
			this.#shoot('fireball');
		}
		if (this.ControlsM.shoot2) {
			this.ControlsM.shoot2 = false;
			this.#shoot('weedball');
		}
		if (this.ControlsM.shoot3) {
			this.ControlsM.shoot3 = false;
			this.#shoot('cube');
		}

	}
}
