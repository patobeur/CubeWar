"use strict";
class Formula {
	constructor() {

	}
	get_NextHtmlPos = (x, y, tetha, speed) => {
		tetha = this.degToRad(tetha)

		let neo = {
			x: x - Math.sin(tetha) * speed,
			y: y + Math.cos(tetha) * speed
		}

		neo.x = Math.round(neo.x * 10) / 10;
		neo.y = Math.round(neo.y * 10) / 10;

		neo = {
			x: neo.x > window.innerWidth
				? neo.x - window.innerWidth
				: neo.x < 0
					? window.innerWidth - neo.x
					: neo.x,
			y: neo.y > window.innerHeight
				? neo.y - window.innerHeight
				: neo.y < 0
					? window.innerHeight - neo.y
					: neo.y
		}

		return neo
	}
	get_NextThreePos = (x, y, theta, speed) => {
		return {
			x: x - Math.sin(theta) * speed,
			y: y + Math.cos(theta) * speed
		}
	}
	getNextOrbit(x, y, theta) {
		return {
			x: (x * Math.cos(theta)) - (y * Math.sin(theta)),
			y: (x * Math.sin(theta)) + (y * Math.cos(theta))
		}
	}
	getDistanceXY = (from, destination) => {
		let AB = (destination.position.x) - (from.position.x)
		let AC = (destination.position.y) - (from.position.y)
		let distance = Math.sqrt((AB * AB) + (AC * AC))
		console.log("distanceXY:", distance)
		return distance
	}
	getDistanceXYZ = (A, B) => {
		{
			if (!B) { B = { position: { x: 0, y: 0, z: 0 } } }
			let AB = (B.position.x) - (A.position.x)
			let AC = (B.position.y) - (A.position.y)
			let BC = (B.position.z) - (A.position.z)
			let distance = Math.floor(Math.sqrt((AB * AB) + (AC * AC) + (BC * BC)))
			// console.log("distanceXYZ:", distance);
			return distance
		}
	}

	rand = (min, max) => { return Math.floor(Math.random() * (max - min + 1) + min) }
	degToRad = (deg) => { return deg * (Math.PI / 180); }
	radToDeg = (rad) => { return rad * (180 / Math.PI); }

