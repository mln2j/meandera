import { World } from '../world/World';
import { EconomyManager } from '../economy/EconomyManager';
import { Player } from '../entities/Player';

type SaveState = {
    playerSpawn: { x: number; y: number; z: number };
    money: number;
    locations: { id: string; owner: string }[];
};

const SAVE_KEY = 'meandera-save';

export function saveGame(world: World, economy: EconomyManager, player: Player): void {
    const state: SaveState = {
        playerSpawn: { x: player.spawnX, y: player.spawnY, z: player.spawnZ },
        money: economy.money,
        locations: world.locations.map((l) => ({ id: l.id, owner: l.owner })),
    };

    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

export function loadGame(world: World, economy: EconomyManager, player: Player): void {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return;

    const state = JSON.parse(raw) as SaveState;

    player.setSpawn(state.playerSpawn.x, state.playerSpawn.y, state.playerSpawn.z);
    player.respawn();

    economy.money = state.money;

    world.locations.forEach((l) => {
        const saved = state.locations.find((s) => s.id === l.id);
        if (saved) {
            l.owner = saved.owner as any;
        }
    });
}
