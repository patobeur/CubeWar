class PlayerConfig {
    #config;
    constructor() {
        this.#config = {
            pos: { x: 0, y: 0, z: 0 },
            playerColor: 'red',
            stats: {
                //-- Statistiques principales
                hp: { name: 'Vie', current: 100, max: 100, regen: 0.1, backgroundColor: 'rgba(250, 59, 9, 0.644)' },
                stamina: { name: 'Énergie', current: 100, max: 100, regen: 1.5, backgroundColor: 'rgba(9, 223, 20, 0.644)' },
                food: { name: 'Nourriture', current: 100, max: 100, regen: -0.01 },
                moral: { name: 'Moral', current: 50, max: 100, regen: 0 },
                //-- Statistiques secondaires
                force: { name: 'Force', current: 10, max: 100 },
                speed: { name: 'Vitesse', current: 1.0, max: 5 },
                perception: { name: 'Perception', current: 5, max: 20 },
                aggressivity: { name: 'Aggressivité', current: 0.5, max: 1 },
                intelligence: { name: 'Intelligence', current: 10, max: 100 },
                resistance: { name: 'Résistance', current: 0.1, max: 1 },
            }
        };
    }

    get_value(parent, value = false) {
        if (this.#config[parent]) {
            if (value && this.#config[parent][value]) {
                return this.#config[parent][value];
            } else {
                return this.#config[parent];
            }
        } else {
            console.error('PlayerConfig.' + parent + ' n\'existe pas !');
            return false;
        }
    }

    get_stats() {
        // Return a deep copy to prevent modification of the original config
        return JSON.parse(JSON.stringify(this.#config.stats));
    }
}