"use strict";
class LoadingManager {
	constructor() {
		if (conslog) console.log('LoadingManager Mounted !')
		this.modal = document.createElement('div');
		this.loading = document.createElement('div');
		this.progress = [0, -1]
		this.error = false;
		this.models = {
			// car: { name: 'car', url: '../assets/models/freecar/free_car_001.gltf', num: 1, upd: .02, scale: 3 },
			knight: { name: 'knight', url: '../assets/models/player/KnightCharacter.gltf', num: 1, upd: .02, scale: 3 },
		};
		// MANAGER 
		this.manager = this;
		// this.manager = new THREE.Loader();
		this.manager.onStart = function (url, itemsLoaded, itemsTotal, name) {
			console.log('onStart: loading gltf');
		};
		this.manager.onLoad = function (url) {
			this.#onLoadDone();
			console.log('onLoad: .........');
		};
		this.manager.onProgress = function (url, itemsLoaded, itemsTotal, name) {
			// console.log(url,itemsLoaded, itemsTotal);
			this.#setProgressBar();
			this.progress = [itemsLoaded, itemsTotal]
		};
		this.manager.onError = function (url) {
			console.log('There was an error loading ' + url);
			console.log('can\'t start this !');
			this.error = true;
		};
		this.gltfLoader = new THREE.GLTFLoader(this.manager);

	}
	loadThemAll() {
		this.cssMaker();
		this.addProgressBar();
		for (const model of Object.values(this.models)) {
			this.gltfLoader.load(model.url, (gltf) => {
				console.log('-----------Started loading file:', model.name, gltf);
				gltf.userData.name = model.name;
				model.gltf = gltf;
			});
		}
	}
	update() {
		for (const gltfs of Object.values(LM.models)) {
			gltfs.mixer.update(gltfs.upd)
		}
	}
	#prepModelsAndAnimations() {
		console.groupCollapsed('prepModelsAndAnimations start');
		// get and add all animations in model.animations by animation name
		console.log('----------------------', this.models)
		Object.values(this.models).forEach(model => {
			if (model.gltf.animations.length > 0) {
				const animsByName = {};
				model.gltf.animations.forEach((animation) => {
					animsByName[animation.name] = animation;
				});
				model.animations = animsByName;
				// add anime 
			}
			Object.values(this.models).forEach(
				(model, ndx) => {
					// console.log('ndx', ndx);
					const clonedScene = new THREE.SkeletonUtils.clone(model.gltf.scene);
					const clone = new THREE.Object3D();
					clone.add(clonedScene);

					clone.position.x = (ndx - 1) * 1;
					clone.position.y = clone.position.y;
					// clone.scale.set(.1, .1, .1)
					clone.rotation.x = Math.PI / 2;
					model.clone = clone;
					console.log(model.name, ': Adding Clone', Object.values(model.animations))

					// if (model.gltf.animations.length > 0) {
					const mixer = new THREE.AnimationMixer(clonedScene);
					const firstClip = Object.values(model.animations)[1];
					const action = mixer.clipAction(firstClip);
					action.play();
					model.mixer = mixer;
					// }
					console.log(model.name, ': Adding Mixer animations (1/' + Object.values(model.animations).length + ')')

					this.#addToScene(model.name);
				}
			);
		});
		console.groupEnd();
	}
	#onLoadDone() {
		this.#prepModelsAndAnimations()
		this.#go();
	}
	#go() {
		this.modal.remove();
		LMFinished();
	}
	#addToScene(modelName) {
		console.log('Adding', LM.models[modelName].name, 'to scene')
		scene.add(LM.models[modelName].clone);
		LM.models[modelName].clone.position.y = -2;
	}
	// addCharactereToSceneByModelname(modelName) {
	// 	this.#addToScene(modelName)
	// }
	addProgressBar() {
		let css = document.createElement('style')

		this.modal.id = "loader"
		this.loading.id = "loading"
		this.modal.prepend(this.loading)
		document.body.prepend(this.modal)
		// document.body
	}
	cssMaker = () => {
		let stringcss = '#loader {position: absolute;background-color: rgba(255, 0, 0, 0.644);top: calc(50% - 12px);left: 25%;width: 50%;height: 25px;border-radius: 6px;overflow: hidden;}' +
			' #loader #loading {position: relative;background-color: rgba(81, 255, 0, 0.644);width: 0%;height: 100%;}'
		addCss(stringcss, 'loader')
	}
	#setProgressBar() {
		let min = this.progress[0]
		let max = this.progress[1]
		let width = (Math.floor((min / (max - 1)) * 100));
		if (max > 0 && min <= max) {
			this.loading.style.width = width + '%'
		}
	}

}
