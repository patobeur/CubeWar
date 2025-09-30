class RangerIa extends BaseIa {
    constructor() {
        super();
    }

    iaAction(conf, player, allMobs) {
        const optimalRange = { min: 4.0, max: 8.0 };

        // If the ranger doesn't have a target, find one.
        if (!conf.ia.target || conf.ia.target.conf?.states.dead || conf.ia.target.stats?.hp.current <= 0) {
            conf.ia.state = 'exploring';
            conf.ia.target = null;
            super._findTarget(conf, player, allMobs); // Use base method to find a target
        }

        // If a target is found, transition to attacking state
        if (conf.ia.target) {
            conf.ia.state = 'attacking';
        }


        // --- State Actions ---
        if (conf.ia.state === 'attacking') {
            this._kite(conf, optimalRange);
        } else {
            // If not attacking, explore
            super._explore(conf);
        }
    }

    _kite(conf, optimalRange) {
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

        const mobPositionVec = new THREE.Vector3(conf.position.x, conf.position.y, conf.position.z);
        const distance = mobPositionVec.distanceTo(targetPosition);
        const speed = conf.speed;

        // Calculate angle to/from target
        const dy = targetPosition.y - conf.position.y;
        const dx = targetPosition.x - conf.position.x;
        const angle = Math.atan2(dy, dx);
        conf.theta.cur = angle; // Always face the target

        if (distance < optimalRange.min) {
            // Target is too close, move away
            conf.position.x -= Math.cos(angle) * speed;
            conf.position.y -= Math.sin(angle) * speed;
        } else if (distance > optimalRange.max) {
            // Target is too far, move closer
            conf.position.x += Math.cos(angle) * speed;
            conf.position.y += Math.sin(angle) * speed;
        }
        // If within optimal range, the ranger will stop moving and the main combat logic will handle the attacks.
    }
}