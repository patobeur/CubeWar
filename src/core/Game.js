import EntityManager from '../managers/EntityManager.js';
import Player from '../entities/Player.js';
import Mob from '../entities/Mob.js';
import InputManager from '../managers/InputManager.js';
import BaseIa from '../ai/BaseIa.js';

class Game {
  constructor() {
    // Core components
    this.clock = new THREE.Clock();
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x333333);

    // Camera
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 0);
    this.scene.add(directionalLight);

    // Floor
    const floorGeometry = new THREE.PlaneGeometry(200, 200);
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2; // Rotate to be horizontal
    this.scene.add(floor);

    // Managers
    this.entityManager = new EntityManager(this.scene);
    this.inputManager = new InputManager();

    // Create Player
    this.player = this.createPlayer();
    this.entityManager.add(this.player);

    // Spawn initial enemies
    this.spawnInitialMobs();

    // Handle window resizing
    window.addEventListener('resize', () => this.onWindowResize(), false);
  }

  spawnInitialMobs() {
    const enemyFaction = 'RED';
    const rolesToSpawn = ['PROTECTOR', 'SHOOTER', 'HEALER'];
    const spawnRadius = 60; // A fixed radius for predictable spawning
    const angles = [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3]; // 0, 120, 240 degrees

    rolesToSpawn.forEach((role, index) => {
      const ia = new BaseIa();
      const mob = new Mob(enemyFaction, role, ia);

      // Assign a fixed position in a circle
      const angle = angles[index];
      mob.mesh.position.x = Math.cos(angle) * spawnRadius;
      mob.mesh.position.z = Math.sin(angle) * spawnRadius;

      // Set height after defining horizontal position to avoid conflicts
      const boundingBox = new THREE.Box3().setFromObject(mob.mesh);
      mob.mesh.position.y = (boundingBox.max.y - boundingBox.min.y) / 2;

      this.entityManager.add(mob);
    });
  }

  createPlayer() {
    const player = new Player();
    return player;
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
    requestAnimationFrame(() => this.#animate());

    const deltaTime = this.clock.getDelta();

    this.handlePlayerMovement(deltaTime);
    this.entityManager.update(deltaTime);
    this.updateCamera();

    this.renderer.render(this.scene, this.camera);
  }

  updateCamera() {
    if (!this.player) return;

    const playerPosition = this.player.mesh.position;
    // Position the camera behind and above the player
    const cameraOffset = new THREE.Vector3(0, 20, 35);

    this.camera.position.copy(playerPosition).add(cameraOffset);
    this.camera.lookAt(playerPosition);
  }

  handlePlayerMovement(deltaTime) {
    const speed = this.player.speed;
    const moveDistance = speed * deltaTime;

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
}

export default Game;