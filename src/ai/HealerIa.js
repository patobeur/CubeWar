import BaseIa from './BaseIa.js';

class HealerIa extends BaseIa {
  constructor() {
    super();
    this.healRange = 20; // The range at which it can heal
    this.healCooldown = 3; // Time in seconds between heals
    this.cooldownTimer = 0;
    this.healAmount = 25;
  }

  update(mob, deltaTime, entities) {
    this.cooldownTimer -= deltaTime;

    // 1. Find the most wounded ally to heal.
    const healTarget = this.findWoundedAlly(mob, entities);

    if (healTarget) {
      const distanceToHealTarget = mob.mesh.position.distanceTo(healTarget.mesh.position);

      // If in range, heal.
      if (distanceToHealTarget <= this.healRange) {
        if (this.cooldownTimer <= 0) {
          this.heal(mob, healTarget);
          this.cooldownTimer = this.healCooldown;
        }
        // If in range and healing, don't move towards the target.
        // Instead, let the separation vector do its work to avoid clumping.
        const finalVector = this.getSeparationVector(mob, entities);
        finalVector.multiplyScalar(1.5);
        if (finalVector.length() > 0) {
            finalVector.normalize();
            mob.mesh.position.add(finalVector.multiplyScalar(mob.speed * deltaTime));
        }
        return; // Don't do anything else
      }
      // If not in range, move towards the heal target.
      else {
        const direction = new THREE.Vector3().subVectors(healTarget.mesh.position, mob.mesh.position).normalize();
        const separationVector = this.getSeparationVector(mob, entities);
        separationVector.multiplyScalar(1.5);
        direction.add(separationVector).normalize();
        mob.mesh.position.add(direction.multiplyScalar(mob.speed * deltaTime));
        return;
      }
    }

    // 2. If no one needs healing, find a Protector to follow.
    const protectorToFollow = this.findAllyToFollow(mob, entities, 'PROTECTOR');
    if (protectorToFollow) {
        const distanceToProtector = mob.mesh.position.distanceTo(protectorToFollow.mesh.position);
        if (distanceToProtector > this.healRange) { // Stay close to the protector
            const direction = new THREE.Vector3().subVectors(protectorToFollow.mesh.position, mob.mesh.position).normalize();
            const separationVector = this.getSeparationVector(mob, entities);
            separationVector.multiplyScalar(1.5);
            direction.add(separationVector).normalize();
            mob.mesh.position.add(direction.multiplyScalar(mob.speed * deltaTime));
            return; // Action is complete for this frame.
        } else {
            // Already in range of the protector, just apply separation logic and do nothing else.
            const separationVector = this.getSeparationVector(mob, entities);
            if (separationVector.lengthSq() > 0) {
                separationVector.normalize();
                mob.mesh.position.add(separationVector.multiplyScalar(mob.speed * deltaTime * 0.5)); // Move slowly
            }
            return; // Action is complete for this frame.
        }
    }

    // 3. If no one to heal and no protector to follow, fall back to base behavior (attack enemy).
    super.update(mob, deltaTime, entities);
  }

  findWoundedAlly(mob, entities) {
    let mostWoundedAlly = null;
    let lowestHealthPercentage = 1; // 100%

    for (const entity of entities) {
      // Must be an ally, not self, and must be damaged (health < max health)
      if (entity.faction !== mob.faction || entity.id === mob.id || entity.health >= entity.stats.health) continue;

      const healthPercentage = entity.health / entity.stats.health;
      if (healthPercentage < lowestHealthPercentage) {
        lowestHealthPercentage = healthPercentage;
        mostWoundedAlly = entity;
      }
    }
    return mostWoundedAlly;
  }

  findAllyToFollow(mob, entities, role = 'PROTECTOR') {
    for (const entity of entities) {
        if (entity.faction === mob.faction && entity.id !== mob.id && entity.role === role) {
            return entity;
        }
    }
    return null;
  }

  heal(mob, target) {
    if (target && typeof target.takeDamage === 'function') {
      target.takeDamage(-this.healAmount); // Healing is negative damage
      // Optional: console.log(`HEAL ACTION: Mob ${mob.id} healed Target ${target.id}`);
    }
  }
}

export default HealerIa;