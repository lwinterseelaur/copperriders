import * as Save from '../save.js';
import { sfx } from '../audio.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../config.js';
import { DEATH_QUOTES, STRINGS, pickRandom, HORSES } from '../data.js';
import { submitScore } from '../api.js';

const MIN_SCORE_TO_SUBMIT = 50;

export class DeathScene extends Phaser.Scene {
  constructor() { super('Death'); }

  init(data) {
    this.cause = data.cause || 'generic';
    this.distance = data.distance || 0;
    this.coinsEarned = data.coinsEarned || 0;
    this.world = data.world || '';
    this.submitted = false;
  }

  create() {
    this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'panel_dark').setDisplaySize(GAME_WIDTH, GAME_HEIGHT);

    this.add.rectangle(GAME_WIDTH / 2, 38, GAME_WIDTH, 60, 0x0076A7, 1);
    this.add.text(GAME_WIDTH / 2, 38, STRINGS.judgeComment, {
      fontFamily: 'Courier New, monospace', fontSize: '20px', color: '#ffffff', letterSpacing: 3, fontStyle: 'bold',
    }).setOrigin(0.5);

    const dh = this.add.image(GAME_WIDTH / 2, 110, 'horse_standalone').setScale(3.2).setAngle(-30);
    this.tweens.add({ targets: dh, angle: 30, duration: 1400, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    const quoteList = DEATH_QUOTES[this.cause] || DEATH_QUOTES.generic;
    const quote = pickRandom(quoteList);

    const quoteText = this.add.text(GAME_WIDTH / 2, 200, '', {
      fontFamily: 'Courier New, monospace', fontSize: '21px', color: '#f0e7d8',
      wordWrap: { width: 760 }, align: 'center', fontStyle: 'italic',
    }).setOrigin(0.5);

    let i = 0;
    const full = `„${quote}"`;
    this.time.addEvent({
      delay: 30,
      repeat: full.length - 1,
      callback: () => quoteText.setText(full.slice(0, ++i)),
    });

    this.add.text(GAME_WIDTH / 2, 270, `${STRINGS.distance}  ${this.distance}m`, {
      fontFamily: 'Courier New, monospace', fontSize: '22px', color: '#ffffff',
    }).setOrigin(0.5);
    this.add.text(GAME_WIDTH / 2, 298, `${STRINGS.coinsEarned}  ★ ${this.coinsEarned}`, {
      fontFamily: 'Courier New, monospace', fontSize: '20px', color: '#ffd86b',
    }).setOrigin(0.5);
    this.add.text(GAME_WIDTH / 2, 322, `${STRINGS.world}  ${this.world}`, {
      fontFamily: 'Courier New, monospace', fontSize: '15px', color: '#3aa0d2', fontStyle: 'italic',
    }).setOrigin(0.5);

    const total = Save.get('coins');
    this.add.text(GAME_WIDTH / 2, 344, `${STRINGS.total}: ★ ${total} ${STRINGS.coins.toLowerCase()}`, {
      fontFamily: 'Courier New, monospace', fontSize: '14px', color: '#a89d8a',
    }).setOrigin(0.5);

    // === Leaderboard submission section (only above threshold) ===
    if (this.distance >= MIN_SCORE_TO_SUBMIT) {
      this.makeNameEntry();
    } else {
      this.add.text(GAME_WIDTH / 2, 400, '— zu kurz für die Bestenliste —', {
        fontFamily: 'Courier New, monospace', fontSize: '14px', color: '#7a7a8a', fontStyle: 'italic',
      }).setOrigin(0.5);
    }

    this.makeButton(GAME_WIDTH / 2 - 200, GAME_HEIGHT - 36, 180, 42, STRINGS.again, () => {
      sfx.click();
      this.scene.start('Game');
    });
    this.makeButton(GAME_WIDTH / 2 + 20, GAME_HEIGHT - 36, 240, 42, STRINGS.tackRoomShort, () => {
      sfx.click();
      this.scene.start('Shop');
    });

    this.input.keyboard.on('keydown-SPACE', () => {
      // Only restart on SPACE if the name input isn't focused
      if (document.activeElement && document.activeElement.tagName === 'INPUT') return;
      sfx.click(); this.scene.start('Game');
    });
    this.input.keyboard.on('keydown-S', () => {
      if (document.activeElement && document.activeElement.tagName === 'INPUT') return;
      sfx.click(); this.scene.start('Shop');
    });
    this.input.keyboard.on('keydown-M', () => {
      if (document.activeElement && document.activeElement.tagName === 'INPUT') return;
      sfx.click(); this.scene.start('Menu');
    });
  }

  makeNameEntry() {
    const y = 400;
    this.add.text(GAME_WIDTH / 2, y - 28, 'Name für die Bestenliste:', {
      fontFamily: 'Courier New, monospace', fontSize: '15px', color: '#f0e7d8',
    }).setOrigin(0.5);

    const savedName = Save.get('playerName') || '';

    // HTML input element overlaid via Phaser's DOM Element support
    const input = document.createElement('input');
    input.type = 'text';
    input.maxLength = 16;
    input.value = savedName;
    input.placeholder = 'DEIN NAME';
    input.spellcheck = false;
    input.autocomplete = 'off';
    Object.assign(input.style, {
      width: '220px',
      height: '36px',
      padding: '0 12px',
      fontSize: '18px',
      fontFamily: 'Courier New, monospace',
      fontWeight: 'bold',
      color: '#ffd86b',
      background: '#0a1c2c',
      border: '2px solid #0076A7',
      borderRadius: '0',
      textAlign: 'center',
      letterSpacing: '2px',
      outline: 'none',
      boxSizing: 'border-box',
    });
    input.addEventListener('focus', () => { input.style.borderColor = '#3aa0d2'; });
    input.addEventListener('blur',  () => { input.style.borderColor = '#0076A7'; });

    this.nameInput = this.add.dom(GAME_WIDTH / 2 - 70, y + 4, input).setOrigin(0.5);

    // Submit button
    const submitBtn = this.add.image(GAME_WIDTH / 2 + 110, y + 4, 'btn')
      .setDisplaySize(140, 36).setInteractive({ useHandCursor: true });
    const submitTxt = this.add.text(GAME_WIDTH / 2 + 110, y + 4, 'EINTRAGEN', {
      fontFamily: 'Courier New, monospace', fontSize: '15px', color: '#ffffff', fontStyle: 'bold',
    }).setOrigin(0.5);
    submitBtn.on('pointerover', () => submitBtn.setTexture('btn_hover'));
    submitBtn.on('pointerout', () => submitBtn.setTexture('btn'));
    submitBtn.on('pointerdown', () => this.handleSubmit(input, submitBtn, submitTxt));

    // Submit on Enter inside the input
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); this.handleSubmit(input, submitBtn, submitTxt); }
    });

    this.statusText = this.add.text(GAME_WIDTH / 2, y + 36, '', {
      fontFamily: 'Courier New, monospace', fontSize: '13px', color: '#9ad07a', fontStyle: 'italic',
    }).setOrigin(0.5);

    // Auto-focus the input after a brief delay (avoid stealing focus during scene transition)
    this.time.delayedCall(150, () => { try { input.focus(); input.select(); } catch (e) {} });
  }

  async handleSubmit(input, btn, txt) {
    if (this.submitted) return;
    const name = (input.value || '').trim().slice(0, 16) || 'ANON';
    Save.set('playerName', name);
    this.submitted = true;
    btn.disableInteractive();
    txt.setText('SENDE...');
    txt.setColor('#a89d8a');

    const horseId = Save.get('selectedHorse') || 'starter';
    const result = await submitScore({
      name,
      distance: this.distance,
      stars: this.coinsEarned,
      world: this.world,
      horseId,
    });

    if (result && result.ok) {
      txt.setText('OK!');
      txt.setColor('#9ad07a');
      this.statusText.setText('Eingetragen — siehe Hauptmenü.');
    } else {
      txt.setText('FEHLER');
      txt.setColor('#ff8080');
      this.statusText.setText('Konnte nicht eintragen. Lokal gespeichert.');
      this.submitted = false;
      btn.setInteractive({ useHandCursor: true });
      this.time.delayedCall(2000, () => txt.setText('NOCHMAL'));
    }
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
