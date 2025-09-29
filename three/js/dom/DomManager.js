class DomManager {
	#Renderer;
	#Camera;
	constructor(Renderer, Camera) {
		this.#Renderer = Renderer
		this.#Camera = Camera
		this.#Init()
	}
	#Init() {
		if (conslog) console.log('DomManager Mounted !')
		this.append_Child(
			this.#Renderer.domElement
		)
		this.resize_Listener(this.#Renderer, this.#Camera)
	}
	append_Child = (element, targetElement = document.body) => {
		if (targetElement) { targetElement.appendChild(element) }
	}
	resize_Listener = (renderer, camera) => {
		window.addEventListener('resize', () => {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth, window.innerHeight);
		});
	}
	addCss(stringcss, styleid) {
		let style = document.createElement('style');
		style.textContent = stringcss
		style.id = styleid
		document.getElementsByTagName('head')[0].appendChild(style);
	}
}
