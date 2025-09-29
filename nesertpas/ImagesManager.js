class ImagesManager {
	constructor() {
		this.TextureLoader = new THREE.TextureLoader();
		this.modal = document.createElement('div');
		this.loading = document.createElement('div');
		this.imagesLoaded = false;
		this.progress = [0, -1]
		this.path = '../assets/img/'
		// this.TextureLoader.onStart = function (e) {
		// 	if (consoleOn) console.log('ssssssssssssssssssssssssss');
		// };
		// this.TextureLoader.load(function (err) {
		// 	console.error(err, 'An error happened.');
		// })
		this.imagesToLoad = [
			{ name: 'sand', url: 'sand.jpg', type: 'floor' }, // called by name 'sand' in controls.js line 55
			{ name: 'crate', url: 'grid2.png', type: 'floor' },
			{ name: 'carreau', url: 'carreau.png', type: 'floor' },
			{ name: 'chemin', url: 'test.png', type: 'floor' },
			{ name: 'pub1', url: 'bigbug.jpg', type: 'pubs' }
		]

		this.imagesLoaded = {}
		this.#init();
	}
	#init() {
		if (conslog) console.log('ImagesManager Mounted')
		this.#loadThemAll()

	}
	#loadThemAll() {
		this.#cssMaker();
		this.#addProgressBar();
		this.#makeItAll();
	}
	#makeItAll() {
		this.progress[1] = this.imagesToLoad.length;
		for (let i = 0; i < this.progress[1]; i++) {
			this.#loadit(this.imagesToLoad[i]);
		}
	}
	#loadit(imagesToLoad) {
		let type = imagesToLoad.type;
		let name = imagesToLoad.name;
		let url = imagesToLoad.url;
		if (!this.imagesLoaded[type]) { this.imagesLoaded[type] = {}; }

		this.imagesLoaded[type][name] = this.TextureLoader.load(
			this.path + type + '/' + url,
			(texture) => {
				texture.name = 'texture' + name;
				// texture.type = type;
				imagesToLoad.name = 'imagesToLoad' + name;
				imagesToLoad.id = texture.id
				imagesToLoad.path = this.path + type + '/';
				this.progress[0]++;
				this.#setProgressBar();
			}
		)
	}
	#cssMaker = () => {
		let stringcss = '#imagesloader {position: absolute;background-color: rgba(255, 0, 0, 0.644);top: calc(50% - 37px);left: 25%;width: 50%;height: 25px;border-radius: 6px;overflow: hidden;}' +
			' #imagesloader .loading {position: relative;background-color: rgba(81, 255, 0, 0.644);width: 0%;height: 100%;transition: .2s width 1s ease-in;}'
		addCss(stringcss, 'imagesloader')
	}
	#addProgressBar() {
		let css = document.createElement('style')
		this.modal.id = "imagesloader"
		this.loading.className = "loading"
		this.loading.textContent = "Loading Images"
		this.modal.prepend(this.loading)
		document.body.prepend(this.modal)
	}
	#setProgressBar() {
		let min = this.progress[0]
		let max = this.progress[1]
		let width = Math.floor(((min) / max) * 1000) / 10;
		if (max > 0 && min <= max) {
			this.loading.style.width = width + '%'
		}
		if (max <= min) {
			this.#gonext()
		}
	}
	#gonext() {
		this.modal.remove();
		console.log('all images are loaded ....')
		console.log('this need a promess callback ....')
		// IMFinished();
	}
}
