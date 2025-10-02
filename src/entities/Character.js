import Entity from './Entity.js';
import StatusBar from '../ui/StatusBar.js';
import FACTIONS from '../config/factionConfig.js';
import ROLES from '../config/roleConfig.js';

class Character extends Entity {
  constructor(faction, role) {
    super(); // Call Entity constructor

    this.faction = faction;
    this.role = role;

    const roleConfig = ROLES[role];
    const factionConfig = FACTIONS[faction];

    if (!roleConfig || !factionConfig) {
      throw new Error(`Invalid faction or role for Character: ${faction}, ${role}`);
    }

    // Create mesh from config
    const geometry = roleConfig.createGeometry();
    const material = new THREE.MeshStandardMaterial({ color: factionConfig.color });
    this.mesh = new THREE.Mesh(geometry, material);

    // Setup stats and health
    this.stats = { ...roleConfig.stats };
    this.health = this.stats.health;
    this.speed = this.stats.speed;
    this.isDead = false;

    // Set initial height and store it
    const boundingBox = new THREE.Box3().setFromObject(this.mesh);
    this.height = boundingBox.max.y - boundingBox.min.y;
    this.mesh.position.y = this.height / 2;

    // Create a status bar for the character
    this.statusBar = new StatusBar();
  }

  update(deltaTime, entities, camera) {
    super.update(deltaTime, entities, camera);
    if (this.statusBar && camera) {
      // The status bar's position is the character's center y + half their height + a small offset.
      this.statusBar.group.position.x = this.mesh.position.x;
      this.statusBar.group.position.y = this.mesh.position.y + (this.height / 2) + 2;
      this.statusBar.group.position.z = this.mesh.position.z;

      // Update health display and orientation
      const healthPercentage = this.health / this.stats.health;
      this.statusBar.update(healthPercentage);
      // Make the status bar always face the camera (billboard effect)
      this.statusBar.group.quaternion.copy(camera.quaternion);
    }
  }

  takeDamage(amount) {
    if (this.isDead) return;

    this.health -= amount;
    console.log(`Entity ${this.id} (${this.role}) took ${amount} damage, health is now ${this.health}`);

    if (this.health <= 0) {
      this.health = 0;
      this.isDead = true;
      console.log(`Entity ${this.id} (${this.role}) has died.`);
    }
  }
}

export default Character;