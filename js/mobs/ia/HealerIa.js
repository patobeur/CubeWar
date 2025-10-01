class HealerIa extends BaseIa {
    constructor() {
        super();
    }

    iaAction(mob, player, allMobs) {
        const conf = mob.conf;
        const healAmount = 0.5;
        const healCooldown = 1000;

        // --- State Transitions ---
        const injuredAlly = this._findInjuredAlly(mob, allMobs);

        if (injuredAlly) {
            conf.ia.state = 'healing';
            conf.ia.target = injuredAlly;
        } else {
            // If no one is injured, find a healthy ally to follow
            const allyToFollow = this._findAllyToFollow(mob, allMobs);
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
            this._findTarget(mob, player, allMobs);
        }


        // --- State Actions ---
        switch (conf.ia.state) {
            case 'healing':
                this._heal(mob, healAmount, healCooldown, allMobs);
                break;
            case 'following_ally':
                this._followAlly(mob, allMobs);
                break;
            case 'attacking':
                // Healer attacks if threatened
                super._attack(mob);
                break;
            case 'exploring':
            default:
                // Default to exploring with cohesion
                super._explore(mob, allMobs);
                break;
        }
    }

    _findInjuredAlly(mob, allMobs) {
        const conf = mob.conf;
        let bestTarget = null;
        let lowestHpPercent = 1;

        allMobs.forEach(ally => {
            if (ally.conf.id !== conf.id && !ally.conf.states.dead && ally.conf.faction === conf.faction) {
                const hpPercent = ally.conf.hp / ally.conf.maxHp;

                if (hpPercent < 1) {
                    if (hpPercent < lowestHpPercent) {
                        lowestHpPercent = hpPercent;
                        bestTarget = ally;
                    }
                }
            }
        });
        return bestTarget;
    }

    _findAllyToFollow(mob, allMobs) {
        const conf = mob.conf;
        let nearestProtector = null;
        let minProtectorDistance = Infinity;
        let nearestAlly = null;
        let minAllyDistance = Infinity;
        const mobPosition = new THREE.Vector2(conf.position.x, conf.position.y);

        allMobs.forEach(ally => {
            if (ally.conf.id !== conf.id && !ally.conf.states.dead && ally.conf.faction === conf.faction) {
                const distance = mobPosition.distanceTo(new THREE.Vector2(ally.conf.position.x, ally.conf.position.y));
                // Is the ally a protector?
                if (ally.conf.role === 'protecteur') {
                    if (distance < minProtectorDistance) {
                        minProtectorDistance = distance;
                        nearestProtector = ally;
                    }
                } else { // It's another type of ally
                    if (distance < minAllyDistance) {
                        minAllyDistance = distance;
                        nearestAlly = ally;
                    }
                }
            }
        });

        // Prioritize protector, otherwise follow any other ally.
        return nearestProtector || nearestAlly;
    }


    _heal(mob, healAmount, healCooldown, allMobs) {
        const conf = mob.conf;
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
            const cohesionVector = this._getCohesionVector(mob, allMobs).multiplyScalar(0.4);
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

    _followAlly(mob, allMobs) {
        const conf = mob.conf;
        const target = conf.ia.target;
        if (!target || target.conf.states.dead) {
            conf.ia.state = 'exploring';
            conf.ia.target = null;
            return;
        }

        const targetPos = new THREE.Vector2(target.conf.position.x, target.conf.position.y);
        const mobPos = new THREE.Vector2(conf.position.x, conf.position.y);
        const distance = mobPos.distanceTo(targetPos);
        const followDistance = 4.5;

        let finalMove = new THREE.Vector2(0, 0);

        if (distance > followDistance) {
            // If too far, move towards target
            let followVector = new THREE.Vector2().subVectors(targetPos, mobPos).normalize();
            finalMove.add(followVector);
        } else {
            // If close enough, just roam a little using a simplified explore logic
            conf.ia.actionTimer = (conf.ia.actionTimer || 0) + 1;
            if (conf.ia.actionTimer > (this.Formula.rand(60, 120))) { // Change direction every 1-2 seconds
                conf.ia.actionTimer = 0;
                conf.theta.cur += this.Formula.degToRad(this.Formula.rand(-60, 60)); // Small random turn
            }
            // A small nudge forward to keep it from being static
            let roamVector = new THREE.Vector2(Math.cos(conf.theta.cur), Math.sin(conf.theta.cur)).multiplyScalar(0.2);
            finalMove.add(roamVector);
        }

        // Always add cohesion
        const cohesionVector = this._getCohesionVector(mob, allMobs).multiplyScalar(0.5);
        finalMove.add(cohesionVector);

        // Update position and rotation
        if (finalMove.lengthSq() > 0.01) {
            finalMove.normalize();
            conf.position.x += finalMove.x * conf.speed;
            conf.position.y += finalMove.y * conf.speed;
            conf.theta.cur = Math.atan2(finalMove.y, finalMove.x);
        }
    }
}