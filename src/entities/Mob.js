import Entity from './Entity.js';

class Mob extends Entity {
  constructor(faction, role, ia) {
    super(faction, role);
    this.ia = ia;
    this.speed = this.stats.speed;

    // The height will be set in the spawner function after the x/z position is defined.
  }

  update(deltaTime, entities) {
    super.update(deltaTime, entities);
    if (this.ia) {
      this.ia.update(this, deltaTime, entities);
    }
  }
}

export default Mob;