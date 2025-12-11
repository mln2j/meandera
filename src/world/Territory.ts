export type FactionId = 'player' | 'gangA' | 'gangB' | 'neutral';

export interface TerritoryBounds {
    minX: number;
    maxX: number;
    minZ: number;
    maxZ: number;
}

export class Territory {
    readonly id: string;
    readonly name: string;
    readonly bounds: TerritoryBounds;
    owner: FactionId;

    constructor(id: string, name: string, bounds: TerritoryBounds, owner: FactionId = 'neutral') {
        this.id = id;
        this.name = name;
        this.bounds = bounds;
        this.owner = owner;
    }

    contains(x: number, z: number): boolean {
        return (
            x >= this.bounds.minX &&
            x <= this.bounds.maxX &&
            z >= this.bounds.minZ &&
            z <= this.bounds.maxZ
        );
    }
}
