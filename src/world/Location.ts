export type LocationType = 'safehouse' | 'shop' | 'fastFood' | 'warehouse';

export class Location {
    readonly id: string;
    readonly name: string;
    readonly type: LocationType;
    readonly territoryId: string;
    readonly worldX: number;
    readonly worldZ: number;

    baseIncomePerSecond: number;
    owner: 'player' | 'gangA' | 'gangB' | 'neutral';

    // robbery state
    currentStash: number;
    maxStash: number;
    robberyCooldown: number;
    robberyCooldownDuration: number;
    robberyPayoutFactor: number;

    constructor(options: {
        id: string;
        name: string;
        type: LocationType;
        territoryId: string;
        worldX: number;
        worldZ: number;
        baseIncomePerSecond: number;
        owner?: 'player' | 'gangA' | 'gangB' | 'neutral';

        maxStash?: number;
        robberyCooldownDuration?: number;
        robberyPayoutFactor?: number;
    }) {
        this.id = options.id;
        this.name = options.name;
        this.type = options.type;
        this.territoryId = options.territoryId;
        this.worldX = options.worldX;
        this.worldZ = options.worldZ;
        this.baseIncomePerSecond = options.baseIncomePerSecond;
        this.owner = options.owner ?? 'neutral';

        this.maxStash = options.maxStash ?? 100;
        this.currentStash = this.maxStash;
        this.robberyCooldownDuration = options.robberyCooldownDuration ?? 60;
        this.robberyCooldown = 0;
        this.robberyPayoutFactor = options.robberyPayoutFactor ?? 0.5;
    }

    update(dt: number): void {
        if (this.robberyCooldown > 0) {
            this.robberyCooldown = Math.max(0, this.robberyCooldown - dt);
        } else {
            if (this.type === 'shop' && this.currentStash < this.maxStash) {
                this.currentStash = Math.min(
                    this.maxStash,
                    this.currentStash + this.baseIncomePerSecond * dt
                );
            }
        }
    }

    getDistanceTo(x: number, z: number): number {
        const dx = this.worldX - x;
        const dz = this.worldZ - z;
        return Math.hypot(dx, dz);
    }

    canBeRobbed(): boolean {
        return this.type === 'shop' && this.currentStash > 0 && this.robberyCooldown === 0;
    }
}
