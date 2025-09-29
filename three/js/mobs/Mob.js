class Mob {
	constructor(conf) {
		this.conf = conf
		this.#init()
	}
	#init() {
		this.ia = new MobsIa()
		this.stats = new CubeStats(this.conf.stats);
		this.#set_Divs()
		this.#set_Mesh()
		return this
	}
	update = (allMobs, foodItems, game) => {
		this.ia.iaAction(this, allMobs, foodItems, game)
		this.mesh.position.set(
			this.conf.position.x,
			this.conf.position.y,
			this.conf.position.z
		);
		this.mesh.rotation.z = this.conf.theta.cur

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
		this.mesh = new THREE.Group();
		this.mesh.position.set(
			this.conf.position.x / 10,
			this.conf.position.y / 10,
			this.conf.position.z / 10
		);
		this.mesh.name = this.conf.nickname + '_Group';

		// for (var key in this.conf.divs) {
		// 	console.log(key)
		// };

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

		this.mesh.add(this.mobMesh)


		this.mobFront = new THREE.Mesh(
			new THREE.BoxGeometry(
				this.conf.mesh.size.x / 2,
				this.conf.mesh.size.y / 2,
				this.conf.mesh.size.z / 2
			),
			new THREE.MeshPhongMaterial({ color: 'black', wireframe: this.conf.mesh.wireframe })
		);
		this.mobFront.position.set(
			this.mobMesh.position.x,
			this.mobMesh.position.y + .5,
			this.mobMesh.position.z
		);
		this.mobFront.name = this.conf.nickname + '_Front';
		this.mesh.add(this.mobFront)



	}
	// ------------------------------------------------------------------------------------
	// this must go to AnimateDom class ???
	#refresh_Div() {
		this.#set_divAttrib('range', 'rotate(' + this.conf.theta.cur + 'deg)', 'style', 'transform')
		this.#set_divAttrib('ico', this.conf.theta.cur + '°', 'textContent', false)
		this.#set_divAttrib('prima', (this.conf.position.y - (this.conf.divs.prima.size.y / 2)) + 'px', 'style', 'top')
		this.#set_divAttrib('prima', (this.conf.position.x - (this.conf.divs.prima.size.x / 2)) + 'px', 'style', 'left')
	}
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
