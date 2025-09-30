class MobsIa {
    constructor() {
        this.Formula = new Formula();
    }

    iaAction(conf, player, allMobs) {
        // Initialize state if it doesn't exist
        if (!conf.ia.state) {
            conf.ia.state = 'exploring';
            conf.ia.actionTimer = 0;
            conf.ia.actionDuration = this.Formula.rand(2, 5) * 60; // 2-5 seconds
            conf.ia.isMoving = true;
            conf.ia.target = null;
        }

        // --- State Transitions ---
        // If exploring, always look for a target
        if (conf.ia.state === 'exploring') {
            this._findTarget(conf, player, allMobs);
        }

        // If attacking, check if the target is still valid
        if (conf.ia.state === 'attacking') {
            if (!conf.ia.target || conf.ia.target.conf?.states?.dead || conf.ia.target.stats?.hp.current <= 0) {
                conf.ia.state = 'exploring';
                conf.ia.target = null;
            }
        }


        // --- State Actions ---
        switch (conf.ia.state) {
            case 'exploring':
                this._explore(conf);
                break;
            case 'attacking':
                this._attack(conf);
                break;
            case 'fleeing':
                // To be implemented
                break;
            default:
                conf.ia.state = 'exploring';
                break;
        }
    }

    _findTarget(conf, player, allMobs) {
        const perceptionRange = conf.perception;
        let potentialTargets = [];
        const mobPositionVec = new THREE.Vector3(conf.position.x, conf.position.y, conf.position.z);


        // Check player
        if (player.faction !== conf.faction && player.stats.hp.current > 0) {
            const distance = mobPositionVec.distanceTo(player.playerGroupe.position);
            if (distance <= perceptionRange) {
                potentialTargets.push({ target: player, distance: distance });
            }
        }

        // Check other mobs
        allMobs.forEach(mob => {
            if (mob.conf.id !== conf.id && mob.conf.faction !== conf.faction && !mob.conf.states.dead) {
                const distance = mobPositionVec.distanceTo(mob.mesh.position);
                if (distance <= perceptionRange) {
                    potentialTargets.push({ target: mob, distance: distance });
                }
            }
        });

        if (potentialTargets.length > 0) {
            // Target the closest enemy
            potentialTargets.sort((a, b) => a.distance - b.distance);
            conf.ia.target = potentialTargets[0].target;
            conf.ia.state = 'attacking';
        }
    }

    _attack(conf) {
        if (!conf.ia.target) {
            conf.ia.state = 'exploring';
            return;
        }

        // Move towards the target
        const targetPosition = conf.ia.target.playerGroupe?.position || conf.ia.target.mesh?.position;
        if (!targetPosition) {
            conf.ia.state = 'exploring';
            return;
        }

        const angle = Math.atan2(
            targetPosition.y - conf.position.y,
            targetPosition.x - conf.position.x
        );

        // Convert angle to degrees for consistency with existing logic if needed
        // For now, using radians directly for movement is more efficient
        const speed = conf.speed;
        conf.position.x += Math.cos(angle) * speed;
        conf.position.y += Math.sin(angle) * speed;

        // Update rotation to face the target
        conf.theta.cur = angle * (180 / Math.PI) - 90; // Adjusting for model orientation
    }

    _explore(conf) {
        conf.ia.actionTimer++;

        if (conf.ia.actionTimer >= conf.ia.actionDuration) {
            conf.ia.actionTimer = 0;
            conf.ia.actionDuration = this.Formula.rand(2, 5) * 60; // New duration

            const willMove = Math.random() > 0.3;
            if (willMove) {
                conf.ia.isMoving = true;
                this._chooseNewDirection(conf);
            } else {
                conf.ia.isMoving = false;
                conf.ia.actionDuration = this.Formula.rand(1, 2) * 60;
            }
        }

        if (conf.ia.isMoving) {
            this._keepMoving(conf);
        }
    }

    _chooseNewDirection(conf) {
        const turnAngle = this.Formula.rand(-45, 45);
        conf.theta.cur += turnAngle;
    }

    _keepMoving(conf) {
        const speed = conf.speed;
        conf.position.x -= Math.sin(conf.theta.cur * (Math.PI / 180)) * speed;
        conf.position.y += Math.cos(conf.theta.cur * (Math.PI / 180)) * speed;

        const floorSize = conf.floor.size;
        if (conf.position.x < -floorSize.x / 2) conf.position.x = floorSize.x / 2;
        if (conf.position.x > floorSize.x / 2) conf.position.x = -floorSize.x / 2;
        if (conf.position.y < -floorSize.y / 2) conf.position.y = floorSize.y / 2;
        if (conf.position.y > floorSize.y / 2) conf.position.y = -floorSize.y / 2;
    }
}