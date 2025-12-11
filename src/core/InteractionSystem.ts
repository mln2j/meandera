import type { World } from '../world/World';
import type { Player } from '../entities/Player';
import type { Input } from './Input';

export interface InteractionResult {
    nearbyLocationId: string | null;
    prompt: string | null;
}

export class InteractionSystem {
    private currentInteractLocationId: string | null = null;
    private readonly interactRange = 2.0;

    constructor(private world: World) {}

    update(player: Player, input: Input): InteractionResult {
        this.currentInteractLocationId = null;

        const nearby = this.world.locations.find((loc) => {
            const dist = loc.getDistanceTo(player.x, player.z);
            return dist <= this.interactRange;
        });

        let prompt: string | null = null;

        if (nearby) {
            this.currentInteractLocationId = nearby.id;
            prompt = `Press E to interact with ${nearby.name}`;
        }

        if (this.currentInteractLocationId && input.isDown('e')) {
            this.handleInteraction(this.currentInteractLocationId);
        }

        return {
            nearbyLocationId: this.currentInteractLocationId,
            prompt,
        };
    }

    private handleInteraction(locationId: string): void {
        const loc = this.world.locations.find((l) => l.id === locationId);
        if (!loc) return;

        if (loc.type === 'safehouse') {
            this.world.player.setSpawn(loc.worldX, 1.6, loc.worldZ); // ili proslijedi player izvana
            return;
        }

        if (loc.type === 'shop') {
            // ovdje možeš proslijediti economy/heat ili ih injektati u konstruktor
            // ostavi placeholder ako već imaš implementaciju drugdje
        }
    }
}
