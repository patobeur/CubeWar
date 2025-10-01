class ProtectorIa extends BaseIa {
    constructor() {
        super();
    }

    iaAction(mob, player, allMobs) {
        const conf = mob.conf;
        // 1. Prioritize finding threats to allies
        const threat = this._findThreatToAlly(mob, allMobs);

        if (threat) {
            conf.ia.state = 'protecting';
            conf.ia.target = threat;
        } else if (conf.ia.state === 'protecting') {
            // If the threat is gone or out of range, revert to default behavior
            conf.ia.state = 'exploring';
            conf.ia.target = null;
        }

        // 2. Perform actions based on state
        if (conf.ia.state === 'protecting') {
            // Move to and attack the threat
            super._attack(mob);
        } else {
            // If no specific threat to an ally is found, revert to base behavior
            super.iaAction(mob, player, allMobs);
        }
    }

    _findThreatToAlly(mob, allMobs) {
        const conf = mob.conf;
        const perceptionRange = conf.perception;
        const mobPositionVec = new THREE.Vector3(conf.position.x, conf.position.y, conf.position.z);
        let potentialThreats = [];

        allMobs.forEach(enemyMob => {
            // Is it an enemy?
            if (enemyMob.conf.faction !== 'neutral' && enemyMob.conf.faction !== conf.faction && !enemyMob.conf.states.dead) {
                const enemyTarget = enemyMob.conf.ia.target;

                // Does the enemy have a target, and is that target an ally of ours?
                if (enemyTarget && (enemyTarget.conf?.faction === conf.faction || enemyTarget.faction === conf.faction)) {
                    const distanceToThreat = mobPositionVec.distanceTo(enemyMob.mesh.position);

                    // Is the threat within our perception range?
                    if (distanceToThreat <= perceptionRange) {
                        potentialThreats.push({ target: enemyMob, distance: distanceToThreat });
                    }
                }
            }
        });

        if (potentialThreats.length > 0) {
            // Sort by distance to find the closest threat
            potentialThreats.sort((a, b) => a.distance - b.distance);
            return potentialThreats[0].target;
        }

        return null;
    }
}