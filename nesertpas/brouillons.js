
#addCosmicAxeHelper = () => {
	const axesHelper = new THREE.AxesHelper(50);
	axesHelper.position.set(0, 0, 0);
	axesHelper.name = 'help1';
	this.#Scene.add(axesHelper)
}
#tryBackground = () => {
	let type = 'background';
	let imagefloor = '2k_stars_milky_way.jpg';
	let imagePath = '../assets/img/' + type + '/' + imagefloor
	this.#Scene.background = new THREE.TextureLoader().load(imagePath);
}
#addboxHelpers = () => {
	// set up red box mesh
	const A = new THREE.BoxGeometry(0.5, 0.5, 0.5);
	const xx = new THREE.Mesh(A, new THREE.MeshToonMaterial({ color: 0xff0000 }));
	const yy = new THREE.Mesh(A, new THREE.MeshToonMaterial({ color: 0x00ff00 }));
	const zz = new THREE.Mesh(A, new THREE.MeshToonMaterial({ color: 0x0000ff }));
	xx.position.x = 5;
	yy.position.y = 5;
	zz.position.z = 5;
	this.#Scene.add(xx, yy, zz);
}
