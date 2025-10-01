"use strict";
class Projectile {
	constructor(skillname, caster, position, rotation, fromfloor = 1, Scene) {
		this.formula = new Formula()
		this.scene = Scene
		this.fromfloor = fromfloor / 2;
		this.casterId = caster.id || caster.conf.id;
		this.casterFaction = caster.faction || caster.conf.faction;

		this.skillDatas = this.#getSkill(skillname, position, rotation);

		this.receiveShadow = true;
		this.castShadow = true;
		this.wireFrame = false;
		this.distance = 0;
		this.distanceMax = this.skillDatas.distanceMax ?? 50;

		this.end = false;
		this.destinationReached = false;
		this.mesh;
	}

	#getSkill(skillname, position, rotation) {
		skillname = JSON.parse(JSON.stringify(skillname));
		position = JSON.parse(JSON.stringify(position));
		rotation = JSON.parse(JSON.stringify(rotation._z));

		let skill = this.#setSkills(skillname);
		skill.x = position.x;
		skill.y = position.y;
		skill.z = position.z + (skill.fromfloor ? skill.fromfloor : 0);
		skill.rotation = rotation;

		return skill
	}

	init() {
		this.birthDay = new Date();
		this.#creatMesh();
	}

	// This is now the main update method, called by ProjectileManager
	update() {
		if (this.end) return;

		if (!this.destinationReached) {
			this.#setNextPosition();
			this.#setNextTransform();
			this.#applyDatasOnMesh();
			this.#checkDestinationReached()
		}

		if (this.destinationReached) {
			if (this.skillDatas.duration) { this.#checkDuration() }
			else { this.destroy(); }
		}
	}

	#creatMesh() {
		switch (this.skillDatas.meshType) {
			case "sphere":
				this.mesh = new THREE.Mesh(
					new THREE.SphereGeometry(this.skillDatas.w, this.skillDatas.l, this.skillDatas.h),
					new THREE.MeshPhongMaterial({ color: this.skillDatas.color, wireframe: this.wireFrame })
				);
				break;
			case 'cube':
				this.mesh = new THREE.Mesh(
					new THREE.BoxGeometry(this.skillDatas.w, this.skillDatas.l, this.skillDatas.h),
					new THREE.MeshPhongMaterial({ color: this.skillDatas.color, wireframe: this.wireFrame })
				);
				break;
		}
		this.mesh.name = this.skillDatas.name
		this.mesh.receiveShadow = this.receiveShadow
		this.mesh.castShadow = this.castShadow

		this.mesh.material.transparent = true
		this.mesh.material.opacity = .6

		this.mesh.scale.set(1, 1, 1)
		this.#applyDatasOnMesh()
		this.#applyRotationOnMesh()
		this.scene.add(this.mesh)
	}

	#applyDatasOnMesh() {
		this.mesh.position.set(this.skillDatas.x, this.skillDatas.y, this.skillDatas.z);
		if (this.skillDatas.scale) this.mesh.scale.set(this.skillDatas.scale.current, this.skillDatas.scale.current, this.skillDatas.scale.current)
	}

	#checkDuration() {
		let duration = new Date().getTime() - this.birthDay.getTime();
		if (duration >= this.skillDatas.duration) {
			this.destroy();
		}
	}

	destroy() {
		this.end = true;
		this.#removeFromSceneAndDispose();
	}

	#checkDestinationReached() {
		this.distance += this.skillDatas.speed;
		if (this.distance >= this.distanceMax) {
			this.destinationReached = true;
		}
	}

	#setNextTransform() {
		if (this.skillDatas.scale) {
			let start = this.skillDatas.scale.start < 0 ? 0 : this.skillDatas.scale.start;
			let end = this.skillDatas.scale.end > 20 ? 20 : this.skillDatas.scale.end;
			let distancedone = this.skillDatas.distanceMax - this.distance;
			this.skillDatas.scale.current = 1 + start + (((end - start) / (distancedone) - 1))
		}
	}

	#setNextPosition() {
		let nextPos = this.formula.get_NextThreePos(this.skillDatas.x, this.skillDatas.y, this.skillDatas.rotation, this.skillDatas.speed)
		this.skillDatas.x = nextPos.x
		this.skillDatas.y = nextPos.y
	}

	#applyRotationOnMesh() {
		if (this.skillDatas.rotation) this.mesh.rotation.z = this.skillDatas.rotation;
	}

	#setSkills(skillname) {
		let skill = {
			fireball: {
				name: 'Fire Ball',
				meshType: 'cube',
				w: .5,
				h: .5,
				l: 1,
				distanceMax: 50,
				color: 'red',
				speed: .5,
				rotation: 0,
				addTheta: (Math.PI / 4),
				fromfloor: 0,
				damage: 10,
				energyCost: 5,
				recastTimer: 1000,
			},
			cube: {
				name: 'cube',
				meshType: 'sphere',
				w: .5,
				h: 10,
				l: 10,
				distanceMax: 15,
				color: 'red',
				speed: .6,
				scale: { start: 0, end: 5, current: 1 },
				rotation: 0,
				addTheta: 0,
				fromfloor: 0,
				duration: 1000,
				energyCost: 10,
				recastTimer: 1000,
			},
			weedball: {
				name: 'Weed Wall',
				meshType: 'cube',
				w: 10,
				h: 10,
				l: .1,
				distanceMax: 10,
				duration: 5000,
				color: 'red',
				speed: .5,
				x: 0,
				y: 0,
				rotation: 0,
				addTheta: 0,
				fromfloor: 0,
				energyCost: 10,
				recastTimer: 1000,
			}
		}
		return skill[skillname]
	}

	#removeFromSceneAndDispose() {
		if (!this.mesh) return;
		const object = this.scene.getObjectByProperty('uuid', this.mesh.uuid);
		if (object) {
			object.geometry.dispose();
			object.material.dispose();
			this.scene.remove(object);
		}
	}
}