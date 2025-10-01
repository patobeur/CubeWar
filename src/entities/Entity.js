let nextId = 0;

class Entity {
  constructor(geometry, material) {
    this.id = nextId++;
    this.mesh = new THREE.Mesh(geometry, material);
  }

  update(deltaTime) {
    // Logique de mise à jour de l'entité (position, rotation, etc.)
  }
}

export default Entity;