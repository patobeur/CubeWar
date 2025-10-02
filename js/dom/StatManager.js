class StatManager {
    constructor() {
        this.stats = {};
        this.footer = null;
        this._createGlobalStyles();
    }

    initStats(stats) {
        this.stats = stats;
        this._setFrontStat();
    }

    refresh(statname, value) {
        if (!this.stats[statname] || !this.stats[statname].divcurrent) return;

        this.stats[statname].current = value;
        let percentage = (this.stats[statname].current / this.stats[statname].max) * 100;
        if (percentage < 0) percentage = 0;
        if (percentage > 100) percentage = 100;

        this.stats[statname].divcurrent.style.width = percentage + '%';
        this.stats[statname].divvalue.textContent = `${this.stats[statname].name}: ${Math.round(this.stats[statname].current)} / ${this.stats[statname].max}`;
    }

    _get_percentage(key) {
        return (this.stats[key].current / this.stats[key].max) * 100;
    }

    _setFrontStat() {
        this.footer = document.getElementById('footer');
        if (!this.footer) return;
        this.footer.innerHTML = ''; // Clear footer

        const statsContainer = document.createElement('div');
        statsContainer.className = 'stats-container';

        for (var key in this.stats) {
            if (this.stats[key].backgroundColor) { // Only display stats with a defined color
                let statWrapper = document.createElement('div');
                statWrapper.className = 'stat-wrapper';

                let statLabel = document.createElement('div');
                statLabel.className = 'stat-label';
                statLabel.textContent = `${this.stats[key].name}: ${Math.round(this.stats[key].current)} / ${this.stats[key].max}`;
                this.stats[key].divvalue = statLabel;


                let div = document.createElement('div');
                div.className = 'stat ' + key;
                div.id = 'id_' + key;

                let divcurrent = document.createElement('div');
                divcurrent.style.width = this._get_percentage(key) + '%';
                divcurrent.style.backgroundColor = this.stats[key].backgroundColor;
                divcurrent.title = this.stats[key].name || key;
                divcurrent.className = 'current ' + key + '-current';

                div.appendChild(divcurrent);
                statWrapper.appendChild(statLabel);
                statWrapper.appendChild(div);


                this.stats[key].div = div;
                this.stats[key].divcurrent = divcurrent;
                statsContainer.appendChild(statWrapper);
            }
        }
        this.footer.appendChild(statsContainer);
    }

    _createGlobalStyles() {
        let stringCss = `
        .stats-container {
            display: flex;
            justify-content: space-around;
            align-items: center;
            width: 100%;
            height: 100%;
        }
        .stat-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 120px;
        }
        .stat-label {
            color: white;
            font-family: sans-serif;
            font-size: 12px;
            margin-bottom: 5px;
        }
        .stat {
            width: 100%;
            height: 15px;
            display: flex;
            background-color: rgba(0,0,0, 0.3);
            border: 1px solid rgb(0, 0, 0);
            border-radius: 5px;
            overflow: hidden;
        }
        .current {
            height: 100%;
            transition: width 0.3s ease-in-out;
        }`;

        const style = document.createElement('style');
        style.id = 'stat-manager-styles';
        style.innerHTML = stringCss;
        document.head.appendChild(style);
    }
}