import Entity from './Entity.js';

class Mob extends Entity {
  constructor(geometry, material, ia) {
    super(geometry, material);
    this.ia = ia;
  }

  update(deltaTime) {
    super.update(deltaTime);
    if (this.ia) {
      this.ia.update(this, deltaTime);
    }
  }
}

export default Mob;