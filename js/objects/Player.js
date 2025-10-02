class Player {
	#player;
	#dp; // datas for player
	#currentStarImmat;
	constructor() {
		this.#Init();
	}
	#Init() {
		if (conslog) console.log("Player Mounted !");
		this.#currentStarImmat = 1;
		this.#set_dp();
	}
	getPlayer(name) {
		let shape = this.#dp[name].shape;
		let geometry;
		let material;
		if (shape == "cube") {
			geometry = new THREE.BoxGeometry(
				this.#dp[name][shape].width,
				this.#dp[name][shape].height,
				this.#dp[name][shape].depth
			);
			material = new THREE.MeshPhongMaterial({
				color: this.#dp[name].color,
				flatShading: this.#dp[name].flatShading,
			});
		}
		if (shape == "sphere") {
			geometry = new THREE.SphereGeometry(
				this.#dp[name][shape].radius,
				this.#dp[name][shape].widthSegments,
				this.#dp[name][shape].heightSegments
			);
			material = new THREE.MeshPhongMaterial({
				color: this.#dp[name].color,
				flatShading: this.#dp[name].flatShading,
			});
		}

		this.#player = new THREE.Mesh(geometry, material);

		this.#player.position.x = this.#dp[name].pos.x;
		this.#player.position.y = this.#dp[name].pos.y;
		this.#player.position.z = this.#dp[name].pos.z;
		this.#player.name = "Player_" + name;

		this.#player.castShadow = this.#dp[name].castShadow;
		this.#player.receiveShadow = this.#dp[name].receiveShadow;
		this.#player.matrixAutoUpdate = this.#dp[name].matrixAutoUpdate;

		let distFromCenter = this.#player.position.distanceTo(
			new THREE.Vector3(0, 0, 0)
		);
		this.#player.distFromCenter = distFromCenter;

		return this.#player;
	}
	#setBoundingBox(ele) {
		return new THREE.Box3().setFromObject(ele);
	}
	#set_dp = () => {
		this.#dp = {
			One: {
				lv: 0,
				experiencePoints: 0,
				shape: "sphere",
				sphere: {
					radius: 1,
					widthSegments: 16,
					heightSegments: 16,
					phiStart: 0,
					phiLength: Math.PI * 2,
					thetaStart: 0,
					thetaLength: Math.PI,
				},
				cube: {
					width: 1,
					height: 1,
					depth: 1,
					widthSegments: 1,
					heightSegments: 1,
					depthSegments: 1,
					thetaStart: 0,
				},
				pos: new THREE.Vector3(0, 30, 0),
				rotation: new THREE.Vector3(0, 0, 0),
				color: 0xff00ff,
				flatShading: true,
				wireframe: true,
				castShadow: true,
				receiveShadow: true,
				matrixAutoUpdate: true,
			},
		};
	};
}
