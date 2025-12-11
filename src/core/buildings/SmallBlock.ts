import { BoxGeometry, MeshStandardMaterial, InstancedMesh, Matrix4 } from 'three';
import { BaseBuilding, type BuildingContext } from './BaseBuilding';

export class SmallBlock extends BaseBuilding {
    readonly name = 'SmallBlock';

    createInstancedMesh(count: number): InstancedMesh {
        const geo = new BoxGeometry(4, 1, 4);
        const mat = new MeshStandardMaterial({ color: 0x4466aa });
        return new InstancedMesh(geo, mat, count);
    }

    populateInstances(mesh: InstancedMesh, positions: BuildingContext[]): void {
        const m = new Matrix4();

        positions.forEach((p, i) => {
            const height = 2 + Math.random() * 4;
            m.identity();
            m.makeScale(1, height, 1);
            m.setPosition(p.worldX, height, p.worldZ);
            mesh.setMatrixAt(i, m);
        });

        mesh.instanceMatrix.needsUpdate = true;
    }
}
