"use strict";
class SkillsManager {
	constructor(skillname, position, rotation, fromfloor = 1) {
		this.fromfloor = fromfloor / 2;

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
		this.creatMesh();
		this.render = setInterval(this.#update, 5);
	}
	creatMesh() {
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
		// ????????????????
		this.#applyDatasOnMesh()
		this.#applyRotationOnMesh()
		scene.add(this.mesh)
	}
	#update = () => {
		if (!this.destinationReached) {
			this.#setNextPosition();
			this.#setNextTransform();
			this.#applyDatasOnMesh();
			this.#checkDestinationReached()
		}
		if (this.destinationReached) {
			if (this.skillDatas.duration) { this.#checkDuration() }
			else { this.#endThis(); }
		}

	}
	#applyDatasOnMesh() {
		// set mesh position 
		this.mesh.position.set(this.skillDatas.x, this.skillDatas.y, this.skillDatas.z);
		// if SCALE found
		if (this.skillDatas.scale) this.mesh.scale.set(this.skillDatas.scale.current, this.skillDatas.scale.current, this.skillDatas.scale.current)
	}
	#checkDuration() {
		let duration = new Date().getTime() - this.birthDay.getTime();
		if (duration >= this.skillDatas.duration) {
			this.#endThis();
		}
	}
	#endThis() {
		this.end = true;
		clearInterval(this.render);
		this.#removeFromSceneAndDispose()
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
		let nextPos = FORMULA.get_NextThreePos(this.skillDatas.x, this.skillDatas.y, this.skillDatas.rotation, this.skillDatas.speed)
		this.skillDatas.x = nextPos.x
		this.skillDatas.y = nextPos.y
	}
	#applyRotationOnMesh() {

		// if (this.skillDatas.rotation) this.mesh.rotation.z = this.skillDatas.rotation;
		if (this.skillDatas.rotation) this.mesh.rotation.z = this.skillDatas.rotation;
	}
	#setSkills(skillname) {
		let skill = {
			fireball: {
				name: 'Fire Ball',
				meshType: 'cube',
				w: .3, //radius
				h: .3,
				l: 1,
				distanceMax: 50,
				color: 'white',
				speed: .5,
				rotation: 0,
				addTheta: (Math.PI / 4),
				fromfloor: 0, // (w /2)
				energyCost: 20,
				recastTimer: 1000,
			},
			cube: {
				name: 'cube',
				meshType: 'sphere',
				w: .5, //radius
				h: 10,
				l: 10,
				distanceMax: 15,
				color: 'white',
				speed: .6,
				scale: { start: 0, end: 5, current: 1 },//min zero,
				rotation: 0,
				addTheta: 0,
				fromfloor: 0, // (w /2)
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
				color: 'white',
				speed: .5,
				x: 0,
				y: 0,
				rotation: 0,
				addTheta: 0,
				fromfloor: 0, // (w /2)
				energyCost: 10,
				recastTimer: 1000,
			}
		}
		return skill[skillname]
	}
	#removeFromSceneAndDispose() {
		const object = scene.getObjectByProperty('uuid', this.mesh.uuid);
		object.geometry.dispose();
		object.material.dispose();
		scene.remove(object);
	}
	// getSinValue(val) {
	// 	let x = 0;//h
	// 	let y = 0;//k

	// 	let p = 5;
	// 	let a = 5;
	// 	let aMax = y + a;
	// 	let aMin = y - a;

	// 	for (let b = x; b < p + x; b++) {

	// 		let h = h + p;
	// 		let k = y;
	// 	}
	// 	// let b = (2 * Math.PI) / periode;

	// }
}
