let nextId = 0;

class Entity {
  constructor() {
    this.id = nextId++;
    this.mesh = null;
  }

  update(deltaTime) {
    // To be implemented by subclasses
  }
}

export default Entity;