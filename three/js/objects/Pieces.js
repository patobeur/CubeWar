class Pieces {
	#GLTFLoader
	constructor(domEvents, scene) {
		this.#Init()
	}
	#Init() {

		this.#GLTFLoader = new THREE.GLTFLoader();
		if (conslog) console.log('Pieces Mounted !')
		this.#init_pieces()
		// this.init()
	}
	update = () => {

	}
	#init_pieces() {
		let datas = {
			size: { x: 1, y: 1, z: .1 },
			position: { x: 0, y: 0, z: 0 },
			name: '',
			id: '',
			rotate: false
		}
	}
}
