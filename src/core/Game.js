import * as THREE from '../../vendor/three.min.js';
import EntityManager from '../managers/EntityManager.js';
import Player from '../entities/Player.js';
import InputManager from '../managers/InputManager.js';

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
    this.camera.position.set(0, 40, 30);
    this.camera.lookAt(this.scene.position);

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

    // Handle window resizing
    window.addEventListener('resize', () => this.onWindowResize(), false);
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

    this.renderer.render(this.scene, this.camera);
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