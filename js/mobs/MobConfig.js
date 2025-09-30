class MobConfig {
    config;
    constructor(role = 'tireur') {
        this.role = role;
        this.config = this._get_config();
    }

    get_(role = false) {
        const roleName = role || this.role;
        const selectedRole = this.config.roles[roleName];

        if (!selectedRole) {
            console.error(`Role "${roleName}" not found in config.`);
            return JSON.parse(JSON.stringify(this.config.base));
        }

        // A simple custom deep merge function to safely combine configs
        function mergeDeep(target, source) {
            for (const key in source) {
                if (source[key] instanceof Object && key in target && target[key] instanceof Object) {
                    mergeDeep(target[key], source[key]);
                } else {
                    target[key] = source[key];
                }
            }
            return target;
        }

        // Start with a deep copy of the base config
        const config = JSON.parse(JSON.stringify(this.config.base));

        return mergeDeep(config, selectedRole);
    }

    _get_config() {
        return {
            base: {
                //-- Statistiques principales
                hp: 100,
                maxHp: 100,
                stamina: 100,
                food: 100,
                moral: 50,
                //-- Statistiques secondaires
                force: 10,
                speed: 1.0, // (case/sec)
                perception: 5, // (cases)
                aggressivity: 0.5, // 50%
                intelligence: 'medium',
                resistance: 0.1, // 10%
                //-- Technical stats
                lv: 0,
                theta: { cur: 0, min: 0, max: 360 },
                ia: {
                    state: undefined,
                    changeAction: { cur: 0, min: 0, max: 30, choice: 0, lastAction: 0 },
                    dirAmplitude: 360 / 8,
                },
                mesh: {
                    size: { x: 1, y: 1, z: 1 },
                    altitude: 0,
                    color: "yellow",
                    wireframe: false,
                    childs: {
                        front: {
                            color: "black",
                            wireframe: false,
                            size: { x: 0.2, y: 0.4, z: 0.2 },
                            position: { x: 0, y: 0.5, z: 0 },
                        },
                    },
                },
                states: {
                    dead: false,
                    collide: { changed: false, color: { saved: false, current: false } },
                },
            },
            roles: {
                soigneur: { // Support: a large cube with a long, thin smaller cube in front
                    attack_distance: 2,
                    special_power: { name: "heal", range: 5, cooldown: 0 },
                    mesh: {
                        color: 0x00ff00, // Green
                        size: { x: 1.2, y: 1.2, z: 1.2 }, // Large cube
                        childs: {
                            front: {
                                size: { x: 0.2, y: 1.0, z: 0.2 }, // Long, thin front
                                position: { x: 0, y: 0.8, z: 0 },
                            },
                        },
                    },
                },
                tireur: { // Shooter: like the player (a cube and a smaller one in front)
                    attack_distance: 10,
                    attack_cooldown: 1.5,
                    mesh: {
                        color: 0xff0000, // Red
                        // Inherits size and childs from base config
                    },
                },
                protecteur: { // Tank: a large, flat cube with a small cube in front
                    attack_distance: 5,
                    special_power: { name: "wall", duration: 3, cooldown: 10 },
                    mesh: {
                        color: 0x0000ff, // Blue
                        size: { x: 1.5, y: 1.5, z: 0.8 }, // Large, flat cube
                        childs: {
                            front: {
                                position: { x: 0, y: 0.9, z: 0 },
                            },
                        },
                    },
                },
                cloud: {
                    speed: 0.2,
                    perception: 0,
                    aggressivity: 0,
                    mesh: {
                        size: { x: 8, y: 8, z: 0.2 },
                        altitude: 10,
                        color: 0xffffff,
                        opacity: 0.6,
                        childs: { front: false }, // Explicitly disable the front piece
                    },
                },
            },
        };
    }
}