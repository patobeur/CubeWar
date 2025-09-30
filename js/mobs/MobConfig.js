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
            return JSON.parse(JSON.stringify(this.config.base)); // Return a deep copy
        }

        // Create a new object by merging base and role-specific properties
        const mergedConfig = { ...this.config.base, ...selectedRole };

        // Specifically merge the 'mesh' object to avoid overwriting nested properties
        mergedConfig.mesh = { ...this.config.base.mesh, ...selectedRole.mesh };

        return mergedConfig;
    }

    _get_config() {
        return {
            base: {
                //-- Statistiques principales
                hp: 100,
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
                theta: {
                    cur: 0,
                    min: 0,
                    max: 360,
                },
                ia: {
                    changeAction: {
                        cur: 0,
                        min: 0,
                        max: 30,
                        choice: 0,
                        lastAction: 0,
                    },
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
                            size: { x: 0.5, y: 0.5, z: 0.5 },
                            position: { x: 0, y: 0.5, z: 0 },
                        },
                    },
                },
                states: {
                    dead: false,
                    collide: {
                        changed: false,
                        color: {
                            saved: false,
                            current: false,
                        },
                    },
                },
            },
            roles: {
                soigneur: {
                    // Role: Support
                    attack_distance: 2,
                    special_power: {
                        name: "heal",
                        range: 5, // units
                        cooldown: 0,
                    },
                    mesh: {
                        color: 0x00ff00, // Vert
                    },
                },
                tireur: {
                    // Role: DPS
                    attack_distance: 10,
                    attack_cooldown: 1.5, // sec
                    mesh: {
                        color: 0xff0000, // Rouge
                    },
                },
                protecteur: {
                    // Role: Tank
                    attack_distance: 5,
                    special_power: {
                        name: "wall",
                        duration: 3, // sec
                        cooldown: 10, // sec
                    },
                    mesh: {
                        color: 0x0000ff, // Bleu
                    },
                },
                cloud: {
                    speed: 0.2,
                    perception: 0, // Ne détecte rien
                    aggressivity: 0, // N'attaque jamais
                    mesh: {
                        size: { x: 8, y: 8, z: 0.2 },
                        altitude: 10,
                        color: 0xffffff,
                        opacity: 0.6,
                        childs: { front: false },
                    },
                },
            },
        };
    }
}