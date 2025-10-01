"use strict";
class ProjectileManager {
    constructor(scene, StatManager) {
        this.scene = scene;
        this.StatManager = StatManager;
        this.projectiles = [];
    }

    update() {
        // Loop through and update all active projectiles
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const projectile = this.projectiles[i];
            projectile.update(); // Call the projectile's own update method

            if (projectile.end) {
                // Remove projectiles that have ended
                this.projectiles.splice(i, 1);
            }
        }
    }

    create(caster, skillName) {
        // Caster can be either the player or a mob
        const casterStats = caster.stats || caster.conf;
        const casterPosition = caster.playerGroupe?.position || caster.mesh.position;
        const casterRotation = caster.playerGroupe?.rotation || caster.mesh.rotation;

        // Create a new projectile
        const projectile = new Projectile(
            skillName,
            caster,
            casterPosition,
            casterRotation,
            1, // fromfloor, can be configured later
            this.scene
        );

        // Check energy cost
        const energyCost = projectile.skillDatas.energyCost || 0;
        let energyStat;

        if (caster.type === 'player') {
            energyStat = casterStats.stamina;
        } else {
            energyStat = casterStats.energy;
        }

        if (energyStat && energyStat.current >= energyCost) {
            energyStat.current -= energyCost;

            projectile.init();
            this.projectiles.push(projectile);

            if (caster.type === 'player' && this.StatManager) {
                this.StatManager.refresh('stamina', energyStat.current);
            }
        } else {
            // console.log(`ProjectileManager: Failed to create '${skillName}' for ${caster.id || caster.conf.nickname}. Insufficient energy.`);
        }
    }
}