class Mobs {
    #Config;
    #AllMobs;
    #CurrentMobImmat;
    #Formula;
    #FactionManager;
    ProjectileManager;
    playerFaction;

    constructor(Config, FactionManager, ProjectileManager, playerFaction) {
        this.#Config = Config;
        this.#FactionManager = FactionManager;
        this.ProjectileManager = ProjectileManager;
        this.playerFaction = playerFaction;
        this.#AllMobs = [];
        this.#CurrentMobImmat = 0;
        this.#Formula = new Formula();
    }

    addMobs(playerFaction) {
        const roles = ['soigneur', 'tireur', 'protecteur'];
        const factionNames = Object.keys(this.#FactionManager.getFactions()).filter(name => name !== 'neutral');

        factionNames.forEach(factionName => {
            const mobCount = factionName === playerFaction ? 4 : 5;
            for (let i = 0; i < mobCount; i++) {
                const randomRole = roles[this.#Formula.rand(0, roles.length - 1)];
                this.addOne(randomRole, factionName);
            }
        });

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
        conf.role = role;

        // Assign faction and get faction-specific color
        conf.faction = factionName;
        const faction = this.#FactionManager.getFactions()[factionName];
        if (faction && faction.color) {
            conf.mesh.color = faction.color;
        }

        conf.immat = this.#CurrentMobImmat;
        conf.id = "M_" + conf.immat;
        conf.speed = conf.speed / 50;
        conf.position = this.getFactionSpawnPoint(factionName, this.#Config.floor.size);
        conf.position.z = conf.mesh.altitude;
        conf.nickname = `${role}_${factionName}_${conf.immat}`;
        conf.theta.cur = this.#Formula.rand(0, 360);
        conf.floor = this.#Config.floor;

        const newMob = new Mob(conf, this.ProjectileManager);
        this.#AllMobs.push(newMob);
        this.#FactionManager.addMobToFaction(newMob, factionName);

        this.#CurrentMobImmat++;
        return newMob;
    }

    getFactionSpawnPoint(factionName, floorSize) {
        // Spawn all factions in a smaller radius around the center to ensure combat.
        const spawnRadius = floorSize.x / 4;

        const randomAngle = Math.random() * 2 * Math.PI;
        const randomRadius = Math.random() * spawnRadius;

        return {
            x: Math.cos(randomAngle) * randomRadius,
            y: Math.sin(randomAngle) * randomRadius,
            z: 0
        };
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

}