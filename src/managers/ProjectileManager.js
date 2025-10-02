import Projectile from '../entities/Projectile.js';

class ProjectileManager {
  constructor(scene) {
    this.scene = scene;
    this.projectiles = [];
  }

  createProjectile(caster, direction) {
    const projectile = new Projectile(caster, direction);
    this.projectiles.push(projectile);
    this.scene.add(projectile.mesh); // Add projectile's mesh to the scene
  }

  update(deltaTime, entities) {
    // Update and check collisions for each projectile
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const projectile = this.projectiles[i];
      projectile.update(deltaTime);

      // Check for collision with entities
      for (const entity of entities) {
        // A projectile cannot collide with its caster or allies
        if (entity.id === projectile.caster.id || entity.faction === projectile.caster.faction) {
          continue;
        }

        // Simple distance-based collision check
        if (entity.mesh && projectile.mesh.position.distanceTo(entity.mesh.position) < 5) {
          if (typeof entity.takeDamage === 'function') {
            entity.takeDamage(projectile.damage);
          }
          projectile.isDead = true;
          break; // Projectile is destroyed after one hit
        }
      }

      if (projectile.isDead) {
        this.scene.remove(projectile.mesh);
        this.projectiles.splice(i, 1);
      }
    }
  }
}

export default ProjectileManager;