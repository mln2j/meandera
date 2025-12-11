import { Territory } from './Territory';
import { Location } from './Location';

export class World {
    territories: Territory[] = [];
    locations: Location[] = [];

    constructor() {
        this.territories.push(
            new Territory('downtown', 'Downtown', {
                minX: -5,
                maxX: 5,
                minZ: -5,
                maxZ: 5,
            })
        );

        this.locations.push(
            new Location({
                id: 'safehouse_1',
                name: 'Downtown Safehouse',
                type: 'safehouse',
                territoryId: 'downtown',
                worldX: 2,
                worldZ: 2,
                baseIncomePerSecond: 0,
            }),
            new Location({
                id: 'shop_1',
                name: 'Corner Shop',
                type: 'shop',
                territoryId: 'downtown',
                worldX: -2,
                worldZ: 1,
                baseIncomePerSecond: 5,
                maxStash: 200,
                robberyCooldownDuration: 60,
                robberyPayoutFactor: 0.5,
            })
        );

    }

    update(dt: number): void {
        this.locations.forEach((loc) => loc.update(dt));
    }


    getTerritoryAt(x: number, z: number): Territory | null {
        return this.territories.find(t => t.contains(x, z)) ?? null;
    }
}
