"use strict";
class FrontboardManager {
    constructor() {
        // this.activated = false;
        this.stats = {};
        this.board = null;
        this._createGlobalStyles();
    }

    initStats(stats) {
        this.stats = stats;
        this._setFrontStat();
    }

    refresh(statname, value) {
        // Only refresh if the stat and its UI element exist
        if (!this.stats[statname] || !this.stats[statname].divcurrent) return;

        this.stats[statname].current = value;
        let percentage = (this.stats[statname].current / this.stats[statname].max) * 100;
        if (percentage < 0) percentage = 0;
        if (percentage > 100) percentage = 100;

        this.stats[statname].divcurrent.style.width = percentage + '%';
    }

    _get_percentage(key) {
        return (this.stats[key].current / this.stats[key].max) * 100;
    }

    _setFrontStat() {
        if (this.board) {
            document.body.removeChild(this.board);
        }

        this.board = document.createElement('div');
        this.board.className = 'board';

        for (var key in this.stats) {
            if (this.stats[key].backgroundColor) { // Only display stats with a defined color
                let div = document.createElement('div');
                div.className = 'stat ' + key;
                div.id = 'id_' + key;

                let divcurrent = document.createElement('div');
                divcurrent.style.width = this._get_percentage(key) + '%';
                divcurrent.style.backgroundColor = this.stats[key].backgroundColor;
                divcurrent.title = this.stats[key].name || key;
                divcurrent.className = 'current ' + key + '-current';

                div.appendChild(divcurrent);

                this.stats[key].div = div;
                this.stats[key].divcurrent = divcurrent;
                this.board.appendChild(div);
            }
        }
        document.body.appendChild(this.board);
    }

    _createGlobalStyles() {
        let stringCss = '.mire,.target {position: absolute;height: 20px;width: 20px;left: calc(50% - 10px);top: calc(50% - 10px);border-radius: 50%;}.mire {display: none;background-color: rgba(153, 205, 50, 0.493);}.target {background-color: rgba(248, 234, 33, 0.459);}'
        stringCss += '.board{position: absolute;background-color: rgba(0, 0, 255, 0.644);top: .0;left:0;width:75px;height:auto;display:flex;flex-direction: column;z-index: 100;}'
        stringCss += '.stat{width:100%;height:15px;display:flex;background-color: rgba(34, 34, 88, 0.644);border: 1px solid rgb(0, 0, 0);}'
        stringCss += '.current{height:100%;}'

        // Ensure addCss function exists or add it. For now, assuming it's global.
        if (typeof addCss === 'function') {
            addCss(stringCss, 'miretarget');
        } else {
            const style = document.createElement('style');
            style.id = 'miretarget';
            style.innerHTML = stringCss;
            document.head.appendChild(style);
        }
    }
}