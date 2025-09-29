class MobsIa {
    constructor() {
        this.Formula = new Formula();
        this.target = null;
    }

    iaAction(self, allMobs, foodItems, game) {
        if (self.stats.hp.current <= 0) {
            return;
        }

        // Low health behavior
        if (self.stats.hp.current < 30) {
            const food = this.#scanForFood(self, foodItems);
            if (food) {
                const direction = new THREE.Vector3().subVectors(food.mesh.position, self.mesh.position).normalize();
                self.conf.position.x += direction.x * self.conf.speed;
                self.conf.position.y += direction.y * self.conf.speed;
                self.conf.theta.cur = Math.atan2(direction.y, direction.x);
                return;
            }
            if (this.target) {
                this.#flee(self, this.target);
                return;
            }
        }

        // Standard behavior
        this.#scanForEnemies(self, allMobs);

        if (this.target) {
            this.#attack(self, this.target, game);
        } else {
            this.#roam(self.conf);
        }
    }

    #scanForFood(self, foodItems) {
        let closestFood = null;
        let closestDistance = Infinity;

        foodItems.forEach(food => {
            const distance = self.mesh.position.distanceTo(food.mesh.position);
            if (distance < self.stats.perception && distance < closestDistance) {
                closestDistance = distance;
                closestFood = food;
            }
        });

        return closestFood;
    }

    #scanForEnemies(self, allMobs) {
        let bestScore = Infinity;
        let potentialTarget = null;

        allMobs.forEach(mob => {
            if (mob.conf.immat !== self.conf.immat && mob.stats.hp.current > 0 && self.conf.mesh.color !== mob.conf.mesh.color) {
                const distance = self.mesh.position.distanceTo(mob.mesh.position);
                if (distance < self.stats.perception) {
                    const score = distance * mob.stats.hp.current; // Prioritize close and weak enemies
                    if (score < bestScore) {
                        bestScore = score;
                        potentialTarget = mob;
                    }
                }
            }
        });

        this.target = potentialTarget;
    }

    #attack(self, target, game) {
        const distance = self.mesh.position.distanceTo(target.mesh.position);
        const direction = new THREE.Vector3().subVectors(target.mesh.position, self.mesh.position).normalize();

        // Mobs will always face their target when attacking
        self.conf.theta.cur = Math.atan2(direction.y, direction.x);

        if (distance < 2) { // Melee range
            if (self.conf.ia.changeAction.cur === 0) {
                this.#takeDamage(target, self.stats.strength);
            }
        } else if (distance < 10) { // Shooting range
            if (self.conf.ia.changeAction.cur === 0) {
                const startPosition = self.mesh.position.clone().add(direction.clone().multiplyScalar(1.5));
                game.spawnProjectile(startPosition, direction, self);
            }
        }
        else { // Chase
            self.conf.position.x += direction.x * self.conf.speed;
            self.conf.position.y += direction.y * self.conf.speed;
        }

        self.conf.ia.changeAction.cur = (self.conf.ia.changeAction.cur + 1) % self.conf.ia.changeAction.max;
    }

    #flee(self, from) {
        const direction = new THREE.Vector3().subVectors(self.mesh.position, from.mesh.position).normalize();
        self.conf.position.x += direction.x * self.conf.speed;
        self.conf.position.y += direction.y * self.conf.speed;
        self.conf.theta.cur = Math.atan2(direction.y, direction.x);
    }

    #takeDamage(mob, amount) {
        mob.stats.hp.current -= amount;
        if (mob.stats.hp.current <= 0) {
            // is dead
        }
    }

    #roam(conf) {
        if (conf.ia.changeAction.cur === 0) {
            let randDir = this.Formula.rand(0, 4);
            if (randDir === 4) {
                this.#chooseDir(conf);
            }
        } else {
            this.#keepMoving(conf);
        }
        conf.ia.changeAction.cur = (conf.ia.changeAction.cur + 1) % conf.ia.changeAction.max;
    }

    #chooseDir(conf) {
        let dir = this.Formula.rand(0, 1) > 0.5 ? 1 : -1;
        conf.theta.cur += Math.floor(dir * conf.ia.dirAmplitude);
    }

    #keepMoving(conf) {
        let nextpos = this.Formula.get_NextThreePos(
            conf.position.x,
            conf.position.y,
            conf.theta.cur,
            conf.speed
        );
        conf.position.y = nextpos.y;
        conf.position.x = nextpos.x;
    }
}