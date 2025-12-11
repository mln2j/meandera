import { BoxGeometry, MeshStandardMaterial, InstancedMesh, Matrix4 } from 'three';
import { BaseBuilding, type BuildingContext } from './BaseBuilding';

export class TowerBlock extends BaseBuilding {
    readonly name = 'TowerBlock';

    createInstancedMesh(count: number): InstancedMesh {
        const geo = new BoxGeometry(6, 1, 6);
        const mat = new MeshStandardMaterial({ color: 0x884444 });
        return new InstancedMesh(geo, mat, count);
    }

    populateInstances(mesh: InstancedMesh, positions: BuildingContext[]): void {
        const m = new Matrix4();

        positions.forEach((p, i) => {
            const height = 6 + Math.random() * 10;
            m.identity();
            m.makeScale(1, height, 1);
            m.setPosition(p.worldX, height, p.worldZ);
            mesh.setMatrixAt(i, m);
        });

        mesh.instanceMatrix.needsUpdate = true;
    }
}
