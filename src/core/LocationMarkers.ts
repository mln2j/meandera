import { Scene, BoxGeometry, MeshStandardMaterial, Mesh } from 'three';
import type { World } from '../world/World';

export class LocationMarkers {
    constructor(private scene: Scene, private world: World) {}

    addMarkers(): void {
        const geo = new BoxGeometry(0.5, 0.5, 0.5);

        for (const loc of this.world.locations) {
            const color =
                loc.type === 'safehouse' ? 0x00ff88 :
                    loc.type === 'shop' ? 0x00aaff :
                        0xff00ff;

            const mat = new MeshStandardMaterial({ color });
            const mesh = new Mesh(geo, mat);
            mesh.position.set(loc.worldX, 0.25, loc.worldZ);
            this.scene.add(mesh);

            (loc as any).markerMesh = mesh;
        }
    }
}
