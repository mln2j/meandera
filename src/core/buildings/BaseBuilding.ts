// core/buildings/BaseBuilding.ts
import { InstancedMesh } from 'three';

export interface BuildingContext {
    gridX: number;
    gridZ: number;
    worldX: number;
    worldZ: number;
}

export abstract class BaseBuilding {
    abstract readonly name: string;

    abstract createInstancedMesh(count: number): InstancedMesh;

    abstract populateInstances(
        mesh: InstancedMesh,
        positions: BuildingContext[]
    ): void;
}
