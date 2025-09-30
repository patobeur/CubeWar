class HealerIa extends BaseIa {
    constructor() {
        super();
    }

    iaAction(conf, player, allMobs) {
        const perceptionRange = conf.perception;
        const healAmount = 0.5; // Amount of HP to restore per heal action
        const healCooldown = 1000; // 1 second cooldown for healing

        // --- State Transitions ---
        const injuredAlly = this._findInjuredAlly(conf, allMobs, perceptionRange);

        if (injuredAlly) {
            conf.ia.state = 'healing';
            conf.ia.target = injuredAlly;
        } else if (conf.ia.state === 'healing') {
            // If no more injured allies, go back to exploring
            conf.ia.state = 'exploring';
            conf.ia.target = null;
        }


        // --- State Actions ---
        if (conf.ia.state === 'healing') {
            this._heal(conf, healAmount, healCooldown);
        } else {
            // If not healing, perform default actions (explore, find enemy, attack)
            super.iaAction(conf, player, allMobs);
        }
    }

    _findInjuredAlly(conf, allMobs, perceptionRange) {
        let bestTarget = null;
        let lowestHpPercent = 1;

        const mobPositionVec = new THREE.Vector3(conf.position.x, conf.position.y, conf.position.z);

        allMobs.forEach(ally => {
            // Check if it's a living ally of the same faction and not itself
            if (ally.conf.id !== conf.id && !ally.conf.states.dead && ally.conf.faction === conf.faction) {
                const distance = mobPositionVec.distanceTo(ally.mesh.position);
                const hpPercent = ally.conf.hp / ally.conf.maxHp;

                // Check if ally is injured and within perception range
                if (hpPercent < 1 && distance <= perceptionRange) {
                    if (hpPercent < lowestHpPercent) {
                        lowestHpPercent = hpPercent;
                        bestTarget = ally;
                    }
                }
            }
        });

        return bestTarget;
    }

    _heal(conf, healAmount, healCooldown) {
        const target = conf.ia.target;
        if (!target || target.conf.states.dead || target.conf.hp >= target.conf.maxHp) {
            conf.ia.state = 'exploring';
            conf.ia.target = null;
            return;
        }

        const targetPosition = target.mesh.position;
        const healerPositionVec = new THREE.Vector3(conf.position.x, conf.position.y, conf.position.z);
        const distance = healerPositionVec.distanceTo(targetPosition);
        const healRange = 2.0; // Range within which the healer can heal

        if (distance > healRange) {
            // Move towards the target
            const dy = targetPosition.y - conf.position.y;
            const dx = targetPosition.x - conf.position.x;
            conf.theta.cur = Math.atan2(dy, dx);
            const speed = conf.speed;
            conf.position.x += Math.cos(conf.theta.cur) * speed;
            conf.position.y += Math.sin(conf.theta.cur) * speed;
        } else {
            // Heal the target
            const now = Date.now();
            if (!conf.ia.lastHeal || now - conf.ia.lastHeal > healCooldown) {
                target.conf.hp += healAmount;
                if (target.conf.hp > target.conf.maxHp) {
                    target.conf.hp = target.conf.maxHp;
                }
                conf.ia.lastHeal = now;
                console.log(`${conf.nickname} healed ${target.conf.nickname} for ${healAmount} HP.`);
            }
        }
    }
}