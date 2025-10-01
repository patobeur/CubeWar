class EntityManager {
  constructor(scene) {
    this.scene = scene;
    this.entities = [];
  }

  add(entity) {
    this.entities.push(entity);
    this.scene.add(entity.mesh);
  }

  remove(entity) {
    const index = this.entities.indexOf(entity);
    if (index > -1) {
      this.entities.splice(index, 1);
      this.scene.remove(entity.mesh);
    }
  }

  update(deltaTime) {
    for (const entity of this.entities) {
      entity.update(deltaTime);
    }
  }
}

export default EntityManager;