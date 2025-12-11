import { Scene, BoxGeometry, MeshStandardMaterial, Mesh } from 'three';
import { BaseBuilding, type BuildingContext } from './buildings/BaseBuilding';
import { SmallBlock } from './buildings/SmallBlock';
import { TowerBlock } from './buildings/TowerBlock';

export class CityBuilder {
    private buildingTypes: BaseBuilding[] = [
        new SmallBlock(),
        new TowerBlock(),
        // new IndustrialBlock(), ...
    ];

    constructor(
        private scene: Scene,
        private blocksPerAxis = 6,
        private blockSize = 10,
        private streetSize = 4,
    ) {}

    build(): void {
        const { blocksPerAxis, blockSize, streetSize } = this;
        const citySize = blocksPerAxis * (blockSize + streetSize);

        // pod
        const floorGeo = new BoxGeometry(citySize, 0.1, citySize);
        const floorMat = new MeshStandardMaterial({ color: 0x202428 });
        const floor = new Mesh(floorGeo, floorMat);
        floor.position.y = -0.55;
        this.scene.add(floor);

        // priprema grid-a
        const grid: BuildingContext[] = [];
        for (let gx = 0; gx < blocksPerAxis; gx++) {
            for (let gz = 0; gz < blocksPerAxis; gz++) {
                const worldX = (gx - blocksPerAxis / 2) * (blockSize + streetSize);
                const worldZ = (gz - blocksPerAxis / 2) * (blockSize + streetSize);
                grid.push({ gridX: gx, gridZ: gz, worldX, worldZ });
            }
        }

        // grupiraj pozicije po tipu zgrade
        const perType = new Map<BaseBuilding, BuildingContext[]>();
        for (const ctx of grid) {
            const type = this.pickBuildingType(ctx);
            if (!perType.has(type)) perType.set(type, []);
            perType.get(type)!.push(ctx);
        }

        // za svaki tip kreiraj InstancedMesh i popuni ga
        for (const [type, positions] of perType.entries()) {
            const mesh = type.createInstancedMesh(positions.length);
            type.populateInstances(mesh, positions);
            this.scene.add(mesh);
        }
    }

    private pickBuildingType(ctx: BuildingContext): BaseBuilding {
        // vrlo jednostavan rule: rubovi = tower, sredina = small
        const isEdge =
            ctx.gridX === 0 ||
            ctx.gridZ === 0 ||
            ctx.gridX === this.blocksPerAxis - 1 ||
            ctx.gridZ === this.blocksPerAxis - 1;

        if (isEdge) return this.buildingTypes[1]; // TowerBlock
        return this.buildingTypes[0];             // SmallBlock
    }
}
