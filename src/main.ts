import { Game } from './core/Game';

function bootstrap() {
    const canvas = document.getElementById('game-canvas') as HTMLCanvasElement | null;
    if (!canvas) {
        console.error('Canvas #game-canvas not found');
        return;
    }

    const game = new Game(canvas);
    game.start();
}

bootstrap();
