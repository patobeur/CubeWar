class Thing {
	// #actions
	#mesh;
	#datas;
	#previousDatas;
	#domEvents;
	rotate;
	scene;
	change_color;
	constructor(datas, domEvents, scene) {
		this.scene = scene;
		this.rotate = false;
		this.#domEvents = domEvents
		this.#datas = datas;
		this.#previousDatas = datas;
		this.#Init()
	}
	#Init() {
		if (conslog) console.log('Thing')
		this.#init_thing()
	}
	update = () => {
		if (this.rotate) {
			this.#mesh.rotation.z += (Math.PI / (360 / 2))
		}
	}
	get_mesh() {
		return this.#mesh;
	}
	#init_thing() {
		this.#mesh = this.#get_ABox()
	}

	#change_color = (color) => {
		this.#mesh.material.color = color;
	}
	#get_ABox = () => {
		const geometry = new THREE.BoxGeometry(this.#datas.size.x, this.#datas.size.y, this.#datas.size.z)
		// const material = new THREE.MeshToonMaterial({ color: 0xff0000 });
		const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
		const aBox = new THREE.Mesh(geometry, material);
		aBox.position.set(
			this.#datas.position.x,
			this.#datas.position.y,
			this.#datas.position.z
		);
		aBox.name = 'box' + aBox.id
		// aBox.castShadow = true;
		// update datas
		this.#datas.meshid = aBox.id
		this.#datas.meshuuid = aBox.uuid

		this.#add_ListenerToMesh(aBox)

		return aBox
	}
	#mouseOver = (mesh) => {
		// console.log(mesh)
		this.#previousDatas.material = { color: { r: mesh.material.color.r, g: mesh.material.color.g, b: mesh.material.color.b } }
		this.#previousDatas.position = { x: mesh.position.x, y: mesh.position.y, z: mesh.position.z }
		this.rotate = true;
		mesh.material.color.r = 0;
		mesh.material.color.g = 0;
		mesh.material.color.b = 0;
		mesh.position.z = .2;

		mesh.castShadow = true;
		// this.#change_color(0xff0000);
		// console.log('wtf', mesh.material.color)
	}
	#mouseOut = (mesh) => {
		mesh.castShadow = false;
		mesh.material.color.r = this.#previousDatas.material.color.r;
		mesh.material.color.g = this.#previousDatas.material.color.g;
		mesh.material.color.b = this.#previousDatas.material.color.b;
		mesh.position.z = this.#previousDatas.position.z;
		this.rotate = false;

		mesh.rotation.z = 0;
	}
	#mouseClick = (event) => {
		console.log(event)
	}
	#add_ListenerToMesh = (mesh) => {

		this.#domEvents.addEventListener(
			mesh,
			'mouseover',
			(event) => {
				this.#mouseOver(event.target);
			},
			false
		);
		this.#domEvents.addEventListener(
			mesh,
			'mouseout',
			(event) => {
				this.#mouseOut(event.target);
			},
			false
		);
		this.#domEvents.addEventListener(
			mesh,
			'click',
			(event) => {
				this.#mouseClick(event);
			},
			false
		);
		//////////////////////////////////////////////////////////////////////////////////
		// this.#domEvents.addEventListener(
		// 	mesh,
		// 	'mouseover',
		// 	function (event) {
		// 		this.mesh = mesh;
		// 		this.mesh.material.color = 0xffff00;

		// 		this.rotate = true;
		// 		// console.log(event.type, 'you mouseover on mesh', event.target.name);
		// 		console.log(this);
		// 		// this.change_color(event.target.id);
		// 	},
		// 	false
		// );
		// this.#domEvents.addEventListener(
		// 	mesh,
		// 	'mouseout',
		// 	function (event) {
		// 		this.rotate = false;
		// 		// this.change(event.target);
		// 		// event.target.changecolor('0xFF0000');
		// 	},
		// 	false
		// );
	}
}
