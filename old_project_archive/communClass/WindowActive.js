class WindowActive {
	#windowActive;
	#overLay;
	#titleString;
	constructor(titleString = 'Listeners', ismobile = false) {
		this.#titleString = titleString;
		this.#Init()
	}
	#Init() {
		this.#windowActive = false
		this.#add_Overlay()
		this.#Window_Blur()
		this.#init_Window_Focus()
		if (conslog) console.log('WindowActive mounted')
	}
	#init_Window_Focus() {
		document.addEventListener('mouseover', () => {
			this.#Window_Focus()
		})
		document.addEventListener('mouseout', () => {
			this.#Window_Blur()
		})
		window.addEventListener('focus', () => {
			this.#Window_Focus()
		})
		window.addEventListener('blur', () => {
			this.#Window_Blur()
		})
	}
	#Window_Focus() {
		this.#windowActive = true
		// this.#overLay.classList.remove('paused')
		this.#overLay.style.display = 'none'
		// console.log('focus')
	}
	#Window_Blur() {
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
		if (conslog) console.log('- - WindowActive add_Overlay')
		this.#overLay = document.createElement('div')
		this.#overLay.id = "Pause"
		this.#overLay.style.display = 'none'
		this.#overLay.textContent = this.#titleString
		this.#overLay.className = "Pause"
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
