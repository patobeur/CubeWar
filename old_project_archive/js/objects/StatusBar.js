class StatusBar {
    constructor(width, height, color) {
        this.width = width;
        this.height = height;
        this.color = color;

        // Create the background bar (black)
        const bgGeometry = new THREE.PlaneGeometry(width, height);
        const bgMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
        this.background = new THREE.Mesh(bgGeometry, bgMaterial);
        this.background.position.z = -0.01; // Ensure it's behind the colored bar

        // Create the foreground bar (colored)
        const fgGeometry = new THREE.PlaneGeometry(width, height);
        const fgMaterial = new THREE.MeshBasicMaterial({ color: this.color });
        this.bar = new THREE.Mesh(fgGeometry, fgMaterial);
        this.bar.position.x = -this.width / 2; // Start at the left edge

        // Group them together
        this.group = new THREE.Group();
        this.group.add(this.background);
        this.group.add(this.bar);
    }

    update(currentValue, maxValue) {
        const percentage = Math.max(0, Math.min(1, currentValue / maxValue));
        this.bar.scale.x = percentage;
        // Adjust the position to keep it left-aligned
        this.bar.position.x = -this.width / 2 + (this.width * percentage) / 2;
    }

    // Make the status bar always face the camera
    lookAtCamera(camera) {
        this.group.lookAt(camera.position);
    }
}