class CubeStats {
    constructor(stats) {
        // Main Stats
        this.hp = { current: stats.hp || 100, max: stats.hp || 100, regen: stats.hpRegen || 0.1 };
        this.stamina = { current: stats.stamina || 100, max: stats.stamina || 100, regen: stats.staminaRegen || 1.5 };
        this.food = { current: stats.food || 100, max: stats.food || 100, regen: 0 };
        this.morale = { current: stats.morale || 100, max: stats.morale || 100, regen: 0 };

        // Secondary Stats
        this.strength = stats.strength || 10;
        this.speed = stats.speed || 1;
        this.perception = stats.perception || 5;
        this.aggressiveness = stats.aggressiveness || 0.5;
        this.intelligence = stats.intelligence || 0.5;
        this.resistance = stats.resistance || 0;
    }
}