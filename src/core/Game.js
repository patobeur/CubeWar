import EntityManager from '../managers/EntityManager.js';
import InputManager from '../managers/InputManager.js';
import ProjectileManager from '../managers/ProjectileManager.js';
import Player from '../entities/Player.js';
import Mob from '../entities/Mob.js';
import BaseIa from '../ai/BaseIa.js';

class Game {
  constructor() {
    // Core Three.js components
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.clock = new THREE.Clock();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    // Managers
    this.entityManager = new EntityManager(this.scene);
    this.inputManager = new InputManager();
    this.projectileManager = new ProjectileManager(this.scene);

    this.initScene();
    this.initPlayer();
    this.spawnInitialMobs();

    window.addEventListener('resize', this.onWindowResize.bind(this), false);
  }

  spawnInitialMobs() {
    const enemyFaction = 'ENEMY_RED';
    const rolesToSpawn = ['PROTECTOR', 'SHOOTER', 'HEALER'];
    const spawnRadius = 60;
    const angles = [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3]; // 0, 120, 240 degrees

    rolesToSpawn.forEach((role, index) => {
      const ia = new BaseIa();
      const mob = new Mob(enemyFaction, role, ia);

      const angle = angles[index];
      mob.mesh.position.x = Math.cos(angle) * spawnRadius;
      mob.mesh.position.z = Math.sin(angle) * spawnRadius;

      this.entityManager.add(mob);
    });
  }

  initScene() {
    this.scene.background = new THREE.Color(0x333333);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 0);
    this.scene.add(directionalLight);

    const floorGeometry = new THREE.PlaneGeometry(200, 200);
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    this.scene.add(floor);
  }

  initPlayer() {
    this.player = new Player();
    this.entityManager.add(this.player);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  start() {
    this.#animate();
  }

  #animate() {
    requestAnimationFrame(this.#animate.bind(this));

    const deltaTime = this.clock.getDelta();

    this.handlePlayerMovement(deltaTime);
    this.handlePlayerShooting();
    this.entityManager.update(deltaTime);
    this.projectileManager.update(deltaTime, this.entityManager.entities);
    this.updateCamera();

    this.renderer.render(this.scene, this.camera);

    // Update input manager at the end of the frame
    this.inputManager.update();
  }

  handlePlayerMovement(deltaTime) {
    if (!this.player) return;
    const moveDistance = this.player.speed * deltaTime;

    if (this.inputManager.isKeyPressed('KeyW')) {
      this.player.mesh.position.z -= moveDistance;
    }
    if (this.inputManager.isKeyPressed('KeyS')) {
      this.player.mesh.position.z += moveDistance;
    }
    if (this.inputManager.isKeyPressed('KeyA')) {
      this.player.mesh.position.x -= moveDistance;
    }
    if (this.inputManager.isKeyPressed('KeyD')) {
      this.player.mesh.position.x += moveDistance;
    }
  }

  updateCamera() {
    if (!this.player) return;
    const playerPosition = this.player.mesh.position;
    const cameraOffset = new THREE.Vector3(0, 20, 35);
    this.camera.position.copy(playerPosition).add(cameraOffset);
    this.camera.lookAt(playerPosition);
  }

  handlePlayerShooting() {
    if (this.inputManager.isKeyJustPressed('Space')) {
      // The direction is hardcoded "forward" in the world, as the player doesn't rotate yet.
      const direction = new THREE.Vector3(0, 0, -1);
      this.projectileManager.createProjectile(this.player, direction);
    }
  }
}

export default Game;