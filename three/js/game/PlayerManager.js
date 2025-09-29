"use strict";
class PlayerManager {
	#Config;
	#PlayerConfig
	#Camera
	#FrontM
	constructor(x = 0, y = 0, z = 0, type = "player", Config, FrontM, Camera) {
		this.type = type;
		this.#Config = Config;
		this.ControlsM = new ControlsManager(this.type, this.#Config);

		this.#FrontM = FrontM;
		this.#PlayerConfig = new PlayerConfig();
		this.Formula = new Formula();
		this.#Camera = Camera

		this.playerGroupe = new THREE.Group();

		this.position = {
			x: x,
			y: y,
			z: z,
			thetaDeg: 0
		};

		this.playerMeshName = "Noob";

		this.stats = new CubeStats(this.#PlayerConfig.get_value('stats'));
		this.regenTimer = { current: 0, max: 10 };

		this.damaged = false;

		this.speed = 0;
		this.maxSpeed = .1
		this.maxRevSpeed = this.maxSpeed
		this.friction = this.maxSpeed / 20;
		this.acceleration = .01;

		this.largeur = 1;
		this.longueur = 1;
		this.hauteur = 1;

		this.receiveShadow = true;
		this.castShadow = true;
		this.rotatioYAngle = 0;

		this.playerColor = this.#PlayerConfig.get_value('playerColor');

		this.torche = this.getTorchlight();

		this.#init();
		this.#init_camera();

	}
	#init_camera() {

		this.#Camera.position.set(
			this.#Config.get_camera('decalage').x + this.playerGroupe.position.x,
			this.#Config.get_camera('decalage').y + this.playerGroupe.position.y,
			this.#Config.get_camera('decalage').z + this.playerGroupe.position.z
		);
		this.#Camera.lookAt(new THREE.Vector3(this.playerGroupe.position.x, this.playerGroupe.position.y, this.playerGroupe.position.z));

	}
	#init() {
		if (conslog) console.log('PlayerManager Mounted !')
		this.#addMeshToModel();
		this.#addModelToGroupe();


		// SkillsManager
		this.skillsInUse = []
		this.SkillsImmat = this.skillsInUse.length - 1;
		this.#addPlayerCircle();
	}
	update(game) {
		this.#playerMoveActions();
		this.#updateShoots(game);
		this.#regen();
		this.#updateUI();
	}

	#updateUI() {
		document.getElementById('hp-value').textContent = Math.round(this.stats.hp.current);
		document.getElementById('stamina-value').textContent = Math.round(this.stats.stamina.current);
	}

	#addPlayerCircle() {
		const geometry = new THREE.RingGeometry(1, 1.2, 32);
		const material = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
		this.playerCircle = new THREE.Mesh(geometry, material);
		this.playerCircle.rotation.x = Math.PI / 2;
		this.playerCircle.position.z = -this.hauteur / 2 + 0.01;
		this.playerGroupe.add(this.playerCircle);
	}

	#regen() {
		if (this.regenTimer.current >= this.regenTimer.max) {
			this.regenTimer.current = 0;
			['hp', 'stamina'].forEach(key => {
				const stat = this.stats[key];
				if (stat && stat.regen > 0) {
					if (stat.current < stat.max) {
						stat.current = Math.min(stat.current + stat.regen, stat.max);
					}
				}
			});
		}
		this.regenTimer.current++;
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
		playerMesh.receiveShadow = this.receiveShadow;
		playerMesh.castShadow = this.castShadow;
		playerMesh.material.transparent = true
		playerMesh.material.opacity = .8
		playerMesh.name = this.playerMeshName;
		this.PlayerMesh = playerMesh
	}
	#addModelToGroupe() {
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
			let speed = this.maxSpeed;
			this.position.thetaDeg = this.ControlsM.thetaDeg
			this.playerGroupe.rotation.z = THREE.Math.degToRad(this.position.thetaDeg);

			if (this.ControlsM.forward || this.ControlsM.reverse || this.ControlsM.left || this.ControlsM.right) {
				if (this.ControlsM.forward) { this.playerGroupe.position.y += speed }
				if (this.ControlsM.reverse) { this.playerGroupe.position.y -= speed }
				if (this.ControlsM.left) { this.playerGroupe.position.x -= speed }
				if (this.ControlsM.right) { this.playerGroupe.position.x += speed }
			}
			this.#Camera.position.set(
				this.#Config.get_camera('decalage').x + this.playerGroupe.position.x,
				this.#Config.get_camera('decalage').y + this.playerGroupe.position.y,
				this.#Config.get_camera('decalage').z + this.playerGroupe.position.z
			);
			this.#Camera.lookAt(
				this.playerGroupe.position.x,
				this.playerGroupe.position.y,
				this.playerGroupe.position.z
			);
		}
	}

	#shoot(game) {
        if (this.ControlsM) {
            const direction = new THREE.Vector3(
                -Math.sin(this.playerGroupe.rotation.z),
                Math.cos(this.playerGroupe.rotation.z),
                0
            ).normalize();

            const startPosition = this.playerGroupe.position.clone();
            startPosition.add(direction.clone().multiplyScalar(1.5));

            game.spawnProjectile(startPosition, direction, this);
        }
    }

	#updateShoots(game) {
		if (this.ControlsM.shoot1) {
			this.ControlsM.shoot1 = false;
			this.#shoot(game);
		}
	}
}