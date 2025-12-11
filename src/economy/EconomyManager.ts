import { Territory } from '../world/Territory';
import { Location } from '../world/Location';

export class EconomyManager {
    money = 0;
    incomePerSecond = 0;

    setIncomeFromTerritoriesAndLocations(
        territories: Territory[],
        locations: Location[]
    ): void {
        // primjer: prihod iz svih lokacija koje su u player teritorijima i u njegovom vlasništvu
        const playerTerritoryIds = territories
            .filter(t => t.owner === 'player')
            .map(t => t.id);

        const totalIncome = locations
            .filter(
                loc =>
                    playerTerritoryIds.includes(loc.territoryId) &&
                    loc.owner === 'player'
            )
            .reduce((sum, loc) => sum + loc.baseIncomePerSecond, 0);

        this.incomePerSecond = totalIncome;
    }

    update(dt: number): void {
        this.money += this.incomePerSecond * dt;
    }
}
