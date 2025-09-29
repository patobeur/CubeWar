class Projectile {
    constructor(position, direction, speed = 0.5, damage = 10) {
        this.position = position.clone();
        this.direction = direction.clone();
        this.speed = speed;
        this.damage = damage;
        this.mesh = this.#createMesh();
    }

    #createMesh() {
        const geometry = new THREE.SphereGeometry(0.2, 8, 8);
        const material = new THREE.MeshPhongMaterial({ color: 0xffffff });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(this.position);
        return mesh;
    }

    update() {
        this.mesh.position.add(this.direction.clone().multiplyScalar(this.speed));
    }
}