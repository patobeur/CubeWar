class Mobs {
    #Config;
    #AllMobs;
    #CurrentMobImmat;
    #Formula;
    #FactionManager;

    constructor(Config, FactionManager) {
        this.#Config = Config;
        this.#FactionManager = FactionManager;
        this.#AllMobs = [];
        this.#CurrentMobImmat = 0;
        this.#Formula = new Formula();
    }

    addMobs(howmanyMobs) {
        const roles = ['soigneur', 'tireur', 'protecteur'];
        const factionNames = Object.keys(this.#FactionManager.getFactions()).filter(name => name !== 'neutral');

        for (let i = 0; i < howmanyMobs; i++) {
            const randomRole = roles[this.#Formula.rand(0, roles.length - 1)];
            const randomFaction = factionNames[this.#Formula.rand(0, factionNames.length - 1)];
            this.addOne(randomRole, randomFaction);
        }
        return this.get_allMobs();
    }

    addClouds(howmany) {
        for (let i = 0; i < howmany; i++) {
            this.addOne('cloud', 'neutral');
        }
        return this.get_allMobs();
    }

    addOne(role, factionName) {
        const mobConfig = new MobConfig(role);
        let conf = mobConfig.get_(role);

        // Assign faction and get faction-specific color
        conf.faction = factionName;
        const faction = this.#FactionManager.getFactions()[factionName];
        if (faction && faction.color) {
            conf.mesh.color = faction.color;
        } else {
            // Fallback color if faction color is not defined
            conf.mesh.color = this.#stringToColor(factionName);
        }

        conf.immat = this.#CurrentMobImmat;
        conf.id = "M_" + conf.immat;
        conf.speed = conf.speed / 50;
        conf.position = this.#Formula.get_aleaPosOnFloor(this.#Config.floor.size);
        conf.position.z = conf.mesh.altitude;
        conf.nickname = `${role}_${factionName}_${conf.immat}`;
        conf.theta.cur = this.#Formula.rand(0, 360);
        conf.floor = this.#Config.floor;

        const newMob = new Mob(conf);
        this.#AllMobs.push(newMob);
        this.#FactionManager.addMobToFaction(newMob, factionName);

        this.#CurrentMobImmat++;
        return newMob;
    }

    get_allMobs() {
        return this.#AllMobs;
    }

    updateAllMobs(Player) {
        this.#AllMobs.forEach((mob) => {
            if (mob.conf.states.dead != true) {
                mob.update();
            }
        });
    }

    // Helper to generate a color from a string (e.g., faction name)
    #stringToColor(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        let color = '#';
        for (let i = 0; i < 3; i++) {
            let value = (hash >> (i * 8)) & 0xFF;
            color += ('00' + value.toString(16)).substr(-2);
        }
        return color;
    }
}