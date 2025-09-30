"use strict";
class FrontboardManager {
	constructor(stats = false) {
		console.log("FrontboardManager stats", stats)
		// this.activated = false;
		this.stats = stats;
		this.board;

		this.#init(stats);
	}
	#init() {
		this.#setFrontStat()
	}
	refresh(statname, value) {
		// console.log("value", value)
		// console.log("statname", statname)
		// console.log("this.stats", this.stats)
		// console.log("this.stats[statname]", this.stats[statname])
		this.stats[statname].current = value
		let centage = (this.stats[statname].current / this.stats[statname].max) * 100
		this.stats[statname].divcurrent.style.width = centage + '%'
		// console.log(centage, value, this.stats[statname])
	}
	#get_centage(key) {
		return (this.stats[key].current / this.stats[key].max) * 100
	}
	#setFrontStat() {
		this.board = document.createElement('div');
		this.board.className = 'board';
		for (var key in this.stats) {
			// if (typeof this.stats[key] !== 'function') {

			let div = document.createElement('div');
			div.className = 'stat ' + key;
			div.id = 'id_' + key;

			let divcurrent = document.createElement('div');
			divcurrent.style.width = this.#get_centage(key) + '%';
			divcurrent.style.backgroundColor = this.stats[key].backgroundColor;
			divcurrent.title = key;
			divcurrent.className = 'current ' + key + '-current';

			div.appendChild(divcurrent);

			this.stats[key].div = div
			this.stats[key].divcurrent = divcurrent
			// }
			this.board.appendChild(div)
		}
		document.body.appendChild(this.board)
		let stringCss = '.mire,.target {position: absolute;height: 20px;width: 20px;left: calc(50% - 10px);top: calc(50% - 10px);border-radius: 50%;}.mire {display: none;background-color: rgba(153, 205, 50, 0.493);}.target {background-color: rgba(248, 234, 33, 0.459);}'
		stringCss += '.board{position: absolute;background-color: rgba(0, 0, 255, 0.644);top: .0;left:0;width:75px;height:75px;display:flex;flex-direction: column;}'
		stringCss += '.stat{width:100%;height:33%;display:flex;background-color: rgba(34, 34, 88, 0.644);border: 1px solid rgb(0, 0, 0);}'
		stringCss += '.current{height:100%;}'
		addCss(stringCss, 'miretarget')
	}
}
