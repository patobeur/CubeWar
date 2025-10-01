"use strict";
class TouchMe {
	#touchZone;
	#touch;
	#unity = 'px';
	#moves;
	#controlsM;
	#stringCss;
	constructor(controlsM = false) {

		this.#stringCss = ':root{--DirectionThumbWidth:70px;}#direction{position:absolute;width:var(--DirectionThumbWidth);height:var(--DirectionThumbWidth);top:calc(100%-(var(--DirectionThumbWidth)*2));left:calc((var(--DirectionThumbWidth)));background-color:rgba(54,59,26,0.473);border-radius:50%;}#direction#thumb{position:absolute;background-color:rgba(0,0,255,0.644);top:15%;left:15%;width:70%;height:70%;border-radius:50%;}#direction#thumb:hover{background-color:rgba(0,255,34,0.644);/*top:7.5%;left:7.5%;width:85%;height:85%;*/}';

		this.#controlsM = controlsM;
		this.thetaDeg = 0;
		this.#init();
		this.addCss(this.#stringCss, 'touchme')
		this.#addToDom();
	}
	get_Directions = (x, y) => {
		return this.#moves;
	}
	#init_Directions() {
		this.forward = false;
		this.left = false;
		this.right = false;
		this.reverse = false;
	}
	#setMoves = (x, y) => {
		this.forward = (y < this.#touch.initPos.top) ? true : false;
		this.reverse = (y > this.#touch.initPos.top) ? true : false;

		this.right = (x > this.#touch.initPos.left) ? true : false;
		this.left = (x < this.#touch.initPos.left) ? true : false;

		this.thetaDeg = get_DegreeWithTwoPos(
			this.#touch.initPos.left,
			this.#touch.initPos.top,
			x,
			y
		);
		this.#refreshPlayerMoves()
		this.#moves = { forward: this.forward, right: this.right, reverse: this.reverse, left: this.left };
		// console.log(x, y, this.#touch.initPos.left, this.#touch.initPos.top, this.thetaDeg);
		// console.log(this.#moves);
	}
	#init = () => {
		this.#init_Directions()
		this.#touchZone = {
			div: document.createElement('div'),
			initPos: { x: 40, y: 40 },
			size: { x: 80, y: 80 },
			id: 'direction',
			position: 'absolute',
			borderRadius: '50%',
			bgColor: 'rgba(0,0,255,.3)'
		}
		this.#touch = {
			div: document.createElement('div'),
			initPos: { x: 0, y: 0 },
			size: { x: 50, y: 50 },
			id: 'thumb',
			position: 'absolute',
			borderRadius: '50%',
			bgColor: 'rgba(0,255,255,.5)'
		}
		this.#touch.initPos.x = this.#touchZone.initPos.x + (this.#touchZone.size.x / 2) - (this.#touch.size.x / 2)
		this.#touch.initPos.y = this.#touchZone.size.y - (this.#touch.size.y / 2)
		this.#touch.initPos.top = window.innerHeight - this.#touchZone.size.y - (this.#touch.size.y / 2)
		this.#touch.initPos.left = this.#touchZone.initPos.x + (this.#touchZone.size.x / 2) - (this.#touch.size.x / 2)

	}
	#addToDom = (x, y) => {
		this.#setAndAddDiv(this.#touchZone);
		this.#setAndAddDiv(this.#touch);
		document.onpointerdown = this.#downHandler;
	}
	#setAndAddDiv(elem) {
		elem.div.id = elem.id
		elem.div.style.bottom = this.#addPX(elem.initPos.y)
		elem.div.style.left = this.#addPX(elem.initPos.x)
		elem.div.className = elem.id
		elem.div.style.width = this.#addPX(elem.size.x)
		elem.div.style.height = this.#addPX(elem.size.y)
		elem.div.style.position = elem.position
		elem.div.style.borderRadius = elem.borderRadius
		elem.div.style.backgroundColor = elem.bgColor
		document.body.appendChild(elem.div)
	}
	//--
	#addPX(thing) {
		return (typeof thing === 'string') ? thing : thing + this.#unity
	}
	#downHandler = (eve) => {
		this.#touch.div.setPointerCapture(eve.pointerId);
		document.addEventListener('touchstart', (eve) => {
			this.#touch.div.style.backgroundColor = 'rgba(255,255,0,.2)'
			if (this.#controlsM) this.#refreshPlayerMoves()
		});
		document.addEventListener('touchend', (eve) => {
			this.#settouchPos()
			this.#init_Directions()
			if (this.#controlsM) this.#refreshPlayerMoves()
		});
		document.addEventListener('touchcancel', (eve) => {
			this.#settouchPos()
			this.#init_Directions()
			if (this.#controlsM) this.#refreshPlayerMoves()
		});
		document.addEventListener('touchmove', (eve) => {
			this.#touch.div.style.left = eve.changedTouches[0].clientX - (this.#touch.size.x / 2) + "px"
			this.#touch.div.style.top = eve.changedTouches[0].clientY - (this.#touch.size.y / 2) + "px"
			this.#setMoves(
				eve.changedTouches[0].clientX,
				eve.changedTouches[0].clientY
			)
		});
	}
	#settouchPos() {
		this.#touch.div.style.top = ''
		this.#touch.div.style.left = this.#addPX(this.#touch.initPos.x)
		this.#touch.div.style.bottom = this.#addPX(this.#touch.initPos.y)
		this.#touch.div.style.backgroundColor = this.#touch.bgColor
	}
	#refreshPlayerMoves() {
		if (this.#controlsM) {
			this.#controlsM.forward = this.forward;
			this.#controlsM.left = this.left;
			this.#controlsM.right = this.right;
			this.#controlsM.reverse = this.reverse;
			this.#controlsM.thetaDeg = this.thetaDeg;
		}
	}
	addCss(stringcss, styleid) {
		let style = document.createElement('style');
		style.textContent = stringcss
		style.id = styleid
		document.getElementsByTagName('head')[0].appendChild(style);
	}
}
// window.onload = () => {
// 	let toucheMoi = new TouchMe();
// };
