class StatusBar {
  constructor(maxWidth = 10, color = 0xff0000) {
    this.maxWidth = maxWidth;
    this.group = new THREE.Group();

    const barHeight = 1;

    // Background
    const bgGeometry = new THREE.PlaneGeometry(this.maxWidth, barHeight);
    const bgMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const background = new THREE.Mesh(bgGeometry, bgMaterial);
    this.group.add(background);

    // Foreground (health bar)
    const fgGeometry = new THREE.PlaneGeometry(this.maxWidth, barHeight);
    // By translating the geometry, we make it scale from the left edge.
    fgGeometry.translate(this.maxWidth / 2, 0, 0);

    const fgMaterial = new THREE.MeshBasicMaterial({ color: color });
    this.healthBar = new THREE.Mesh(fgGeometry, fgMaterial);

    // Position the left-aligned bar so it's centered on the background
    this.healthBar.position.x = -this.maxWidth / 2;
    this.healthBar.position.z = 0.1; // Avoid z-fighting
    this.group.add(this.healthBar);
  }

  update(healthPercentage) {
    // Now we only need to update the scale. The position is fixed.
    this.healthBar.scale.x = Math.max(0, healthPercentage);
  }

  lookAt(cameraPosition) {
    this.group.lookAt(cameraPosition);
  }
}

export default StatusBar;