import * as Save from '../save.js';
import { sfx } from '../audio.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../config.js';
import { STRINGS } from '../data.js';

export class MenuScene extends Phaser.Scene {
  constructor() { super('Menu'); }

  create() {
    Save.load();

    this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 16, 'sky_1').setDisplaySize(GAME_WIDTH, GAME_HEIGHT);
    this.add.tileSprite(0, GAME_HEIGHT - 24, GAME_WIDTH, 24, 'ground_1').setOrigin(0);

    [80, 220, 360, 500].forEach((x, i) => {
      const cloud = this.add.image(x, 50 + i * 22, 'cloud').setScale(2.5).setTint(0xc0a090).setAlpha(0.7);
      this.tweens.add({ targets: cloud, x: cloud.x + 30, duration: 6000 + i * 1500, yoyo: true, repeat: -1 });
    });

    // Background industrial silhouettes
    [120, 280, 460].forEach(x => {
      this.add.image(x, GAME_HEIGHT - 24, 'smokestack').setOrigin(0.5, 1).setScale(1.3).setTint(0x6a5a5a).setAlpha(0.85);
    });
    [200, 420].forEach(x => {
      this.add.image(x, GAME_HEIGHT - 24, 'refinery_tower').setOrigin(0.5, 1).setScale(1.2).setTint(0x8a7a72);
    });

    const title = this.add.text(GAME_WIDTH / 2, 80, STRINGS.title, {
      fontFamily: 'Courier New, monospace',
      fontSize: '52px',
      color: '#ffd86b',
      stroke: '#3a1a1a',
      strokeThickness: 8,
      fontStyle: 'bold',
    }).setOrigin(0.5);
    this.tweens.add({ targets: title, y: 76, duration: 1200, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    this.add.text(GAME_WIDTH / 2, 124, STRINGS.subtitle, {
      fontFamily: 'Courier New, monospace',
      fontSize: '14px',
      color: '#f4b888',
      fontStyle: 'italic',
    }).setOrigin(0.5);

    const decor = this.add.image(GAME_WIDTH / 2, 198, 'horse_standalone').setScale(4);
    this.tweens.add({ targets: decor, angle: -8, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    const coins = Save.get('coins');
    const best = Save.get('bestDistance');
    this.add.text(12, 10, `${coins}  ${STRINGS.coins}`, { fontFamily: 'Courier New, monospace', fontSize: '14px', color: '#ffd86b' });
    this.add.text(GAME_WIDTH - 12, 10, `${STRINGS.best}  ${best}m`, { fontFamily: 'Courier New, monospace', fontSize: '14px', color: '#f0e7d8' }).setOrigin(1, 0);

    this.makeButton(GAME_WIDTH / 2, 270, 220, 36, STRINGS.gallop, () => {
      sfx.click();
      this.scene.start('Game');
    });
    this.makeButton(GAME_WIDTH / 2, 312, 220, 28, STRINGS.tackRoom, () => {
      sfx.click();
      this.scene.start('Shop', { fromMenu: true });
    });

    this.input.keyboard.on('keydown-SPACE', () => { sfx.click(); this.scene.start('Game'); });
    this.input.keyboard.on('keydown-S', () => { sfx.click(); this.scene.start('Shop', { fromMenu: true }); });
  }

  makeButton(x, y, w, h, label, onClick) {
    const bg = this.add.image(x, y, 'btn').setDisplaySize(w, h).setInteractive({ useHandCursor: true });
    const txt = this.add.text(x, y, label, {
      fontFamily: 'Courier New, monospace',
      fontSize: '15px',
      color: '#ffd86b',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    bg.on('pointerover', () => bg.setTexture('btn_hover'));
    bg.on('pointerout', () => bg.setTexture('btn'));
    bg.on('pointerdown', onClick);
    return { bg, txt };
  }
}
