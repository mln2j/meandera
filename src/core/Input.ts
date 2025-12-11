export class Input {
    private keysDown = new Set<string>();

    constructor() {
        window.addEventListener('keydown', (e) => {
            const key = e.key;
            this.keysDown.add(key.toLowerCase());
        });

        window.addEventListener('keyup', (e) => {
            const key = e.key;
            this.keysDown.delete(key.toLowerCase());
        });
    }

    isDown(key: string): boolean {
        return this.keysDown.has(key.toLowerCase());
    }
}
