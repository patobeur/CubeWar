import FACTIONS from '../config/factionConfig.js';
import ROLES from '../config/roleConfig.js';

let nextId = 0;

class Entity {
  constructor(faction, role) {
    this.id = nextId++;
    this.faction = faction;
    this.role = role;

    const roleConfig = ROLES[role];
    const factionConfig = FACTIONS[faction];

    if (!roleConfig || !factionConfig) {
      throw new Error(`Invalid faction or role: ${faction}, ${role}`);
    }

    // Copy geometry to ensure each entity has a unique instance
    const geometry = roleConfig.geometry.clone();
    const material = new THREE.MeshStandardMaterial({ color: factionConfig.color });

    this.mesh = new THREE.Mesh(geometry, material);
    this.stats = { ...roleConfig.stats }; // Copy stats
  }

  update(deltaTime) {
    // To be implemented by subclasses
  }
}

export default Entity;