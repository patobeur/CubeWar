class BaseIa {
  constructor() {
    this.target = null;
  }

  update(mob, deltaTime, entities) {
    this.target = this.findClosestEnemy(mob, entities);

    const finalVector = new THREE.Vector3();

    if (this.target) {
      const distanceToTarget = mob.mesh.position.distanceTo(this.target.mesh.position);
      const engagementRange = 20; // Increased range

      if (distanceToTarget > engagementRange) {
        const steerVector = new THREE.Vector3()
          .subVectors(this.target.mesh.position, mob.mesh.position)
          .normalize();
        finalVector.add(steerVector);
      }
    }

    const separationVector = this.getSeparationVector(mob, entities);
    separationVector.multiplyScalar(1.5); // Prioritize separation
    finalVector.add(separationVector);

    if (finalVector.length() > 0) {
      finalVector.normalize();
      const moveDistance = mob.speed * deltaTime;
      mob.mesh.position.add(finalVector.multiplyScalar(moveDistance));
    }
  }

  getSeparationVector(mob, entities) {
    const separationVector = new THREE.Vector3();
    const personalSpace = 15;
    let neighborsCount = 0;

    for (const entity of entities) {
      if (entity === mob || entity.faction !== mob.faction) continue;

      const distance = mob.mesh.position.distanceTo(entity.mesh.position);
      if (distance > 0 && distance < personalSpace) {
        const awayVector = new THREE.Vector3().subVectors(mob.mesh.position, entity.mesh.position);
        awayVector.normalize(); // Use constant force to avoid "explosion"
        separationVector.add(awayVector);
        neighborsCount++;
      }
    }

    if (neighborsCount > 0) {
      separationVector.divideScalar(neighborsCount);
    }

    return separationVector;
  }

  findClosestEnemy(mob, entities) {
    let closestEnemy = null;
    let minDistance = Infinity;

    for (const entity of entities) {
      if (entity.faction === mob.faction || !entity.mesh) continue;

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