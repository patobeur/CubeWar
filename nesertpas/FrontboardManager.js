"use strict";
class FrontboardManager {
	constructor(stats = false) {
		// this.activated = false;
		this.stats = stats;
		this.board;

		this.#init(stats);
	}
	#init() {
		this.#setFrontStat()
	}
	refresh(statname, value) {
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

	}

}
