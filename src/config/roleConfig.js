const ROLES = {
  PROTECTOR: {
    geometry: new THREE.BoxGeometry(5, 5, 5),
    stats: {
      health: 150,
      speed: 50,
    },
  },
  SHOOTER: {
    geometry: new THREE.TetrahedronGeometry(4),
    stats: {
      health: 80,
      speed: 60,
    },
  },
  HEALER: {
    geometry: new THREE.SphereGeometry(3),
    stats: {
      health: 100,
      speed: 55,
    },
  },
};

export default ROLES;