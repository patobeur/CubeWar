class Food {
    constructor(position, nutritionalValue = 20) {
        this.position = position;
        this.nutritionalValue = nutritionalValue;
        this.mesh = this.#createMesh();
    }

    #createMesh() {
        const geometry = new THREE.DodecahedronGeometry(0.5);
        const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(this.position.x, this.position.y, this.position.z);
        return mesh;
    }
}