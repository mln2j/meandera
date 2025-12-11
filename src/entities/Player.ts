export class Player {
    x = 0;
    y = 0;
    z = 0;

    spawnX = 0;
    spawnY = 1.6;
    spawnZ = 3;

    constructor(x = 0, y = 1.6, z = 3) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.spawnX = x;
        this.spawnY = y;
        this.spawnZ = z;
    }

    setSpawn(x: number, y: number, z: number): void {
        this.spawnX = x;
        this.spawnY = y;
        this.spawnZ = z;
    }

    respawn(): void {
        this.x = this.spawnX;
        this.y = this.spawnY;
        this.z = this.spawnZ;
    }
}
