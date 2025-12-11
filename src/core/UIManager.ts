import type { Territory } from '../world/World'; // prilagodi tipu
import type { Location } from '../world/World';

interface HudState {
    money: number;
    territoryName: string;
    ownedLocations: number;
    shopExtra: string;
    heatValue: number;
    heatLevel: number;
}

export class UIManager {
    private hudElement: HTMLDivElement | null;
    private interactPrompt: HTMLDivElement | null;

    private lastHudText = '';
    private lastInteractText = '';
    private lastInteractVisible = false;

    constructor() {
        this.hudElement = document.getElementById('hud') as HTMLDivElement | null;
        this.interactPrompt = document.getElementById('interact') as HTMLDivElement | null;
    }

    updateHud(state: HudState): void {
        if (!this.hudElement) return;

        const newHudText =
            `Money: ${state.money.toFixed(0)} | ` +
            `Zone: ${state.territoryName} | Owned: ${state.ownedLocations}${state.shopExtra} | ` +
            `Heat: ${state.heatValue.toFixed(0)} (L${state.heatLevel})`;

        if (newHudText !== this.lastHudText) {
            this.hudElement.textContent = newHudText;
            this.lastHudText = newHudText;
        }
    }

    updateInteract(prompt: string | null): void {
        if (!this.interactPrompt) return;

        const visible = !!prompt;

        if (visible !== this.lastInteractVisible) {
            this.interactPrompt.style.opacity = visible ? '1' : '0';
            this.lastInteractVisible = visible;
        }

        if (visible && prompt !== this.lastInteractText) {
            this.interactPrompt.textContent = prompt;
            this.lastInteractText = prompt;
        }
    }
}
