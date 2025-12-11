import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    Color,
    AmbientLight,
    DirectionalLight,
    Raycaster,
    Vector3,
    BoxGeometry,
    MeshStandardMaterial,
    Mesh,
} from 'three';
import type { World } from '../world/World';
import type { PlayerController } from './PlayerController';
import { CityBuilder } from './CityBuilder';
import { LocationMarkers } from './LocationMarkers';
import { Minimap } from './Minimap';

export class GameScene {
    public readonly scene: Scene;
    public readonly camera: PerspectiveCamera;
    public readonly renderer: WebGLRenderer;
    public readonly raycaster = new Raycaster();
    public readonly rayDirection = new Vector3();

    public handMesh: Mesh | null = null;
    public testCube: Mesh | null = null;

    private minimap: Minimap;

    constructor(private canvas: HTMLCanvasElement, private world: World) {
        this.scene = new Scene();
        this.scene.background = new Color(0x202030);

        const width = window.innerWidth;
        const height = window.innerHeight;

        this.camera = new PerspectiveCamera(60, width / height, 0.1, 1000);
        this.camera.position.set(0, 1.6, 3);
        this.scene.add(this.camera);

        this.renderer = new WebGLRenderer({
            canvas: this.canvas,
            antialias: window.devicePixelRatio <= 1,
            powerPreference: 'high-performance',
        });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        this.renderer.autoClear = false;

        this.addLights();
        new CityBuilder(this.scene).build();
        new LocationMarkers(this.scene, this.world).addMarkers();

        this.createHand();
        this.setupResize();

        this.minimap = new Minimap(this.renderer);
    }

    attachPlayerController(pc: PlayerController) {
        this.minimap.attachPlayer(pc);
    }

    private addLights(): void {
        const ambient = new AmbientLight(0xffffff, 0.4);
        this.scene.add(ambient);

        const dirLight = new DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(5, 10, 5);
        this.scene.add(dirLight);
    }

    private createHand(): void {
        const armGeo = new BoxGeometry(0.12, 0.22, 0.10);
        const armMat = new MeshStandardMaterial({ color: 0xffc9a4 });
        const arm = new Mesh(armGeo, armMat);

        arm.rotation.x = -0.7;
        arm.rotation.y = -0.2;
        arm.position.set(0.12, -0.18, -0.45);

        this.camera.add(arm);
        this.handMesh = arm;
    }

    private setupResize(): void {
        window.addEventListener('resize', () => {
            const width = window.innerWidth;
            const height = window.innerHeight;

            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();

            this.renderer.setSize(width, height);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

            this.minimap.onResize(this.renderer);
        });
    }

    rotateDebugCube(dt: number): void {
        if (!this.testCube) return;
        this.testCube.rotation.y += dt * 0.6;
        this.testCube.rotation.x += dt * 0.3;
    }

    render(): void {
        const w = window.innerWidth;
        const h = window.innerHeight;

        this.renderer.setViewport(0, 0, w, h);
        this.renderer.setScissorTest(false);
        this.renderer.clear();
        this.renderer.render(this.scene, this.camera);

        this.minimap.render(this.renderer, this.scene);
    }
}