	get_aleaPosOnScreen(size) {

		let maxX = window.innerWidth;
		let maxY = window.innerHeight;

		let pos = {
			x: this.rand(0, maxX - (size.x / 2)),
			y: this.rand(0, maxY - (size.y / 2)),
			z: 0//this.rand(-1, 1)
		}
		// console.log(size, pos)
		return pos
	}
	get_aleaPosOnFloor(floorSize) {

		let pos = {
			x: this.rand(-(floorSize.x / 2), (floorSize.x / 2)),
			y: this.rand(-(floorSize.y / 2), (floorSize.y / 2)),
			z: 0//this.rand(-1, 1)
		}
		// console.log(size, pos)
		return pos
	}
	get_NextOrbitPosXYZ = (obj, centerObj = false) => {
		if (centerObj === false) { centerObj = { position: { x: 0, y: 0, z: 0 } } }
		// this.getDistanceXYZ(obj, centerObj)
		let distance = this.getDistanceXYZ(obj, centerObj);
		if (obj.theta[0] > obj.theta[1]) {
			obj.theta[0] = obj.theta[0] - obj.theta[1]
		}
		// if (obj.theta && centerObj) {
		// 	// sun pos
		let centerX = 0;
		let centerY = 0;
		let centerZ = 0;
		let centerW = .1;
		let centerH = .1;
		let centerD = .1;
		// 	// new pos
		let x2 = 0
		let y2 = 0
		let z2 = 0
		// 	if (obj.objtype === 'player') {
		// 	}
		if (distance > 0) {
			// console.log('player check orbital force')
			x2 = centerX + ((distance) * (Math.cos(obj.theta.x[0])));
			y2 = centerY + ((distance) * (Math.sin(obj.theta.y[0])));
			z2 = centerZ + ((distance) * (Math.sin(obj.theta.z[0])));
		}
		else {
			x2 = centerX + (centerW * (Math.cos(obj.theta.x[0])));
			y2 = centerY + (centerH * (Math.sin(obj.theta.y[0])));
			z2 = centerZ + (centerD * (Math.sin(obj.theta.z[0])));
		}
		// console.log(obj)
		// 	// saving new pos in obj
		// 	if (obj.orbitdir && obj.orbitdir > 0) {
		if (obj.theta.x[2] > 0) {
			obj.position.x = x2// - (obj.geometry.parameters.width / 2)
			obj.theta.x[0] = obj.theta.x[0] + obj.theta.x[2];
			obj.rotation.x = THREE.Math.degToRad(obj.theta.x[0])
		}
		if (obj.theta.y[2] > 0) {
			obj.position.y = y2// - (obj.geometry.parameters.height / 2)
			obj.theta.y[0] = obj.theta.y[0] + obj.theta.y[2];
			obj.rotation.y = THREE.Math.degToRad(obj.theta.y[0])
		}
		if (obj.theta.z[2] > 0) {
			obj.position.z = z2// - (obj.geometry.parameters.depth/ 2)
			obj.theta.z[0] = obj.theta.z[0] + obj.theta.z[2];
			obj.rotation.z = THREE.Math.degToRad(obj.theta.z[0])
		}
		if (obj.target) {
			obj.target.position.set(0, 0, 0);
		}
		// 	}
		// 	else {
		// 		obj.theta[0] = obj.theta[0] - obj.theta[2]
		// 	}
	}
	get_NextOrbitPosXYZ2 = (obj, centerObj = false) => {

		if (centerObj === false) { centerObj = { position: { x: 0, y: 0, z: 0 } } }
		let distance = obj.centerDistance
		// let distance = Formula.getDistanceXYZ(obj, centerObj)

		// console.log('distance', distance)
		if (obj.theta[0] > obj.theta[1]) {
			obj.theta[0] = obj.theta[0] - obj.theta[1]
		}
		// if (obj.theta && centerObj) {
		// 	// sun pos
		let centerX = 0;
		let centerY = 0;
		let centerZ = 0;
		let centerW = .1;
		let centerH = .1;
		let centerD = .1;
		// 	// new pos
		let x2 = 0
		let y2 = 0
		let z2 = 0
		// 	if (obj.objtype === 'player') {
		// 	}
		if (distance > 0) {
			// console.log('player check orbital force')
			x2 = centerX + ((distance) * (Math.cos(obj.theta.x[0])));
			y2 = centerY + ((distance) * (Math.sin(obj.theta.y[0])));
			z2 = centerZ + ((distance) * (Math.cos(obj.theta.z[0])));
		}
		else {
			x2 = centerX + (centerW * (Math.cos(obj.theta.x[0])));
			y2 = centerY + (centerH * (Math.sin(obj.theta.y[0])));
			z2 = centerZ + (centerD * (Math.sin(obj.theta.z[0])));
		}
		// console.log(obj)
		// 	// saving new pos in obj
		// 	if (obj.orbitdir && obj.orbitdir > 0) {
		if (obj.theta.x[2] > 0) {
			obj.position.x = x2// - (obj.geometry.parameters.width / 2)
			obj.theta.x[0] = obj.theta.x[0] + obj.theta.x[2];
			// obj.rotation.x = THREE.Math.degToRad(obj.theta.x[0])
		}
		if (obj.theta.y[2] > 0) {
			obj.position.y = y2// - (obj.geometry.parameters.height / 2)
			obj.theta.y[0] = obj.theta.y[0] + obj.theta.y[2];
			// obj.rotation.y = THREE.Math.degToRad(obj.theta.y[0])
		}
		if (obj.theta.z[2] > 0) {
			obj.position.z = z2// - (obj.geometry.parameters.depth/ 2)
			obj.theta.z[0] = obj.theta.z[0] + obj.theta.z[2];
			// obj.rotation.z = THREE.Math.degToRad(obj.theta.z[0])
		}
		if (obj.target) {
			obj.target.position.set(0, 0, 0);
		}
		// 	}
		// 	else {
		// 		obj.theta[0] = obj.theta[0] - obj.theta[2]
		// 	}
	}
	get_CartesianFromLatLngDist = (pt) => {
		let lat = (90 - pt.lat) * Math.PI / 180
		let lng = (180 + pt.lng) * Math.PI / 180
		// let x = pt.alt + (Math.sin(lat) * Math.cos(lng))
		// let y = pt.alt + (-Math.sin(lat) * Math.sin(lng))
		// let z = pt.alt + (-Math.cos(lat))
		let x = pt.alt + (Math.sin(lat) * Math.cos(lng));
		let y = pt.alt + (Math.sin(lat) * Math.sin(lng));
		let z = pt.alt + Math.cos(lat);
		let retour = new THREE.Vector3(x, y, z);
		return retour
	}

	// check_collisions = (obj, typeobj) => {
	// 	let alertedistancebeforedie = 30
	// 	// CHECK COLLiSION with mobs
	// 	this.MF[typeobj].forEach(objB => {
	// 		if (objB.immat != obj.immat) {
	// 			let distance = this.get_distance(obj, objB);
	// 			// die alert range test only for player right now
	// 			if (obj.objtype === 'player') {
	// 				// self range test (explode condition here)
	// 				(distance < ((obj.sizwhl.w / 2) + (objB.sizwhl.w / 2)))
	// 					? obj.collide.collideself = true
	// 					: '';
	// 			}
	// 			((distance - alertedistancebeforedie) < ((obj.sizwhl.w / 2) + (objB.sizwhl.w / 2)))
	// 				? obj.collide.collidealert = true
	// 				: '';
	// 			// rangea test
	// 			(distance < ((obj.sizwhl.w * 2) + (objB.sizwhl.w)))
	// 				? obj.collide.colliderangea = true
	// 				: '';
	// 			this.check_collisionsDirectives(obj, objB)
	// 		}
	// 	});
	// }

