class Mob {
	constructor(conf, ProjectileManager) {
		this.conf = conf;
		this.ProjectileManager = ProjectileManager;
		this.#init()
	}
	#init() {
		this.conf.lastAttack = 0; // Timestamp of the last attack
		this.regenTimer = { current: 0, max: 10 };

		switch (this.conf.role) {
			case 'soigneur':
				this.ia = new HealerIa();
				break;
			case 'tireur':
				this.ia = new RangerIa();
				break;
			case 'protecteur':
				this.ia = new ProtectorIa();
				break;
			default:
				this.ia = new BaseIa();
				break;
		}
		this.#set_Divs()
		this.#set_Mesh()
		return this
	}

	takeDamage(amount) {
		if (this.conf.states.dead) return;

		this.conf.hp -= amount;
		if (this.conf.hp <= 0) {
			this.conf.hp = 0;
			this.conf.states.dead = true;
			console.log(`${this.conf.nickname} has been defeated.`);
			this.mesh.visible = false; // Hide the mob
		}
	}

	update = (player, allMobs) => {
		if (this.conf.states.dead) return; // Don't update dead mobs

		this.#regen();
		this.ia.iaAction(this, player, allMobs);

		this.mesh.position.set(
			this.conf.position.x,
			this.conf.position.y,
			this.conf.position.z
		);
		// The AI calculates theta where 0 is to the right (+X).
		// The mob's "front" is its +Y axis. To align +Y with the angle,
		// we subtract 90 degrees (PI/2) from the angle.
		this.mesh.rotation.z = this.conf.theta.cur - (Math.PI / 2);
		this.#update_BBox()


		// this.bbox.rotation.z = this.conf.theta.cur
		// this.#refresh_Div()
	};

	#regen() {
		if (this.regenTimer.current >= this.regenTimer.max) {
			this.regenTimer.current = 0;
			// Regenerate energy for mobs
			if (this.conf.energy < this.conf.maxEnergy) {
				this.conf.energy += this.conf.regen || 0;
				if (this.conf.energy > this.conf.maxEnergy) {
					this.conf.energy = this.conf.maxEnergy;
				}
			}
		} else {
			this.regenTimer.current++;
		}
	}

	#set_Divs() {
		this.divs = {}
		for (var key in this.conf.divs) {
			this.divs[key] = document.createElement('div')
		};
	}
	#set_Mesh() {
		// console.log(this.conf)
		// GROUP MESH
		this.mesh = new THREE.Group();
		this.mesh.position.set(
			this.conf.position.x,
			this.conf.position.y,
			this.conf.position.z
		);
		// altitude
		if (this.conf.mesh.altitude) { this.mesh.position.z += this.conf.mesh.altitude }

		this.mesh.name = this.conf.nickname + '_Group';

		// for (var key in this.conf.divs) {
		// 	console.log(key)
		// };

		// BODY MESH
		let mobGeometry;
		switch (this.conf.role) {
			case 'soigneur': // Healer -> Sphere
				mobGeometry = new THREE.SphereGeometry(this.conf.mesh.size.x / 2, 32, 16);
				break;
			case 'tireur': // Shooter -> Tetrahedron
				mobGeometry = new THREE.TetrahedronGeometry(this.conf.mesh.size.x / 1.5);
				break;
			case 'protecteur': // Protector -> Cube
			default:
				mobGeometry = new THREE.BoxGeometry(
					this.conf.mesh.size.x,
					this.conf.mesh.size.y,
					this.conf.mesh.size.z
				);
				break;
		}

		this.mobMesh = new THREE.Mesh(
			mobGeometry,
			new THREE.MeshPhongMaterial({ color: this.conf.mesh.color, wireframe: this.conf.mesh.wireframe })
		);
		this.mobMesh.name = this.conf.nickname;
		this.mobMesh.castShadow = true;
		this.mobMesh.receiveShadow = true;
		if (this.conf.mesh.opacity) {
			this.mobMesh.material.transparent = true
			this.mobMesh.material.opacity = this.conf.mesh.opacity
		}
		this.mesh.add(this.mobMesh)

		// FRONT
		// Add a front piece only if it is explicitly defined as an object with a size property.
		if (this.conf.mesh.childs && this.conf.mesh.childs.front && this.conf.mesh.childs.front.size) {
			this.#add_Front()
		}

		this.bbox = new THREE.Box3().setFromObject(this.mesh);
		// this.bbhelper = new THREE.Box3Helper(this.bbox, 0x00ff00);


	}
	#add_Front() {
		this.mobFront = new THREE.Mesh(
			new THREE.BoxGeometry(
				this.conf.mesh.childs.front.size.x,
				this.conf.mesh.childs.front.size.y,
				this.conf.mesh.childs.front.size.z
			),
			new THREE.MeshPhongMaterial({
				color: this.conf.mesh.childs.front.color ?? this.conf.mesh.color,
				wireframe: this.conf.mesh.childs.front.wireframe ?? false
			})
		);
		this.mobFront.position.set(
			this.mobMesh.position.x + this.conf.mesh.childs.front.position.x,
			this.mobMesh.position.y + this.conf.mesh.childs.front.position.y,
			this.mobMesh.position.z + this.conf.mesh.childs.front.position.z
		);
		this.mobFront.name = this.conf.nickname + '_Front';
		this.mesh.add(this.mobFront)

	}
	#update_BBox() {
		// this.bbox = new THREE.Box3().setFromObject(this.mobMesh);
		this.bbox.copy(this.mobMesh.geometry.boundingBox).applyMatrix4(this.mobMesh.matrixWorld)
	}
	// ------------------------------------------------------------------------------------
	// this must go to AnimateDom class ???
	#set_divAttrib(target, value = false, attribute = false, attribute2 = false) {
		if (this.divs[target] && value) {
			if (attribute && attribute2) {
				this.divs[target][attribute][attribute2] = value
			}
			else if (attribute && !attribute2) {
				this.divs[target][attribute] = value
			}
		}
	}
}
