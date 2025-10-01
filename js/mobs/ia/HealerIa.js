class HealerIa extends BaseIa {
    constructor() {
        super();
    }

    iaAction(conf, player, allMobs) {
        const perceptionRange = conf.perception;
        const healAmount = 0.5;
        const healCooldown = 1000;

        // --- State Transitions ---
        const injuredAlly = this._findInjuredAlly(conf, allMobs, perceptionRange);

        if (injuredAlly) {
            conf.ia.state = 'healing';
            conf.ia.target = injuredAlly;
        } else {
            // If no one is injured, find a healthy ally to follow
            const allyToFollow = this._findNearestAlly(conf, allMobs, perceptionRange);
            if (allyToFollow) {
                conf.ia.state = 'following_ally';
                conf.ia.target = allyToFollow;
            } else {
                // If no allies are nearby, revert to base exploration
                conf.ia.state = 'exploring';
                conf.ia.target = null;
            }
        }

        // Check for immediate threats ONLY if not healing or following
        if (conf.ia.state === 'exploring') {
            this._findTarget(conf, player, allMobs);
        }


        // --- State Actions ---
        switch (conf.ia.state) {
            case 'healing':
                this._heal(conf, healAmount, healCooldown, allMobs);
                break;
            case 'following_ally':
                this._followAlly(conf, allMobs);
                break;
            case 'attacking':
                // Healer attacks if threatened
                super._attack(conf);
                break;
            case 'exploring':
            default:
                // Default to exploring with cohesion
                super._explore(conf, allMobs);
                break;
        }
    }

    _findInjuredAlly(conf, allMobs, perceptionRange) {
        let bestTarget = null;
        let lowestHpPercent = 1;
        const mobPosition = new THREE.Vector2(conf.position.x, conf.position.y);

        allMobs.forEach(ally => {
            if (ally.conf.id !== conf.id && !ally.conf.states.dead && ally.conf.faction === conf.faction) {
                const distance = mobPosition.distanceTo(new THREE.Vector2(ally.conf.position.x, ally.conf.position.y));
                const hpPercent = ally.conf.hp / ally.conf.maxHp;

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

    _findNearestAlly(conf, allMobs, perceptionRange) {
        let nearestAlly = null;
        let minDistance = Infinity;
        const mobPosition = new THREE.Vector2(conf.position.x, conf.position.y);

        allMobs.forEach(ally => {
            if (ally.conf.id !== conf.id && !ally.conf.states.dead && ally.conf.faction === conf.faction) {
                const distance = mobPosition.distanceTo(new THREE.Vector2(ally.conf.position.x, ally.conf.position.y));
                if (distance < minDistance && distance <= perceptionRange) {
                    minDistance = distance;
                    nearestAlly = ally;
                }
            }
        });
        return nearestAlly;
    }


    _heal(conf, healAmount, healCooldown, allMobs) {
        const target = conf.ia.target;
        if (!target || target.conf.states.dead || target.conf.hp >= target.conf.maxHp) {
            conf.ia.state = 'exploring'; // Revert state if target is invalid
            conf.ia.target = null;
            return;
        }

        const targetPosition = new THREE.Vector2(target.conf.position.x, target.conf.position.y);
        const healerPosition = new THREE.Vector2(conf.position.x, conf.position.y);
        const distance = healerPosition.distanceTo(targetPosition);
        const healRange = 2.0;

        if (distance > healRange) {
            // Move towards the target, but with cohesion
            const moveVector = new THREE.Vector2().subVectors(targetPosition, healerPosition).normalize();
            const cohesionVector = this._getCohesionVector(conf, allMobs).multiplyScalar(0.4);
            moveVector.add(cohesionVector).normalize();

            conf.position.x += moveVector.x * conf.speed;
            conf.position.y += moveVector.y * conf.speed;
            if (moveVector.lengthSq() > 0.01) {
                conf.theta.cur = Math.atan2(moveVector.y, moveVector.x);
            }
        } else {
            // In range, heal the target
            const now = Date.now();
            if (!conf.ia.lastHeal || now - conf.ia.lastHeal > healCooldown) {
                target.conf.hp += healAmount;
                if (target.conf.hp > target.conf.maxHp) {
                    target.conf.hp = target.conf.maxHp;
                }
                conf.ia.lastHeal = now;
            }
        }
    }

    _followAlly(conf, allMobs) {
        const target = conf.ia.target;
        if (!target || target.conf.states.dead) {
            conf.ia.state = 'exploring';
            conf.ia.target = null;
            return;
        }

        const targetPos = new THREE.Vector2(target.conf.position.x, target.conf.position.y);
        const mobPos = new THREE.Vector2(conf.position.x, conf.position.y);
        const distance = mobPos.distanceTo(targetPos);

        if (distance > 3.5) { // Keep a comfortable distance
            const moveVector = new THREE.Vector2().subVectors(targetPos, mobPos).normalize();
            const cohesionVector = this._getCohesionVector(conf, allMobs).multiplyScalar(0.5);
            moveVector.add(cohesionVector).normalize();

            conf.position.x += moveVector.x * conf.speed;
            conf.position.y += moveVector.y * conf.speed;

            if (moveVector.lengthSq() > 0.01) {
                conf.theta.cur = Math.atan2(moveVector.y, moveVector.x);
            }
        }
    }
}