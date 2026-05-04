import * as Save from '../save.js';
import { sfx } from '../audio.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../config.js';
import { STRINGS, COMPANY_TAGLINE } from '../data.js';

export class MenuScene extends Phaser.Scene {
  constructor() { super('Menu'); }

  create() {
    Save.load();

    this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 16, 'sky_1').setDisplaySize(GAME_WIDTH, GAME_HEIGHT);
    this.add.tileSprite(0, GAME_HEIGHT - 28, GAME_WIDTH, 28, 'ground_1').setOrigin(0);

    [120, 320, 540, 760].forEach((x, i) => {
      const cloud = this.add.image(x, 60 + i * 22, 'cloud').setScale(3).setTint(0xc0a090).setAlpha(0.7);
      this.tweens.add({ targets: cloud, x: cloud.x + 30, duration: 6000 + i * 1500, yoyo: true, repeat: -1 });
    });

    // Background industrial silhouettes — Hamburg style
    [180, 380, 600, 820].forEach(x => {
      this.add.image(x, GAME_HEIGHT - 28, 'smokestack').setOrigin(0.5, 1).setScale(1.6).setTint(0x6a5a5a).setAlpha(0.85);
    });
    [120, 460, 720].forEach(x => {
      this.add.image(x, GAME_HEIGHT - 28, 'refinery_tower').setOrigin(0.5, 1).setScale(1.5).setTint(0x8a7a72);
    });
    [80, 280, 540, 880].forEach(x => {
      this.add.image(x, GAME_HEIGHT - 28, 'harbor_crane').setOrigin(0.5, 1).setScale(1.6).setTint(0x6a7080).setAlpha(0.9);
    });
    // Big AURUBIS HAMBURG sign in the back
    this.add.image(GAME_WIDTH / 2 + 60, GAME_HEIGHT - 220, 'aurubis_hamburg_sign').setScale(1.6).setAlpha(0.92);

    // Aurubis blue triangle decoration top-left
    this.drawAurubisTriangle(28, 26, 28, 0x0076A7);

    // Title with Aurubis blue stroke
    const title = this.add.text(GAME_WIDTH / 2, 110, STRINGS.title, {
      fontFamily: 'Courier New, monospace',
      fontSize: '78px',
      color: '#ffd86b',
      stroke: '#005a82',
      strokeThickness: 10,
      fontStyle: 'bold',
    }).setOrigin(0.5);
    this.tweens.add({ targets: title, y: 106, duration: 1200, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    // Subtitle — Aurubis style, on a blue strap
    const subtitleText = this.add.text(GAME_WIDTH / 2, 174, STRINGS.subtitle, {
      fontFamily: 'Courier New, monospace',
      fontSize: '20px',
      color: '#ffffff',
      fontStyle: 'italic bold',
      stroke: '#0076A7',
      strokeThickness: 4,
    }).setOrigin(0.5);

    // Tagline (Aurubis official)
    this.add.text(GAME_WIDTH / 2, 204, COMPANY_TAGLINE, {
      fontFamily: 'Courier New, monospace',
      fontSize: '14px',
      color: '#0076A7',
      fontStyle: 'bold',
      letterSpacing: 4,
    }).setOrigin(0.5);

    const decor = this.add.image(GAME_WIDTH / 2, 290, 'horse_standalone').setScale(5);
    this.tweens.add({ targets: decor, angle: -8, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    const coins = Save.get('coins');
    const best = Save.get('bestDistance');
    this.add.text(72, 18, `★ ${coins}  ${STRINGS.coins}`, { fontFamily: 'Courier New, monospace', fontSize: '20px', color: '#ffd86b', fontStyle: 'bold' });
    this.add.text(GAME_WIDTH - 16, 18, `${STRINGS.best}  ${best}m`, { fontFamily: 'Courier New, monospace', fontSize: '20px', color: '#f0e7d8' }).setOrigin(1, 0);

    this.makeButton(GAME_WIDTH / 2, 410, 280, 50, STRINGS.gallop, () => {
      sfx.click();
      this.scene.start('Game');
    });
    this.makeButton(GAME_WIDTH / 2, 472, 280, 38, STRINGS.tackRoom, () => {
      sfx.click();
      this.scene.start('Shop', { fromMenu: true });
    });

    this.input.keyboard.on('keydown-SPACE', () => { sfx.click(); this.scene.start('Game'); });
    this.input.keyboard.on('keydown-S', () => { sfx.click(); this.scene.start('Shop', { fromMenu: true }); });
  }

  // Draw a small filled isoceles triangle in Aurubis blue (logo motif)
  drawAurubisTriangle(x, y, size, color) {
    const g = this.add.graphics();
    g.fillStyle(color, 1);
    g.fillTriangle(x, y + size, x + size, y + size, x + size, y);
    return g;
  }

  makeButton(x, y, w, h, label, onClick) {
    const bg = this.add.image(x, y, 'btn').setDisplaySize(w, h).setInteractive({ useHandCursor: true });
    const txt = this.add.text(x, y, label, {
      fontFamily: 'Courier New, monospace',
      fontSize: '20px',
      color: '#ffd86b',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    bg.on('pointerover', () => bg.setTexture('btn_hover'));
    bg.on('pointerout', () => bg.setTexture('btn'));
    bg.on('pointerdown', onClick);
    return { bg, txt };
  }
}
