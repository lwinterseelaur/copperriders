import { GAME_WIDTH, GAME_HEIGHT } from './config.js';
import { BootScene } from './scenes/Boot.js';
import { MenuScene } from './scenes/Menu.js';
import { GameScene } from './scenes/Game.js';
import { DeathScene } from './scenes/Death.js';
import { ShopScene } from './scenes/Shop.js';

const config = {
  type: Phaser.AUTO,
  parent: 'game',
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  pixelArt: true,
  backgroundColor: '#1a1322',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  // DOM container so we can drop an HTML <input> on the death screen
  // for the leaderboard name entry.
  dom: {
    createContainer: true,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 1100 },
      debug: false,
    },
  },
  scene: [BootScene, MenuScene, GameScene, DeathScene, ShopScene],
};

window.__game = new Phaser.Game(config);
