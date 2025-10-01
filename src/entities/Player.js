import * as THREE from '../../vendor/three.min.js';
import Entity from './Entity.js';

class Player extends Entity {
  constructor() {
    const geometry = new THREE.BoxGeometry(5, 5, 5);
    const material = new THREE.MeshStandardMaterial({ color: 0x0000ff }); // Blue cube
    super(geometry, material);

    this.mesh.position.y = 2.5; // Place the cube on top of the floor
    this.speed = 50; // Units per second
  }

  update(deltaTime) {
    super.update(deltaTime);
    // Player-specific update logic will go here (e.g., handling input)
  }
}

export default Player;