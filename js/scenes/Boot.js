import { registerSprites, makeRect, makeSky, makeGround } from '../sprites.js';
import { WORLDS } from '../data.js';

export class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }

  create() {
    registerSprites(this);

    // Per-world sky + ground textures
    WORLDS.forEach(w => {
      makeSky(this, `sky_${w.id}`, 480, 220, w.skyTop, w.skyBot);
      makeGround(this, `ground_${w.id}`, 32, 24, w.soil, w.grass, w.accent);
    });

    // Generic UI rects
    makeRect(this, 'panel_dark', 1, 1, 'rgba(20,12,28,0.92)');
    makeRect(this, 'panel_helga', 1, 1, '#2a1a36');
    makeRect(this, 'btn', 1, 1, '#3a2a4a');
    makeRect(this, 'btn_hover', 1, 1, '#5a3a6a');
    makeRect(this, 'gold', 1, 1, '#ffd86b');

    this.scene.start('Menu');
  }
}
