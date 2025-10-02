import Entity from './Entity.js';

class Projectile extends Entity {
  constructor(caster, direction) {
    super(); // Call Entity constructor

    this.faction = caster.faction;
    this.role = 'PROJECTILE';
    this.caster = caster;

    // Create the visual representation
    const geometry = new THREE.SphereGeometry(0.8, 8, 8);
    const material = new THREE.MeshStandardMaterial({ color: 0xffff00 }); // Yellow
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.copy(caster.mesh.position);

    // Projectile properties
    this.direction = direction.normalize();
    this.speed = 200;
    this.damage = 10;
    this.lifespan = 2; // Seconds before it disappears
    this.lifeTimer = 0;
  }

  update(deltaTime) {
    const moveDistance = this.speed * deltaTime;
    this.mesh.position.addScaledVector(this.direction, moveDistance);

    this.lifeTimer += deltaTime;
    if (this.lifeTimer >= this.lifespan) {
      this.isDead = true;
    }
  }
}

export default Projectile;