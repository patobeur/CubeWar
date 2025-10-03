import Mob from '../entities/Mob.js';
import ProtectorIa from '../ai/ProtectorIa.js';
import RangerIa from '../ai/RangerIa.js';
import HealerIa from '../ai/HealerIa.js';

class WaveManager {
  constructor(entityManager, projectileManager) {
    this.entityManager = entityManager;
    this.projectileManager = projectileManager;
    this.waveNumber = 0;
    this.waveCooldown = 10; // Time in seconds between waves
    this.countdown = 5; // Initial delay before the first wave
    this.enemiesPerWave = 2;
    this.isWaveActive = false;
    this.uiElement = document.getElementById('wave-ui');
  }

  update(deltaTime) {
    if (this.isWaveActive) {
      // Check if all enemies are defeated
      const activeEnemies = this.entityManager.entities.filter(e => e.faction.startsWith('ENEMY_'));
      if (activeEnemies.length === 0) {
        this.endWave();
      }
    } else {
      this.countdown -= deltaTime;
      this.updateUI();
      if (this.countdown <= 0) {
        this.startNextWave();
      }
    }
  }

  startNextWave() {
    this.waveNumber++;
    this.isWaveActive = true;
    this.updateUI();
    console.log(`Wave ${this.waveNumber} starting!`);

    // Increase difficulty for the next wave
    this.enemiesPerWave = 2 + this.waveNumber;

    this.spawnWave();
  }

  endWave() {
    console.log(`Wave ${this.waveNumber} cleared!`);
    this.isWaveActive = false;
    this.countdown = this.waveCooldown;
    this.updateUI();
  }

  updateUI() {
    if (!this.uiElement) return;
    if (this.isWaveActive) {
      this.uiElement.textContent = `Wave: ${this.waveNumber}`;
    } else {
      this.uiElement.textContent = `Next wave in: ${Math.ceil(this.countdown)}s`;
    }
  }

  spawnWave() {
    const enemyFaction = 'ENEMY_RED';
    const roles = ['PROTECTOR', 'SHOOTER', 'HEALER'];
    const spawnRadius = 80;

    const iaMapping = {
      PROTECTOR: () => new ProtectorIa(),
      SHOOTER: () => new RangerIa(this.projectileManager),
      HEALER: () => new HealerIa(),
    };

    for (let i = 0; i < this.enemiesPerWave; i++) {
      const role = roles[Math.floor(Math.random() * roles.length)];
      const ia = iaMapping[role]();
      const mob = new Mob(enemyFaction, role, ia);

      const angle = Math.random() * Math.PI * 2;
      mob.mesh.position.x = Math.cos(angle) * spawnRadius;
      mob.mesh.position.z = Math.sin(angle) * spawnRadius;

      this.entityManager.add(mob);
    }
  }
}

export default WaveManager;