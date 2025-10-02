import BaseIa from './BaseIa.js';

class ProtectorIa extends BaseIa {
  constructor() {
    super();
  }

  update(mob, deltaTime, entities) {
    // The Protector's job is to be a frontline tank, so the base behavior
    // of finding and moving towards the enemy is sufficient for now.
    super.update(mob, deltaTime, entities);
  }
}

export default ProtectorIa;