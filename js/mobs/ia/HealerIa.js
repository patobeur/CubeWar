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
            const allyToFollow = this._findAllyToFollow(conf, allMobs, perceptionRange);
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

    _findAllyToFollow(conf, allMobs, perceptionRange) {
        let nearestProtector = null;
        let minProtectorDistance = Infinity;
        let nearestAlly = null;
        let minAllyDistance = Infinity;
        const mobPosition = new THREE.Vector2(conf.position.x, conf.position.y);

        allMobs.forEach(ally => {
            if (ally.conf.id !== conf.id && !ally.conf.states.dead && ally.conf.faction === conf.faction) {
                const distance = mobPosition.distanceTo(new THREE.Vector2(ally.conf.position.x, ally.conf.position.y));
                if (distance <= perceptionRange) {
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
            }
        });

        // Prioritize protector, otherwise follow any other ally.
        return nearestProtector || nearestAlly;
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
        const followDistance = 3.5;

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
        const cohesionVector = this._getCohesionVector(conf, allMobs).multiplyScalar(0.5);
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