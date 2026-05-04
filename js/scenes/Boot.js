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

    // Generic UI rects (Aurubis-blue accented)
    makeRect(this, 'panel_dark', 1, 1, 'rgba(8,18,30,0.94)');
    makeRect(this, 'panel_helga', 1, 1, '#0a1c2c');
    makeRect(this, 'btn', 1, 1, '#0076A7');
    makeRect(this, 'btn_hover', 1, 1, '#3aa0d2');
    makeRect(this, 'gold', 1, 1, '#ffd86b');
    makeRect(this, 'aurubis_blue', 1, 1, '#0076A7');

    this.scene.start('Menu');
  }
}
