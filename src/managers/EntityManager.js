class EntityManager {
  constructor(scene) {
    this.scene = scene;
    this.entities = [];
  }

  add(entity) {
    this.entities.push(entity);
    if (entity.mesh) {
      this.scene.add(entity.mesh);
    }
    if (entity.statusBar) {
      this.scene.add(entity.statusBar.group);
    }
  }

  remove(entity) {
    const index = this.entities.indexOf(entity);
    if (index > -1) {
      this.entities.splice(index, 1);
      if (entity.mesh) {
        this.scene.remove(entity.mesh);
      }
      if (entity.statusBar) {
        this.scene.remove(entity.statusBar.group);
      }
    }
  }

  update(deltaTime, camera) {
    // First, update all entities, passing the full list for context and the camera
    for (const entity of this.entities) {
      entity.update(deltaTime, this.entities, camera);
    }

    // Then, find and remove dead entities
    // We iterate backwards to safely remove items from the array
    for (let i = this.entities.length - 1; i >= 0; i--) {
      const entity = this.entities[i];
      if (entity.isDead) {
        this.remove(entity);
      }
    }
  }
}

export default EntityManager;