class BaseIa {
  constructor() {
    this.target = null;
  }

  /**
   * Main update loop for the AI.
   * @param {Mob} mob - The mob this AI controls.
   * @param {number} deltaTime - The time since the last frame.
   * @param {Entity[]} entities - A list of all entities in the game.
   */
  update(mob, deltaTime, entities) {
    this.target = this.findClosestEnemy(mob, entities);

    const finalVector = new THREE.Vector3();

    if (this.target) {
      // 1. Calculate steering vector towards target
      const steerVector = new THREE.Vector3()
        .subVectors(this.target.mesh.position, mob.mesh.position)
        .normalize();
      finalVector.add(steerVector);
    }

    // 2. Calculate separation vector from allies
    const separationVector = this.getSeparationVector(mob, entities);
    // Give separation a higher weight to prioritize it
    separationVector.multiplyScalar(1.5);
    finalVector.add(separationVector);

    // 3. Apply the final calculated movement
    if (finalVector.length() > 0) {
      finalVector.normalize();
      const moveDistance = mob.speed * deltaTime;
      mob.mesh.position.add(finalVector.multiplyScalar(moveDistance));
    }
  }

  /**
   * Calculates a vector to steer away from nearby allies.
   * @param {Mob} mob - The current mob.
   * @param {Entity[]} entities - All entities in the game.
   * @returns {THREE.Vector3} The separation vector.
   */
  getSeparationVector(mob, entities) {
    const separationVector = new THREE.Vector3();
    const personalSpace = 15; // The radius to keep between mobs
    let neighborsCount = 0;

    for (const entity of entities) {
      // Only consider other mobs of the same faction
      if (entity === mob || entity.faction !== mob.faction) {
        continue;
      }

      const distance = mob.mesh.position.distanceTo(entity.mesh.position);
      if (distance > 0 && distance < personalSpace) {
        // Calculate a vector pointing away from the neighbor
        const awayVector = new THREE.Vector3().subVectors(mob.mesh.position, entity.mesh.position);
        // The separation force is now constant, not proportional to distance, to avoid "explosion" at close range.
        awayVector.normalize();
        separationVector.add(awayVector);
        neighborsCount++;
      }
    }

    if (neighborsCount > 0) {
      separationVector.divideScalar(neighborsCount);
    }

    return separationVector;
  }

  /**
   * Finds the closest enemy entity to the mob.
   * @param {Mob} mob - The mob searching for a target.
   * @param {Entity[]} entities - A list of all entities to check against.
   * @returns {Entity|null} The closest enemy entity, or null if none is found.
   */
  findClosestEnemy(mob, entities) {
    let closestEnemy = null;
    let minDistance = Infinity;

    for (const entity of entities) {
      // Do not target allies or self
      if (entity.faction === mob.faction) {
        continue;
      }

      const distance = mob.mesh.position.distanceTo(entity.mesh.position);
      if (distance < minDistance) {
        minDistance = distance;
        closestEnemy = entity;
      }
    }

    return closestEnemy;
  }
}

export default BaseIa;