import {PointerLockControls} from 'three/examples/jsm/controls/PointerLockControls.js';
import type {PerspectiveCamera, Mesh} from 'three';
import {Input} from './Input';

export class PlayerController {
    public readonly controls: PointerLockControls;
    public handMesh: Mesh | null = null;

    private handSwayTime = 0;
    private moveSpeed = 5;
    private velocityY = 0;
    private isOnGround = true;
    private gravity = 20;      // m/s^2
    private jumpSpeed = 7;     // početna brzina skoka


    constructor(
        private camera: PerspectiveCamera,
        private input: Input,
        canvas: HTMLCanvasElement
    ) {
        this.controls = new PointerLockControls(this.camera, document.body);
        this.controls.pointerSpeed = 0.6;

        canvas.addEventListener('click', () => {
            if (!document.pointerLockElement) {
                this.controls.lock();
            }
        });
    }

    attachHand(hand: Mesh | null) {
        this.handMesh = hand;
    }

    update(dt: number): void {
        const move = this.moveSpeed * dt;
        if (this.input.isDown('w')) this.controls.moveForward(move);
        if (this.input.isDown('s')) this.controls.moveForward(-move);
        if (this.input.isDown('a')) this.controls.moveRight(-move);
        if (this.input.isDown('d')) this.controls.moveRight(move);

// JUMP input
        if (this.input.isDown(' ')) { // ili provjeri na keyCode 'Space'
            this.tryJump();
        }

// primijeni gravitaciju
        this.velocityY -= this.gravity * dt;
        this.camera.position.y += this.velocityY * dt;

// jednostavan ground check na y = 1.6
        const groundY = 1.6;
        if (this.camera.position.y <= groundY) {
            this.camera.position.y = groundY;
            this.velocityY = 0;
            this.isOnGround = true;
        }


        this.updateHandSway(dt);
        this.controls.update();
    }

    private tryJump(): void {
        if (!this.isOnGround) return;
        this.isOnGround = false;
        this.velocityY = this.jumpSpeed;
    }


    private updateHandSway(dt: number): void {
        if (!this.handMesh) return;

        const isMoving =
            this.input.isDown('w') ||
            this.input.isDown('a') ||
            this.input.isDown('s') ||
            this.input.isDown('d');

        if (isMoving) {
            this.handSwayTime += dt * 8;
            const swayX = Math.sin(this.handSwayTime) * 0.01;
            const swayY = Math.cos(this.handSwayTime * 2) * 0.01;

            this.handMesh.position.set(0.25 + swayX, -0.2 + swayY, -0.45);
        } else {
            this.handMesh.position.x += (0.25 - this.handMesh.position.x) * 10 * dt;
            this.handMesh.position.y += (-0.2 - this.handMesh.position.y) * 10 * dt;
            this.handMesh.position.z += (-0.45 - this.handMesh.position.z) * 10 * dt;
            this.handSwayTime = 0;
        }
    }

    get position() {
        return this.camera.position;
    }
}
