class RangerIa extends BaseIa {
    constructor() {
        super();
    }

    iaAction(conf, player, allMobs, scene) {
        if (conf.ia.paused === undefined) {
            conf.ia.paused = false;
            conf.ia.pauseTimer = 0;
        }

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
                this._kite(conf, optimalRange, allMobs, scene);
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

        allMobs.forEach(ally => {
            // Find a living protector of the same faction
            if (ally.conf.id !== conf.id &&
                !ally.conf.states.dead &&
                ally.conf.faction === conf.faction &&
                ally.conf.role === 'protecteur') {

                const distance = new THREE.Vector2(conf.position.x, conf.position.y).distanceTo(
                    new THREE.Vector2(ally.conf.position.x, ally.conf.position.y)
                );

                if (distance < minDistance) {
                    minDistance = distance;
                    bestBuddy = ally;
                }
            }
        });
        return bestBuddy;
    }

    _handlePausing(conf) {
        if (conf.ia.paused) {
            conf.ia.pauseTimer--;
            if (conf.ia.pauseTimer <= 0) {
                conf.ia.paused = false;
            }
            return true; // Is currently paused
        }
        return false; // Is not paused
    }


    _kite(conf, optimalRange, allMobs, scene) {
        const target = conf.ia.target;
        if (!target) {
            conf.ia.state = 'exploring'; // Revert state if target is lost
            return;
        }

        if (this._handlePausing(conf)) {
            return; // Ranger is paused, do nothing else
        }

        const targetPosition = target.playerGroupe?.position || target.mesh?.position;
        if (!targetPosition) {
            conf.ia.state = 'exploring';
            return;
        }

        const mobPosition = new THREE.Vector2(conf.position.x, conf.position.y);
        const targetPos = new THREE.Vector2(targetPosition.x, targetPosition.y);
        const distance = mobPosition.distanceTo(targetPos);
        let inOptimalRange = false;

        // --- Vector-based Movement ---
        let finalMove = new THREE.Vector2(0, 0);

        // 1. Kiting Vector (move to optimal range)
        let kiteVector = new THREE.Vector2().subVectors(mobPosition, targetPos);
        if (distance < optimalRange.min) {
            finalMove.add(kiteVector.normalize());
        } else if (distance > optimalRange.max) {
            finalMove.sub(kiteVector.normalize());
        } else {
            inOptimalRange = true;
        }

        // 2. Buddy Vector (stay near protector)
        if (conf.ia.buddy) {
            const buddyPos = new THREE.Vector2(conf.ia.buddy.conf.position.x, conf.ia.buddy.conf.position.y);
            const buddyDistance = mobPosition.distanceTo(buddyPos);
            if (buddyDistance > 4.0) { // Stay within 4 units of buddy
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
        } else if (inOptimalRange && Math.random() < 0.05) { // 5% chance to pause per frame
            conf.ia.paused = true;
            conf.ia.pauseTimer = this.Formula.rand(30, 90); // Pause for 0.5 to 1.5 seconds
        }

        // Always face the target when attacking
        const dy = targetPosition.y - conf.position.y;
        const dx = targetPosition.x - conf.position.x;
        conf.theta.cur = Math.atan2(dy, dx);

        // --- Shooting Logic ---
        const attackDistance = conf.attack_distance || 10;
        const attackCooldown = (conf.attack_cooldown || 1.5) * 1000; // in ms
        const now = Date.now();

        if (distance <= attackDistance && (now - (conf.lastAttack || 0) > attackCooldown)) {
            const skillName = 'fireball';
            const projectileHeight = conf.mesh.size.z / 2;
            // The mob's rotation is only on the Z-axis. We create a THREE.Euler object
            // to match the format expected by SkillsManager.
            // We apply the same -PI/2 correction as the visual mesh rotation.
            const mobRotation = new THREE.Euler(0, 0, conf.theta.cur - (Math.PI / 2));

            const skill = new SkillsManager(
                skillName,
                conf.position,
                mobRotation,
                projectileHeight,
                scene
            );

            const energyCost = skill.skillDatas.energyCost || 10;

            if (conf.stamina >= energyCost) {
                conf.stamina -= energyCost;
                conf.lastAttack = now; // Update last attack time
                skill.init(); // Fire!
            }
        }
    }

    _followBuddy(conf, allMobs) {
        const buddy = conf.ia.buddy;
        if (!buddy || buddy.conf.states.dead) {
            conf.ia.state = 'exploring';
            conf.ia.buddy = null;
            return;
        }

        if (this._handlePausing(conf)) {
            return; // Ranger is paused, do nothing else
        }

        const buddyPos = new THREE.Vector2(buddy.conf.position.x, buddy.conf.position.y);
        const mobPos = new THREE.Vector2(conf.position.x, conf.position.y);
        const distance = mobPos.distanceTo(buddyPos);
        const followDistance = 3.5;
        let isCloseEnough = false;

        let finalMove = new THREE.Vector2(0, 0);

        if (distance > followDistance) {
            // If too far, move towards buddy
            let followVector = new THREE.Vector2().subVectors(buddyPos, mobPos).normalize();
            finalMove.add(followVector);
        } else {
            // If close enough, roam
            isCloseEnough = true;
            conf.ia.actionTimer = (conf.ia.actionTimer || 0) + 1;
            if (conf.ia.actionTimer > (this.Formula.rand(60, 120))) { // Change direction every 1-2 seconds
                conf.ia.actionTimer = 0;
                conf.theta.cur += this.Formula.degToRad(this.Formula.rand(-60, 60));
            }
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
        } else if (isCloseEnough && Math.random() < 0.05) { // 5% chance to pause
            conf.ia.paused = true;
            conf.ia.pauseTimer = this.Formula.rand(45, 100); // Pause for a bit
        }
    }
}