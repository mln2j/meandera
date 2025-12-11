export class HeatManager {
    value = 0;          // 0–100
    decayPerSecond = 2; // koliko se spušta po sekundi

    constructor(initial = 0) {
        this.value = initial;
    }

    add(amount: number): void {
        this.value = Math.min(100, this.value + amount);
    }

    update(dt: number): void {
        if (this.value <= 0) return;
        this.value = Math.max(0, this.value - this.decayPerSecond * dt);
    }

    getLevel(): number {
        if (this.value >= 75) return 3;
        if (this.value >= 40) return 2;
        if (this.value > 0) return 1;
        return 0;
    }
}
