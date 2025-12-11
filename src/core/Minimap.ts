import { OrthographicCamera, WebGLRenderer, Scene, Vector3 } from 'three';
import type { PlayerController } from './PlayerController';

export class Minimap {
    public readonly camera: OrthographicCamera;

    private readonly size = 60;
    private width = 260;
    private height = 260;
    private player: PlayerController | null = null;

    constructor(renderer: WebGLRenderer) {
        const width = renderer.domElement.clientWidth;
        const height = renderer.domElement.clientHeight;
        const aspect = width / height;
        const s = this.size;

        this.camera = new OrthographicCamera(
            -s * aspect,
            s * aspect,
            s,
            -s,
            0.1,
            200
        );
        this.camera.up.set(0, 0, -1);
        this.camera.position.set(0, 60, 0);
        this.camera.lookAt(0, 0, 0);

        this.width = Math.min(360, Math.floor(width * 0.35));
        this.height = this.width;
    }

    attachPlayer(pc: PlayerController) {
        this.player = pc;
    }

    onResize(renderer: WebGLRenderer) {
        const width = renderer.domElement.clientWidth;
        const height = renderer.domElement.clientHeight;
        const aspect = width / height;
        const s = this.size;

        this.camera.left = -s * aspect;
        this.camera.right = s * aspect;
        this.camera.top = s;
        this.camera.bottom = -s;
        this.camera.updateProjectionMatrix();

        this.width = Math.min(360, Math.floor(width * 0.35));
        this.height = this.width;
    }

    private updateCamera() {
        if (!this.player) return;
        const pos = this.player.position as Vector3;
        this.camera.position.set(pos.x, pos.y + 80, pos.z);
        this.camera.lookAt(pos.x, pos.y, pos.z);
    }

    render(renderer: WebGLRenderer, scene: Scene) {
        const w = renderer.domElement.clientWidth;
        const h = renderer.domElement.clientHeight;

        this.updateCamera();

        const vw = this.width;
        const vh = this.height;
        const vx = 16;
        const vy = 16;

        renderer.clearDepth();
        renderer.setScissorTest(true);
        renderer.setViewport(vx, vy, vw, vh);
        renderer.setScissor(vx, vy, vw, vh);
        renderer.render(scene, this.camera);
        renderer.setScissorTest(false);
    }
}
