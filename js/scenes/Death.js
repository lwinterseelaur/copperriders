import * as Save from '../save.js';
import { sfx } from '../audio.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../config.js';
import { DEATH_QUOTES, STRINGS, pickRandom } from '../data.js';

export class DeathScene extends Phaser.Scene {
  constructor() { super('Death'); }

  init(data) {
    this.cause = data.cause || 'generic';
    this.distance = data.distance || 0;
    this.coinsEarned = data.coinsEarned || 0;
    this.world = data.world || '';
  }

  create() {
    this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'panel_dark').setDisplaySize(GAME_WIDTH, GAME_HEIGHT);

    // Aurubis blue header bar
    this.add.rectangle(GAME_WIDTH / 2, 38, GAME_WIDTH, 60, 0x0076A7, 1);
    this.add.text(GAME_WIDTH / 2, 38, STRINGS.judgeComment, {
      fontFamily: 'Courier New, monospace', fontSize: '20px', color: '#ffffff', letterSpacing: 3, fontStyle: 'bold',
    }).setOrigin(0.5);

    const dh = this.add.image(GAME_WIDTH / 2, 130, 'horse_standalone').setScale(4).setAngle(-30);
    this.tweens.add({ targets: dh, angle: 30, duration: 1400, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    const quoteList = DEATH_QUOTES[this.cause] || DEATH_QUOTES.generic;
    const quote = pickRandom(quoteList);

    const quoteText = this.add.text(GAME_WIDTH / 2, 260, '', {
      fontFamily: 'Courier New, monospace', fontSize: '24px', color: '#f0e7d8',
      wordWrap: { width: 760 }, align: 'center', fontStyle: 'italic',
    }).setOrigin(0.5);

    let i = 0;
    const full = `„${quote}"`;
    this.time.addEvent({
      delay: 30,
      repeat: full.length - 1,
      callback: () => quoteText.setText(full.slice(0, ++i)),
    });

    this.add.text(GAME_WIDTH / 2, 350, `${STRINGS.distance}  ${this.distance}m`, {
      fontFamily: 'Courier New, monospace', fontSize: '22px', color: '#ffffff',
    }).setOrigin(0.5);
    this.add.text(GAME_WIDTH / 2, 380, `${STRINGS.coinsEarned}  ★ ${this.coinsEarned}`, {
      fontFamily: 'Courier New, monospace', fontSize: '22px', color: '#ffd86b',
    }).setOrigin(0.5);
    this.add.text(GAME_WIDTH / 2, 408, `${STRINGS.world}  ${this.world}`, {
      fontFamily: 'Courier New, monospace', fontSize: '18px', color: '#3aa0d2', fontStyle: 'italic',
    }).setOrigin(0.5);

    const total = Save.get('coins');
    this.add.text(GAME_WIDTH / 2, 434, `${STRINGS.total}: ★ ${total} ${STRINGS.coins.toLowerCase()}`, {
      fontFamily: 'Courier New, monospace', fontSize: '16px', color: '#a89d8a',
    }).setOrigin(0.5);

    this.makeButton(GAME_WIDTH / 2 - 200, 484, 180, 42, STRINGS.again, () => {
      sfx.click();
      this.scene.start('Game');
    });
    this.makeButton(GAME_WIDTH / 2 + 20, 484, 240, 42, STRINGS.tackRoomShort, () => {
      sfx.click();
      this.scene.start('Shop');
    });

    this.input.keyboard.on('keydown-SPACE', () => { sfx.click(); this.scene.start('Game'); });
    this.input.keyboard.on('keydown-S', () => { sfx.click(); this.scene.start('Shop'); });
    this.input.keyboard.on('keydown-M', () => { sfx.click(); this.scene.start('Menu'); });
  }

  makeButton(x, y, w, h, label, onClick) {
    const bg = this.add.image(x, y, 'btn').setOrigin(0, 0.5).setDisplaySize(w, h).setInteractive({ useHandCursor: true });
    this.add.text(x + w / 2, y, label, {
      fontFamily: 'Courier New, monospace', fontSize: '18px', color: '#ffffff', fontStyle: 'bold',
    }).setOrigin(0.5);
    bg.on('pointerover', () => bg.setTexture('btn_hover'));
    bg.on('pointerout', () => bg.setTexture('btn'));
    bg.on('pointerdown', onClick);
  }
}
