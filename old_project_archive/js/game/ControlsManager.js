"use strict";
class ControlsManager {
	#TouchM;
	#Config
	#touchDeviceActive;
	constructor(type, Config) {
		this.#Config = Config;
		if (conslog) console.log('ControlsManager Mounted !')
		this.raycaster = new THREE.Raycaster();
		this.oldintersect = null;
		this.pMouse = new THREE.Vector2();

		this.thetaDeg = 0;

		this.shoot1 = false;
		this.shoot2 = false;
		this.shoot3 = false;

		this.space = false;

		this.forward = false;
		this.left = false;
		this.right = false;
		this.reverse = false;

		this.sleft = false;
		this.sright = false;

		this.#touchDeviceActive = this.#isTouchDevice(); // TouchDeviceActive
		if (this.#touchDeviceActive) {
			console.log('touch device on !')
			this.#TouchM = new TouchMe(this);
		}
		else {
			console.log('keyboard\'n\'mouse on !')
			this.#addKeyboardListeners();
			this.#addMouseListeners();
		}
		this.scale = 1
	}
	#isTouchDevice() {
		return (('ontouchstart' in window) ||
			(navigator.maxTouchPoints > 0) ||
			(navigator.msMaxTouchPoints > 0));
	}
	#addMouseListeners() {
		let mire = document.createElement('div');
		mire.className = 'mire';
		document.body.appendChild(mire)
		let target = document.createElement('div');
		target.className = 'target';
		document.body.appendChild(target)

		document.documentElement.oncontextmenu = (event) => {
			console.log('right click')
			event.preventDefault();
			this.shoot2 = true;
		}
		document.documentElement.onclick = (event) => {
			console.log('left click')
			this.shoot1 = true;
		}
		// document.documentElement.onwheel = (event) => {
		// 	// event.preventDefault();
		// 	console.log(this.#Config)
		// 	// doo(event, this.#Config)
		// }
		let doo = (event, toto) => {
			console.log(this.#Config)
			toto.get_camera('decalage').z = Math.min(
				Math.max(
					toto.get_camera('zoom').zmin,
					toto.get_camera('decalage').z +=
					event.deltaY > 0
						? toto.get_camera('zoom').step
						: -toto.get_camera('zoom').step),
				toto.get_camera('zoom').zmax
			);

		}
		document.getElementById('game').onmousemove = (event) => {
			target.style.left = (event.clientX - 5) + "px"
			target.style.top = (event.clientY - 5) + "px"
			// scene.updateMatrixWorld();

			this.thetaDeg = get_DegreeWithTwoPos(
				window.innerWidth / 2,
				window.innerHeight / 2,
				event.clientX,
				event.clientY
			);


			this.pMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
			this.pMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

			// let nextX = (1 * Math.cos(d)) + (1 * Math.sin(d))
			// let nextY = (1 * Math.sin(d)) - (1 * Math.cos(d))

			// let distance = get_distance({ x: 0, y: 0 }, { x: (this.pMouse.x * window.innerWidth), y: (this.pMouse.y * window.innerHeight) });
			// this.#get_intersectionColorChange()

		}
	}
	#addKeyboardListeners() {
		if (conslog) console.log('addKeyboardListeners')
		document.onkeydown = (event) => {
			if (conslog) console.log(event)
			switch (event.key) {
				case "&":
					this.shoot1 = true;
					break;
				case "é":
					this.shoot2 = true;
					break;
				case '"':
					this.shoot3 = true;
					break;
				case "ArrowLeft":
				case "q":
					this.left = true;
					break;
				case "a":
					this.sleft = true;
					break;
				case "ArrowRight":
				case "d":
					this.right = true;
					break;
				case "e":
					this.sright = true;
					break;
				case "ArrowUp":
				case "z":
					this.forward = true;
					break;
				case "ArrowDown":
				case "s":
					this.reverse = true;
					break;
				case " ":
					this.space = true;
					console.log('space')
					break;
			}
		}
		document.onkeyup = (event) => {
			switch (event.key) {
				case "&":
					this.shoot1 = false;
					break;
				case "é":
					this.shoot2 = false;
					break;
				case '"':
					this.shoot3 = false;
					break;
				case "ArrowLeft":
				case "q":
					this.left = false;
					break;
				case "a":
					this.sleft = false;
					break;
				case "ArrowRight":
				case "d":
					this.right = false;
					break;
				case "e":
					this.sright = false;
					break;
				case "ArrowUp":
				case "z":
					this.forward = false;
					break;
				case "ArrowDown":
				case "s":
					this.reverse = false;
					break;
				case " ":
					this.space = false;
					break;
			}
		}
	}
	// #get_intersectionColorChange() {

	// 	this.raycaster.setFromCamera(this.pMouse, camera);
	// 	let intersects = this.raycaster.intersectObject(scene, true);
	// 	if (intersects.length > 1) {
	// 		if (intersects[0].object.name != "sand") {
	// 			// if old intersect
	// 			if (this.oldintersect) {
	// 				if (this.oldintersect.uuid != intersects[0].object.uuid) {
	// 					this.oldintersect.material.color.setHex(this.oldintersect.currentHex);
	// 					this.oldintersect = null;
	// 				}
	// 			}
	// 			else {
	// 				// new intersect
	// 				this.oldintersect = intersects[0].object;
	// 				this.oldintersect.currentHex = this.oldintersect.material.color.getHex();
	// 				this.oldintersect.uuid = intersects[0].object.uuid;
	// 				this.oldintersect.material.color.setHex(0xffFF00);
	// 			}

	// 		}
	// 		else {
	// 			// sol
	// 			if (this.oldintersect) {
	// 				this.oldintersect.material.color.setHex(this.oldintersect.currentHex);
	// 				this.oldintersect = null;
	// 			}
	// 		}
	// 	}
	// 	else // there are no intersections
	// 	{
	// 		if (intersects.length < 1) {
	// 			// console.log('oldintersect = null', this.oldintersect)
	// 			this.oldintersect = null;
	// 		}
	// 	}

	// }
}
