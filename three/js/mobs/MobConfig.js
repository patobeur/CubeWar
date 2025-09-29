class MobConfig {
	config
	constructor() {
		this.config = this.#get_config()
	}
	get_(parent, value = false) {
		let confParent = this.config[parent] ?? false;
		let confValue = confParent[value]
			? confParent[value]
			: confParent
				? confParent
				: false;
		return { ...confValue }
	}
	#get_config() {
		const config = {
			mobs: {
				lv: 0,
				speed: 1,
				theta: {
					cur: 0,
					min: 0,
					max: 360
				},
				faction: 'rangers',
				ia: {
					// can change mind every x milisec
					changeAction: {
						cur: 0,
						min: 0,
						max: 30,
						choice: 0,
						lastAction: 0
					},
					dirAmplitude: 360 / 8
				},
				divs: {
					prima: {
						divName: 'prima',
						className: 'prima',
						size: { x: 1, y: 1, z: 1 },
						parentDivName: false,
						position: 'relative',
						borderRadius: '50%',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
					},
					range: {
						divName: 'range',
						className: 'range',
						size: { x: 50, y: 50, z: 50 },
						backgroundColor: 'rgba(255, 255, 255, .95)',
						parentDivName: 'prima',
						position: 'absolute',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'flex-end',
						borderRadius: '50%',
						transition: 'transform 1s ease',
						comment: 'colision range',
					},
					dir: {
						divName: 'dir',
						className: 'dir',
						size: { x: 10, y: 8, z: 4 },
						backgroundColor: 'rgba(0, 0, 0, 0.8)',
						parentDivName: 'range',
						position: 'absolute',
						borderRadius: '50%',

					},
					ico: {
						divName: 'ico',
						className: 'ico',
						size: { x: 20, y: 20, z: 20 },
						backgroundColor: 'rgba(255,200,100,1)',
						parentDivName: 'prima',
						position: 'absolute',
						borderRadius: '50%',
						textAlign: 'center',
						boxShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)'

					},
					info: {
						divName: 'info',
						className: 'info',
						size: { x: 40, y: 20, z: 40 },
						backgroundColor: 'rgba(150,150,255,.8)',
						parentDivName: 'prima',
						color: 'white',
						position: 'absolute',
						top: '60%',
						textAlign: 'center',
						borderRadius: '.2rem',
						padding: '0 .5rem',
						width: 'max-content',
						boxShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)'
					},
				},
				mesh: {
					size: { x: 1, y: 1, z: 1 },
					color: 'yellow',
					wireframe: false,

				},
				stats: {
					hp: 100,
					stamina: 100,
					food: 100,
					morale: 100,
					strength: 10,
					speed: 1,
					perception: 5,
					aggressiveness: 0.5,
					intelligence: 0.5,
					resistance: 0
				}
			}
		}
		return { ...config }
	}
}
