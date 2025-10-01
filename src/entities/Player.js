import Entity from './Entity.js';

class Player extends Entity {
  constructor() {
    // The player is always of the PLAYER faction and starts as a PROTECTOR
    super('PLAYER', 'PROTECTOR');

    // Player-specific initializations
    this.mesh.position.y = 2.5; // Ensure it's on top of the floor
    this.speed = this.stats.speed; // Set speed from config
  }

  update(deltaTime) {
    super.update(deltaTime);
    // Player-specific update logic will go here (e.g., handling input)
  }
}

export default Player;