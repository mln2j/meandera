import { GameScene } from './GameScene';
import { PlayerController } from './PlayerController';
import { UIManager } from './UIManager';
import { CombatSystem } from './CombatSystem';
import { World } from '../world/World';
import { EconomyManager } from '../economy/EconomyManager';
import { Player } from '../entities/Player';
import { Input } from './Input';
import { HeatManager } from '../economy/HeatManager';
import { saveGame, loadGame } from './SaveSystem';

export class Game {
    private scene: GameScene;
    private playerController: PlayerController;
    private ui: UIManager;
    private combat: CombatSystem;

    private world: World;
    private economy: EconomyManager;
    private player: Player;
    private heat: HeatManager;
    private input: Input;

    private lastTime = performance.now();

    constructor(canvas: HTMLCanvasElement) {
        this.input = new Input();
        this.world = new World();
        this.economy = new EconomyManager();
        this.player = new Player(0, 1.6, 3);
        this.heat = new HeatManager(0);

        this.scene = new GameScene(canvas, this.world);
        this.playerController = new PlayerController(this.scene.camera, this.input, canvas);
        this.ui = new UIManager();
        this.combat = new CombatSystem(this.scene, this.playerController, this.world, this.economy, this.heat);
        this.combat.init();

        this.setupMetaInput();
    }

    start(): void {
        this.lastTime = performance.now();
        requestAnimationFrame(this.loop);
    }

    private loop = (now: number): void => {
        const dt = (now - this.lastTime) / 1000;
        this.lastTime = now;

        this.update(dt);
        this.scene.render();

        requestAnimationFrame(this.loop);
    };

    private update(dt: number): void {
        this.world.update(dt);
        this.playerController.update(dt);
        this.combat.update(dt, this.input);
        this.scene.rotateDebugCube(dt);

        const camPos = this.scene.camera.position;
        this.player.x = camPos.x;
        this.player.y = camPos.y;
        this.player.z = camPos.z;

        const territory = this.world.getTerritoryAt(this.player.x, this.player.z);
        if (territory) {
            territory.owner = 'player';
            this.world.locations
                .filter((l) => l.territoryId === territory.id)
                .forEach((l) => (l.owner = 'player'));

            this.economy.setIncomeFromTerritoriesAndLocations(
                this.world.territories,
                this.world.locations
            );
        }

        this.economy.update(dt);
        this.heat.update(dt);

        const interactResult = this.updateInteractions();

        this.updateHud(interactResult.nearbyLocationId, territory);
        this.ui.updateInteract(interactResult.prompt);
    }

    private updateInteractions() {
        const interactRange = 2.0;
        const nearby = this.world.locations.find((loc) => {
            const dist = loc.getDistanceTo(this.player.x, this.player.z);
            return dist <= interactRange;
        });

        let prompt: string | null = null;
        let nearbyId: string | null = null;

        if (nearby) {
            nearbyId = nearby.id;
            prompt = `Press E to interact with ${nearby.name}`;

            if (this.input.isDown('e')) {
                this.handleInteraction(nearby.id);
            }
        }

        return { nearbyLocationId: nearbyId, prompt };
    }

    private updateHud(nearbyId: string | null, territory: any): void {
        const ownedLocations = this.world.locations.filter((l) => l.owner === 'player').length;
        const territoryName = territory ? territory.name : 'No territory';

        const nearby = nearbyId
            ? this.world.locations.find((l) => l.id === nearbyId)
            : null;

        let extra = '';
        if (nearby && nearby.type === 'shop') {
            extra = ` | Shop stash: ${nearby.currentStash.toFixed(0)}$`;
            if (nearby.robberyCooldown > 0) {
                extra += ` (cooldown ${nearby.robberyCooldown.toFixed(0)}s)`;
            }
        }

        this.ui.updateHud({
            money: this.economy.money,
            territoryName,
            ownedLocations,
            shopExtra: extra,
            heatValue: this.heat.value,
            heatLevel: this.heat.getLevel(),
        });
    }

    private setupMetaInput(): void {
        window.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 'r') {
                this.player.respawn();
                this.scene.camera.position.set(this.player.x, this.player.y, this.player.z);
            }
            if (e.key === 'F5') {
                saveGame(this.world, this.economy, this.player);
            }
            if (e.key === 'F6') {
                loadGame(this.world, this.economy, this.player);
                this.scene.camera.position.set(this.player.x, this.player.y, this.player.z);
            }
        });
    }

    private handleInteraction(locationId: string): void {
        const loc = this.world.locations.find((l) => l.id === locationId);
        if (!loc) return;

        if (loc.type === 'safehouse') {
            this.player.setSpawn(loc.worldX, 1.6, loc.worldZ);
            return;
        }

        if (loc.type === 'shop') {
            if (loc.owner !== 'player') {
                loc.owner = 'player';

                this.economy.setIncomeFromTerritoriesAndLocations(
                    this.world.territories,
                    this.world.locations
                );
                return;
            }

            if (!loc.canBeRobbed()) {
                return;
            }

            const payout = loc.currentStash * loc.robberyPayoutFactor;
            loc.currentStash -= payout;
            loc.robberyCooldown = loc.robberyCooldownDuration;

            this.economy.money += payout;

            this.heat.add(15);

            return;
        }
    }
}
