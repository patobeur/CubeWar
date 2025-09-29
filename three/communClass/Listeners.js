class Listeners {
	#windowActive;
	#overLay;
	#titleString;
	constructor(titleString = 'Listeners', ismobile = false) {
		this.#windowActive = false
		this.#titleString = titleString;
	}
	addListener() {
		this.#add_Overlay()
		this.#on_Window_Blur()
		document.addEventListener('mouseover', () => {
			this.#on_Window_Focus()
		})
		document.addEventListener('mouseout', () => {
			this.#on_Window_Blur()
		})
		window.addEventListener('focus', () => {
			this.#on_Window_Focus()
		})
		window.addEventListener('blur', () => {
			this.#on_Window_Blur()
		})
	}
	init_Window_Focus() {
		this.#add_Overlay()
		this.#on_Window_Blur()
		document.addEventListener('mouseover', () => {
			this.#on_Window_Focus()
		})
		document.addEventListener('mouseout', () => {
			this.#on_Window_Blur()
		})
		window.addEventListener('focus', () => {
			this.#on_Window_Focus()
		})
		window.addEventListener('blur', () => {
			this.#on_Window_Blur()
		})
	}
	#on_Window_Focus() {
		this.#windowActive = true
		// this.#overLay.classList.remove('paused')
		this.#overLay.style.display = 'none'
		// console.log('focus')
	}
	#on_Window_Blur() {
		this.#windowActive = false
		// this.#overLay.classList.add('paused')
		this.#overLay.style.display = 'block'
		this.#overLay.style.display = 'flex'
		this.#overLay.style.alignItems = 'center'
		this.#overLay.style.justifyContent = 'center'
		// console.log('blur')
	}
	get_isWindowActive() {
		return this.#windowActive
	}
	#add_Overlay() {
		this.#overLay = document.createElement('div')
		this.#overLay.id = "Pause"
		this.#overLay.textContent = this.#titleString
		this.#overLay.className = "Pause"
		this.#overLay.style.display = 'none'
		this.#overLay.style.position = 'absolute'
		this.#overLay.style.top = '25%'
		this.#overLay.style.left = '25%'
		this.#overLay.style.width = '50%'
		this.#overLay.style.height = '50%'
		// this.#overLay.style.zIndex = '1000000'
		this.#overLay.style.borderRadius = '1rem'
		this.#overLay.style.backgroundColor = 'rgba(255,255,255,.2)'
		this.#overLay.style.display = 'flex'
		this.#overLay.style.alignItems = 'center'
		this.#overLay.style.justifyContent = 'center'
		this.#overLay.style.fontSize = '3rem'
		this.#overLay.style.color = 'yellowGreen'
		this.#appendChild(this.#overLay, false)
	}
	#appendChild = (element, targetElement) => {
		let target = !targetElement === false ? targetElement : document.body;
		if (element) { target.appendChild(element) }
	}
}