	check_collisionsDirectives = (obj, objB) => {

		// if (obj.collide.collidesocial) {
		// }else 
		// if (obj.collide.colliderangea) {
		// 	// console.log('yes')
		// 	// rangeacolorsave is temporary
		// 	if (!objB.rangeacolorsave) {
		// 		objB.rangeacolorsave = objB.rangeacolor;
		// 		console.log(objB.objname + ' en approche... ' + objB.textcontent)
		// 		objB.rangeacolor = this.collidingRangeAColor
		// 	}
		// 	// rangeacolorsave is temporary
		// 	if (!obj.rangeacolorsave) {
		// 		obj.rangeacolorsave = obj.rangeacolor;
		// 		obj.rangeacolor = this.collidingRangeAColor
		// 	}
		// }
		// else {
		// 	// console.log('non')
		// 	if (!objB.rangeacolorsave === false) {
		// 		objB.rangeacolor = objB.rangeacolorsave
		// 		objB.rangeacolorsave = false
		// 	}
		// 	if (!obj.rangeacolorsave === false) {
		// 		obj.rangeacolor = obj.rangeacolorsave
		// 		obj.rangeacolorsave = false
		// 	}
		// }

		if (obj.collide.collideself) {
			obj.status.dead = true
			console.log('ooops ! Lost in spaaaaaace !!')
			console.log('obj.status.dead:' + obj.status.dead)
			// this.gameOn = false
		}
	}
}
class DomAction {


}
function addCss(stringcss, styleid) {
	let style = document.createElement('style');
	style.textContent = stringcss
	style.id = styleid
	document.getElementsByTagName('head')[0].appendChild(style);
}
// trigonometrie
function get_distance(from, destination) { // get hypotenus with pythaGore
	// let AB = (a.x + (a.w / 2)) - (b.x + (b.w / 2))
	// let AC = (a.y + (a.h / 2)) - (b.y + (b.h / 2))
	// 	let AB = (a.x) - (b.x)
	// 	let AC = (a.y) - (b.y)
	let AB = (destination.x) - (from.x)
	let AC = (destination.y) - (from.y)
	let distance = Math.sqrt((AB * AB) + (AC * AC))
	return distance
}
let get_PosWithDegree = (player) => {
	// let x = parseInt(player.datas.pos.x + (player.datas.character.physics.speed.current * Math.cos((player.datas.pos.d) * (Math.PI / 180))))
	// let y = parseInt(player.datas.pos.y + (player.datas.character.physics.speed.current * Math.sin((player.datas.pos.d) * (Math.PI / 180))))
	let x = player.datas.pos.x + (player.datas.character.physics.speed.current * Math.cos((player.datas.pos.d) * (Math.PI / 180)))
	let y = player.datas.pos.y + (player.datas.character.physics.speed.current * Math.sin((player.datas.pos.d) * (Math.PI / 180)))
	return { x: x, y: y }
}

function get_DegreeWithTwoPos(fromX, fromY, destX, destY,) {
	var nextY = fromY - destY;
	var nextX = fromX - destX;
	var theta = Math.atan2(nextX, nextY); // 0° = east
	theta = (theta * 180 / Math.PI); // radians to degrees
	// if (theta < 0) {
	// 	theta += 360; // negative case
	// }
	// console.log(
	// 	theta
	// )
	return theta;
}
// function getNextPos(x, y, theta, speed) {
// 	return {
// 		x: x - Math.sin(theta) * speed,
// 		y: y + Math.cos(theta) * speed
// 	}
// }

// function communsTools() {
// 	return {
// 		get_randomRadians: () => {
// 			return this.communsTools.get_aleaEntreBornes(0, 400)
// 		},
// 		get_aleaEntreBornes: (minimum, maximum) => {
// 			return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum
// 		},
// 		get_DegreeWithTwoPos: (fromX, fromY, destX, destY,) => {
// 			var nextY = fromY - destY;
// 			var nextX = fromX - destX;
// 			var theta = Math.atan2(-nextY, -nextX); // 0° = east
// 			theta *= 180 / Math.PI; // radians to degrees
// 			if (theta < 0) theta += 360; // negative case
// 			return theta;
// 		},
// 		// trigonometrie
// 		get_PosWithDegree: (player) => {
// 			// let x = parseInt(player.datas.pos.x + (player.datas.character.physics.speed.current * Math.cos((player.datas.pos.d) * (Math.PI / 180))))
// 			// let y = parseInt(player.datas.pos.y + (player.datas.character.physics.speed.current * Math.sin((player.datas.pos.d) * (Math.PI / 180))))
// 			let x = player.datas.pos.x + (player.datas.character.physics.speed.current * Math.cos((player.datas.pos.d) * (Math.PI / 180)))
// 			let y = player.datas.pos.y + (player.datas.character.physics.speed.current * Math.sin((player.datas.pos.d) * (Math.PI / 180)))
// 			return { x: x, y: y }
// 		},
// 		// trigonometrie
// 		get_Distance: (from, destination) => { // get hypotenus with pythaGore
// 			let AB = (destination.x) - (from.x)
// 			let AC = (destination.y) - (from.y)
// 			return Math.sqrt((AB * AB) + (AC * AC))
// 		},
// 	}
// }
