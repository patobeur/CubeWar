class RangerIa extends BaseIa {
    constructor() {
        super();
    }

    iaAction(conf, player, allMobs) {
        const optimalRange = { min: 4.0, max: 8.0 };

        // --- Target Management ---
        if (!conf.ia.target || conf.ia.target.conf?.states.dead || conf.ia.target.stats?.hp.current <= 0) {
            conf.ia.target = null;
            this._findTarget(conf, player, allMobs);
        }

        // --- Buddy Management ---
        if (!conf.ia.buddy || conf.ia.buddy.conf.states.dead) {
            conf.ia.buddy = this._findBuddy(conf, allMobs);
        }

        // --- State Transitions ---
        if (conf.ia.target) {
            conf.ia.state = 'attacking';
        } else if (conf.ia.buddy) {
            conf.ia.state = 'following_buddy';
        } else {
            conf.ia.state = 'exploring';
        }


        // --- State Actions ---
        switch (conf.ia.state) {
            case 'attacking':
                this._kite(conf, optimalRange, allMobs);
                break;
            case 'following_buddy':
                this._followBuddy(conf, allMobs);
                break;
            case 'exploring':
                super._explore(conf, allMobs);
                break;
        }
    }

    _findBuddy(conf, allMobs) {
        let bestBuddy = null;
        let minDistance = Infinity;
        const perceptionRadius = conf.perception * 1.5; // Can see protectors a bit further away

        allMobs.forEach(ally => {
            // Find a living protector of the same faction
            if (ally.conf.id !== conf.id &&
                !ally.conf.states.dead &&
                ally.conf.faction === conf.faction &&
                ally.conf.role === 'protecteur') {

                const distance = new THREE.Vector2(conf.position.x, conf.position.y).distanceTo(
                    new THREE.Vector2(ally.conf.position.x, ally.conf.position.y)
                );

                if (distance < perceptionRadius && distance < minDistance) {
                    minDistance = distance;
                    bestBuddy = ally;
                }
            }
        });
        return bestBuddy;
    }


    _kite(conf, optimalRange, allMobs) {
        const target = conf.ia.target;
        if (!target) {
            conf.ia.state = 'exploring'; // Revert state if target is lost
            return;
        }

        const targetPosition = target.playerGroupe?.position || target.mesh?.position;
        if (!targetPosition) {
            conf.ia.state = 'exploring';
            return;
        }

        const mobPosition = new THREE.Vector2(conf.position.x, conf.position.y);
        const targetPos = new THREE.Vector2(targetPosition.x, targetPosition.y);
        const distance = mobPosition.distanceTo(targetPos);

        // --- Vector-based Movement ---
        let finalMove = new THREE.Vector2(0, 0);

        // 1. Kiting Vector (move to optimal range)
        let kiteVector = new THREE.Vector2().subVectors(mobPosition, targetPos);
        if (distance < optimalRange.min) {
            // Too close, move away
            finalMove.add(kiteVector.normalize());
        } else if (distance > optimalRange.max) {
            // Too far, move closer
            finalMove.sub(kiteVector.normalize());
        }

        // 2. Buddy Vector (stay near protector)
        if (conf.ia.buddy) {
            const buddyPos = new THREE.Vector2(conf.ia.buddy.conf.position.x, conf.ia.buddy.conf.position.y);
            const buddyDistance = mobPosition.distanceTo(buddyPos);
            if (buddyDistance > 3.0) { // Stay within 3 units of buddy
                let buddyVector = new THREE.Vector2().subVectors(buddyPos, mobPosition).normalize();
                finalMove.add(buddyVector.multiplyScalar(0.5)); // Buddy influence is weighted
            }
        }

        // 3. Cohesion Vector (stick with the group)
        const cohesionVector = this._getCohesionVector(conf, allMobs).multiplyScalar(0.4);
        finalMove.add(cohesionVector);


        // --- Update Position and Rotation ---
        if (finalMove.lengthSq() > 0.01) {
            finalMove.normalize();
            conf.position.x += finalMove.x * conf.speed;
            conf.position.y += finalMove.y * conf.speed;
        }

        // Always face the target when attacking
        const dy = targetPosition.y - conf.position.y;
        const dx = targetPosition.x - conf.position.x;
        conf.theta.cur = Math.atan2(dy, dx);
    }

    _followBuddy(conf, allMobs) {
        const buddy = conf.ia.buddy;
        if (!buddy || buddy.conf.states.dead) {
            conf.ia.state = 'exploring';
            conf.ia.buddy = null;
            return;
        }

        const buddyPos = new THREE.Vector2(buddy.conf.position.x, buddy.conf.position.y);
        const mobPos = new THREE.Vector2(conf.position.x, conf.position.y);
        const distance = mobPos.distanceTo(buddyPos);

        if (distance > 2.5) { // If too far, move towards buddy
            const moveVector = new THREE.Vector2().subVectors(buddyPos, mobPos).normalize();

            // Also consider cohesion
            const cohesionVector = this._getCohesionVector(conf, allMobs).multiplyScalar(0.5);
            moveVector.add(cohesionVector).normalize();

            conf.position.x += moveVector.x * conf.speed;
            conf.position.y += moveVector.y * conf.speed;

            if (moveVector.lengthSq() > 0.01) {
                conf.theta.cur = Math.atan2(moveVector.y, moveVector.x);
            }
        }
        // If close enough, just stand still (or wander slightly via cohesion)
    }
}