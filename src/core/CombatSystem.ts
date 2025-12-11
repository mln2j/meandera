import type { GameScene } from './GameScene';
import type { PlayerController } from './PlayerController';
import type { EconomyManager } from '../economy/EconomyManager';
import type { HeatManager } from '../economy/HeatManager';
import type { World } from '../world/World';
import type { WeaponType } from '../weapons/types';
import { getWeaponDefinition } from '../weapons/factory';
import type { Mesh, MeshStandardMaterial } from 'three';
import type { Input } from './Input';

export class CombatSystem {
    private currentWeaponType: WeaponType = 'unarmed';
    private weaponMesh: Mesh | null = null;

    private isFiring = false;
    private fireCooldown = 0;
    private fireCooldownDuration = 0.2;

    private isMeleeAttacking = false;
    private meleeTimer = 0;
    private meleeDuration = 0.2;
    private meleeCooldown = 0.3;
    private meleeCooldownTimer = 0;

    constructor(
        private scene: GameScene,
        private playerController: PlayerController,
        private world: World,
        private economy: EconomyManager,
        private heat: HeatManager
    ) {}

    init(): void {
        if (this.scene.handMesh) {
            this.playerController.attachHand(this.scene.handMesh);
        }
        // this.equipWeapon('bat'); // za početak bez oružja
        window.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;
            if (this.currentWeaponType === 'pistol') this.tryFire();
            else this.tryMelee(); // uključuje 'unarmed', 'knife', 'bat'
        });
    }


    update(dt: number, input: Input): void {
        // cooldowni
        if (this.fireCooldown > 0) {
            this.fireCooldown = Math.max(0, this.fireCooldown - dt);
        }

        if (this.meleeCooldownTimer > 0) {
            this.meleeCooldownTimer = Math.max(0, this.meleeCooldownTimer - dt);
        }

        // melee animacija
        if (this.isMeleeAttacking) {
            this.meleeTimer += dt;
            this.updateMeleeAnimation(this.meleeTimer / this.meleeDuration);

            if (this.meleeTimer >= this.meleeDuration) {
                this.isMeleeAttacking = false;
                this.endMeleeAnimation();
            }
        }

        // promjena oružja
        if (input.isDown('0')) this.equipWeapon('unarmed');
        if (input.isDown('1')) this.equipWeapon('knife');
        if (input.isDown('2')) this.equipWeapon('pistol');
        if (input.isDown('3')) this.equipWeapon('bat');
    }

    private equipWeapon(type: WeaponType): void {
        const hand = this.scene.handMesh;
        if (!hand) return;

        if (this.weaponMesh) {
            hand.remove(this.weaponMesh);
            this.weaponMesh = null;
        }

        this.currentWeaponType = type;

        if (type === 'unarmed') {
            return;
        }

        const def = getWeaponDefinition(type);
        const mesh = def.createMesh();

        hand.add(mesh);
        this.weaponMesh = mesh;

    }


    private tryFire(): void {
        if (this.fireCooldown > 0) return;
        if (this.currentWeaponType !== 'pistol') return;

        this.fireCooldown = this.fireCooldownDuration;
        this.isFiring = true;
        this.applyRecoil();
        this.shootRay();
    }

    private tryMelee(): void {
        if (this.currentWeaponType === 'pistol') return; // ostalo, uključujući 'unarmed', je melee
        if (this.isMeleeAttacking) return;
        if (this.meleeCooldownTimer > 0) return;

        this.isMeleeAttacking = true;
        this.meleeTimer = 0;
        this.meleeCooldownTimer = this.meleeCooldown;

        this.doMeleeHit();
    }

    private updateMeleeAnimation(t: number): void {
        const hand = this.scene.handMesh;
        if (!hand) return;

        const swing = Math.sin(Math.min(t, 1) * Math.PI);
        const offsetZ = -0.45 + swing * 0.15;
        const offsetY = -0.2 + swing * 0.05;
        const rotX = -0.7 + swing * 0.5;

        hand.position.z = offsetZ;
        hand.position.y = offsetY;
        hand.rotation.x = rotX;
    }

    private endMeleeAnimation(): void {
        const hand = this.scene.handMesh;
        if (!hand) return;

        hand.position.set(0.12, -0.18, -0.45);
        hand.rotation.x = -0.7;
        hand.rotation.y = -0.2;
    }

    private doMeleeHit(): void {
        this.playerController.controls.getDirection(this.scene.rayDirection);
        this.scene.rayDirection.normalize();

        this.scene.raycaster.set(this.scene.camera.position, this.scene.rayDirection);

        const maxDistance = this.currentWeaponType === 'bat' ? 2.5 : 1.5;
        const intersects = this.scene.raycaster.intersectObjects(this.scene.scene.children, true);

        const hit = intersects.find((i) => i.distance <= maxDistance);
        if (!hit) return;


        const mesh = hit.object as Mesh;
        const mat = mesh.material as MeshStandardMaterial;
        if (mat && 'color' in mat) {
            mat.color.setHex(0xff0000);
        }
    }

    private applyRecoil(): void {
        const hand = this.scene.handMesh;
        if (!hand) return;

        const recoilStrength = 0.05;
        hand.position.z += recoilStrength;
        hand.position.y += recoilStrength * 0.4;
    }

    private shootRay(): void {
        this.playerController.controls.getDirection(this.scene.rayDirection);
        this.scene.rayDirection.normalize();

        this.scene.raycaster.set(this.scene.camera.position, this.scene.rayDirection);
        const intersects = this.scene.raycaster.intersectObjects(this.scene.scene.children, true);

        if (intersects.length === 0) return;

        const hit = intersects[0];

        const hitMesh = hit.object as Mesh;
        const mat = hitMesh.material as MeshStandardMaterial;
        if (mat && 'color' in mat) {
            mat.color.setHex(0xff0000);
        }
    }
}
