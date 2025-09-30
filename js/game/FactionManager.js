class FactionManager {
    constructor(factionNames = ['blue', 'red', 'green', 'yellow', 'purple', 'neutral']) {
        this.factions = {};
        factionNames.forEach(name => {
            this.factions[name] = {
                name: name,
                members: [],
                // We can add faction-specific stats here later
            };
        });
        console.log("FactionManager initialized with factions:", this.factions);
    }

    /**
     * Assigns a mob to a faction.
     * @param {object} mob - The mob object to assign.
     * @param {string} factionName - The name of the faction.
     */
    addMobToFaction(mob, factionName) {
        if (this.factions[factionName]) {
            this.factions[factionName].members.push(mob);
            mob.faction = factionName; // Assign faction property to mob
        } else {
            console.error(`Faction "${factionName}" does not exist.`);
        }
    }

    /**
     * Removes a mob from its faction.
     * @param {object} mob - The mob object to remove.
     */
    removeMobFromFaction(mob) {
        const factionName = mob.faction;
        if (factionName && this.factions[factionName]) {
            const idToRemove = mob.conf ? mob.conf.id : mob.id; // Get ID from mob or player
            if (!idToRemove) return;

            const index = this.factions[factionName].members.findIndex(member => {
                const memberId = member.conf ? member.conf.id : member.id;
                return memberId === idToRemove;
            });

            if (index !== -1) {
                this.factions[factionName].members.splice(index, 1);
            }
        }
    }

    /**
     * Gets a random faction name.
     * @returns {string} The name of a random faction.
     */
    getRandomFaction() {
        const factionNames = Object.keys(this.factions);
        const randomIndex = Math.floor(Math.random() * factionNames.length);
        return factionNames[randomIndex];
    }

    /**
     * Gets all factions.
     * @returns {object} The factions object.
     */
    getFactions() {
        return this.factions;
    }
}