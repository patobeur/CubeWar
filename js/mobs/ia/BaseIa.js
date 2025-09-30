class BaseIa {
    constructor() {
        this.Formula = new Formula();
    }

    iaAction(conf, player, allMobs) {
        // On initialization, convert the mob's starting angle (degrees) to radians.
        if (conf.ia.state === undefined) {
            conf.ia.state = 'exploring';
            conf.ia.actionTimer = 0;
            conf.ia.actionDuration = this.Formula.rand(2, 5) * 60; // in frames
            conf.ia.isMoving = true;
            conf.ia.target = null;
            conf.theta.cur = this.Formula.degToRad(conf.theta.cur); // Work in radians
            conf.isTargetingPlayer = false; // Initialize the new property
        }

        // --- State Transitions ---
        if (conf.ia.state === 'exploring') {
            this._findTarget(conf, player, allMobs);
        } else if (conf.ia.state === 'attacking') {
            const target = conf.ia.target;
            const isTargetInvalid = !target || (target.conf ? target.conf.states.dead : target.stats.hp.current <= 0);

            if (isTargetInvalid) {
                conf.ia.state = 'exploring';
                conf.ia.target = null;
                conf.isTargetingPlayer = false; // Reset when target is lost
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
        if (player.faction !== 'neutral' && conf.faction !== 'neutral' && player.faction !== conf.faction && player.stats.hp.current > 0) {
            const distance = mobPositionVec.distanceTo(player.playerGroupe.position);
            if (distance <= perceptionRange) {
                potentialTargets.push({ target: player, distance: distance });
            }
        }

        // Check other mobs
        allMobs.forEach(mob => {
            if (mob.conf.id !== conf.id && mob.conf.faction !== 'neutral' && !mob.conf.states.dead && mob.conf.faction !== conf.faction) {
                const distance = mobPositionVec.distanceTo(mob.mesh.position);
                if (distance <= perceptionRange) {
                    potentialTargets.push({ target: mob, distance: distance });
                }
            }
        });

        if (potentialTargets.length > 0) {
            potentialTargets.sort((a, b) => a.distance - b.distance);
            const bestTarget = potentialTargets[0].target;
            conf.ia.target = bestTarget;
            conf.ia.state = 'attacking';
            // Set a flag if the target is the player
            conf.isTargetingPlayer = (bestTarget.type === 'player');
        } else {
            conf.isTargetingPlayer = false;
        }
    }

    _attack(conf) {
        const target = conf.ia.target;
        if (!target) {
            conf.ia.state = 'exploring';
            return;
        }

        const targetPosition = target.playerGroupe?.position || target.mesh?.position;
        if (!targetPosition) {
            conf.ia.state = 'exploring';
            return;
        }

        // Correctly calculate the angle towards the target
        const dy = targetPosition.y - conf.position.y;
        const dx = targetPosition.x - conf.position.x;
        conf.theta.cur = Math.atan2(dy, dx);

        // Move towards the target
        const speed = conf.speed;
        conf.position.x += Math.cos(conf.theta.cur) * speed;
        conf.position.y += Math.sin(conf.theta.cur) * speed;

        this._applyBoundary(conf);
    }

    _explore(conf) {
        conf.ia.actionTimer++;

        if (conf.ia.actionTimer >= conf.ia.actionDuration) {
            conf.ia.actionTimer = 0;
            conf.ia.actionDuration = this.Formula.rand(2, 5) * 60;

            if (Math.random() > 0.3) {
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
        // Turn by a random amount in radians
        const turnAngle = this.Formula.degToRad(this.Formula.rand(-45, 45));
        conf.theta.cur += turnAngle;
    }

    _keepMoving(conf) {
        const speed = conf.speed;
        // Movement is based on standard angle (0 = right, PI/2 = up)
        conf.position.x += Math.cos(conf.theta.cur) * speed;
        conf.position.y += Math.sin(conf.theta.cur) * speed;

        const hitWall = this._applyBoundary(conf);
        if (hitWall) {
            // Force a change of direction upon hitting a wall
            this._chooseNewDirection(conf);
        }
    }

    _applyBoundary(conf) {
        const floorSize = conf.floor.size;
        const halfX = floorSize.x / 2;
        const halfY = floorSize.y / 2;
        let hitWall = false;

        if (conf.position.x < -halfX) {
            conf.position.x = -halfX;
            hitWall = true;
        } else if (conf.position.x > halfX) {
            conf.position.x = halfX;
            hitWall = true;
        }

        if (conf.position.y < -halfY) {
            conf.position.y = -halfY;
            hitWall = true;
        } else if (conf.position.y > halfY) {
            conf.position.y = halfY;
            hitWall = true;
        }

        return hitWall;
    }
}