import type { Mesh } from 'three';

export type WeaponType = 'knife' | 'pistol' | 'bat';

export interface WeaponDefinition {
    id: WeaponType;
    name: string;
    damage: number;
    range: number;
    // kasnije: fireRate, ammo, swingSpeed...
    createMesh(): Mesh;
}
