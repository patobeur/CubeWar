import Character from './Character.js';

class Mob extends Character {
  constructor(faction, role, ia) {
    super(faction, role);
    this.ia = ia;
  }

  update(deltaTime, entities, camera) {
    super.update(deltaTime, entities, camera);
    if (this.ia) {
      this.ia.update(this, deltaTime, entities);
    }
  }
}

export default Mob;