import BaseIa from './BaseIa.js';

class RangerIa extends BaseIa {
  constructor(projectileManager) {
    super();
    this.projectileManager = projectileManager;
    this.attackRange = 80; // The ideal distance to start shooting
    this.kiteRange = 40;   // The distance at which it will start backing away
    this.attackCooldown = 2; // Time in seconds between shots
    this.cooldownTimer = 0;
  }

  update(mob, deltaTime, entities) {
    this.cooldownTimer -= deltaTime;
    this.target = this.findClosestEnemy(mob, entities);

    if (this.target) {
      const distanceToTarget = mob.mesh.position.distanceTo(this.target.mesh.position);
      const finalVector = new THREE.Vector3();

      // 1. Kiting behavior: If too close, move away from the target.
      if (distanceToTarget < this.kiteRange) {
        const kiteVector = new THREE.Vector3()
          .subVectors(mob.mesh.position, this.target.mesh.position)
          .normalize();
        finalVector.add(kiteVector);
      }
      // 2. Engagement behavior: If too far, move towards the target.
      else if (distanceToTarget > this.attackRange) {
        const steerVector = new THREE.Vector3()
          .subVectors(this.target.mesh.position, mob.mesh.position)
          .normalize();
        finalVector.add(steerVector);
      }
      // 3. Shooting behavior: If in perfect range, stop moving and shoot.
      else {
        if (this.cooldownTimer <= 0) {
          this.shoot(mob, this.target);
          this.cooldownTimer = this.attackCooldown;
        }
      }

      // Add separation from allies to avoid clumping
      const separationVector = this.getSeparationVector(mob, entities);
      separationVector.multiplyScalar(1.5);
      finalVector.add(separationVector);

      // Apply the final calculated movement
      if (finalVector.length() > 0) {
        finalVector.normalize();
        const moveDistance = mob.speed * deltaTime;
        mob.mesh.position.add(finalVector.multiplyScalar(moveDistance));
      }

    } else {
      // If there's no target, fall back to the base behavior (which includes separation)
      super.update(mob, deltaTime, entities);
    }
  }

  shoot(mob, target) {
    if (!this.projectileManager) {
      console.error("RangerIa is missing a projectileManager.");
      return;
    }
    const direction = new THREE.Vector3()
      .subVectors(target.mesh.position, mob.mesh.position)
      .normalize();
    this.projectileManager.createProjectile(mob, direction);
  }
}

export default RangerIa;