class Mob {
	constructor(conf) {
		this.conf = conf
		this.#init()
	}
	#init() {
		this.conf.state = { dead: 0 }
		this.ia = new MobsIa()
		this.#set_Divs()
		this.#set_Mesh()
		return this
	}
	update = () => {

		this.ia.iaAction(this.conf)

		this.mesh.position.set(
			this.conf.position.x,
			this.conf.position.y,
			this.conf.position.z
		);
		this.mesh.rotation.z = this.conf.theta.cur
		this.#update_BBox()


		// this.bbox.rotation.z = this.conf.theta.cur
		// this.#refresh_Div()
	};
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
		this.mobMesh = new THREE.Mesh(
			new THREE.BoxGeometry(
				this.conf.mesh.size.x,
				this.conf.mesh.size.y,
				this.conf.mesh.size.z
			),
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
		if (this.conf.mesh.childs.front != false) {
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
