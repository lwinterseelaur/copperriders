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

    this.add.text(GAME_WIDTH / 2, 32, STRINGS.judgeComment, {
      fontFamily: 'Courier New, monospace', fontSize: '14px', color: '#ffd86b', letterSpacing: 2,
    }).setOrigin(0.5);

    const dh = this.add.image(GAME_WIDTH / 2, 78, 'horse_standalone').setScale(2.6).setAngle(-30);
    this.tweens.add({ targets: dh, angle: 30, duration: 1400, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    const quoteList = DEATH_QUOTES[this.cause] || DEATH_QUOTES.generic;
    const quote = pickRandom(quoteList);

    const quoteText = this.add.text(GAME_WIDTH / 2, 154, '', {
      fontFamily: 'Courier New, monospace', fontSize: '17px', color: '#f0e7d8',
      wordWrap: { width: 500 }, align: 'center', fontStyle: 'italic',
    }).setOrigin(0.5);

    let i = 0;
    const full = `„${quote}"`;
    this.time.addEvent({
      delay: 30,
      repeat: full.length - 1,
      callback: () => {
        quoteText.setText(full.slice(0, ++i));
      },
    });

    this.add.text(GAME_WIDTH / 2, 218, `${STRINGS.distance}  ${this.distance}m`, {
      fontFamily: 'Courier New, monospace', fontSize: '15px', color: '#ffffff',
    }).setOrigin(0.5);
    this.add.text(GAME_WIDTH / 2, 240, `${STRINGS.coinsEarned}  ${this.coinsEarned}`, {
      fontFamily: 'Courier New, monospace', fontSize: '15px', color: '#ffd86b',
    }).setOrigin(0.5);
    this.add.text(GAME_WIDTH / 2, 262, `${STRINGS.world}  ${this.world}`, {
      fontFamily: 'Courier New, monospace', fontSize: '13px', color: '#f0e7d8', fontStyle: 'italic',
    }).setOrigin(0.5);

    const total = Save.get('coins');
    this.add.text(GAME_WIDTH / 2, 284, `${STRINGS.total}: ${total} ${STRINGS.coins.toLowerCase()}`, {
      fontFamily: 'Courier New, monospace', fontSize: '12px', color: '#a89d8a',
    }).setOrigin(0.5);

    this.makeButton(GAME_WIDTH / 2 - 130, 326, 120, 28, STRINGS.again, () => {
      sfx.click();
      this.scene.start('Game');
    });
    this.makeButton(GAME_WIDTH / 2 + 10, 326, 160, 28, STRINGS.tackRoomShort, () => {
      sfx.click();
      this.scene.start('Shop');
    });

    this.input.keyboard.on('keydown-SPACE', () => { sfx.click(); this.scene.start('Game'); });
    this.input.keyboard.on('keydown-S', () => { sfx.click(); this.scene.start('Shop'); });
    this.input.keyboard.on('keydown-M', () => { sfx.click(); this.scene.start('Menu'); });
  }

  makeButton(x, y, w, h, label, onClick) {
    const bg = this.add.image(x, y, 'btn').setOrigin(0, 0.5).setDisplaySize(w, h).setInteractive({ useHandCursor: true });
    const txt = this.add.text(x + w / 2, y, label, {
      fontFamily: 'Courier New, monospace', fontSize: '14px', color: '#ffd86b', fontStyle: 'bold',
    }).setOrigin(0.5);
    bg.on('pointerover', () => bg.setTexture('btn_hover'));
    bg.on('pointerout', () => bg.setTexture('btn'));
    bg.on('pointerdown', onClick);
  }
}
