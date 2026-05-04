import * as Save from '../save.js';
import { sfx } from '../audio.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../config.js';
import { DEATH_QUOTES, STRINGS, pickRandom } from '../data.js';
import { submitScore } from '../api.js';

const MIN_SCORE_TO_SUBMIT = 50;
const MAX_NAME_LEN = 16;
const ALLOWED_NAME_RE = /^[A-Za-z0-9 äöüÄÖÜßéèêàçñ\-_.]$/;

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

    if (this.distance >= MIN_SCORE_TO_SUBMIT) {
      this.makeNameEntry();
    } else {
      this.add.text(GAME_WIDTH / 2, 408, '— zu kurz für die Bestenliste —', {
        fontFamily: 'Courier New, monospace', fontSize: '14px', color: '#7a7a8a', fontStyle: 'italic',
      }).setOrigin(0.5);
    }

    // Three buttons centered on the bottom row: again | menu | shop
    const btnY = GAME_HEIGHT - 36;
    this.makeButton(GAME_WIDTH / 2 - 290, btnY, 170, 42, STRINGS.again, () => {
      sfx.click();
      this.cleanupKeyHandler();
      this.scene.start('Game');
    });
    this.makeButton(GAME_WIDTH / 2 - 90, btnY, 180, 42, STRINGS.menu, () => {
      sfx.click();
      this.cleanupKeyHandler();
      this.scene.start('Menu');
    });
    this.makeButton(GAME_WIDTH / 2 + 120, btnY, 200, 42, STRINGS.tackRoomShort, () => {
      sfx.click();
      this.cleanupKeyHandler();
      this.scene.start('Shop');
    });
  }

  cleanupKeyHandler() {
    if (this.keyHandler) {
      this.input.keyboard.off('keydown', this.keyHandler);
      this.keyHandler = null;
    }
  }

  // === Phaser-native single-line text input ===
  makeNameEntry() {
    const cx = GAME_WIDTH / 2;
    const y = 408;

    this.add.text(cx, y - 30, 'Name für die Bestenliste:', {
      fontFamily: 'Courier New, monospace', fontSize: '15px', color: '#f0e7d8',
    }).setOrigin(0.5);

    // Layout
    const inputW = 260, inputH = 38, btnW = 160, gap = 10;
    const totalW = inputW + gap + btnW;
    const inputX = cx - totalW / 2 + inputW / 2;
    const btnX = cx + totalW / 2 - btnW / 2;

    // Input box visuals
    this.inputBg = this.add.rectangle(inputX, y, inputW, inputH, 0x0a1c2c, 1)
      .setStrokeStyle(2, 0x0076A7).setOrigin(0.5)
      .setInteractive({ useHandCursor: true });
    this.inputBg.on('pointerdown', () => this.focusInput(true));

    this.inputName = (Save.get('playerName') || '').slice(0, MAX_NAME_LEN);
    this.inputFocused = true;

    const textOpts = {
      fontFamily: 'Courier New, monospace', fontSize: '20px',
      color: '#ffd86b', fontStyle: 'bold',
    };
    this.inputText = this.add.text(inputX - inputW / 2 + 10, y, this.inputName, textOpts).setOrigin(0, 0.5);
    this.inputCursor = this.add.text(inputX - inputW / 2 + 10, y, '_', textOpts).setOrigin(0, 0.5);
    this.repositionCursor();

    // Blink the cursor
    this.cursorTween = this.tweens.add({
      targets: this.inputCursor, alpha: { from: 1, to: 0 },
      duration: 500, yoyo: true, repeat: -1,
    });

    // Placeholder when empty + unfocused (we keep it focused initially anyway)
    if (!this.inputName) {
      this.placeholderText = this.add.text(inputX, y, 'DEIN NAME', {
        fontFamily: 'Courier New, monospace', fontSize: '17px', color: '#5a6a7a', fontStyle: 'italic',
      }).setOrigin(0.5);
    }

    // Submit button
    const btnBg = this.add.image(btnX, y, 'btn').setDisplaySize(btnW, inputH).setInteractive({ useHandCursor: true });
    const btnTxt = this.add.text(btnX, y, 'EINTRAGEN', {
      fontFamily: 'Courier New, monospace', fontSize: '15px', color: '#ffffff', fontStyle: 'bold',
    }).setOrigin(0.5);
    btnBg.on('pointerover', () => btnBg.setTexture('btn_hover'));
    btnBg.on('pointerout', () => btnBg.setTexture('btn'));
    btnBg.on('pointerdown', () => this.handleSubmit(btnBg, btnTxt));
    this.submitBtn = btnBg;
    this.submitBtnTxt = btnTxt;

    this.statusText = this.add.text(cx, y + 30, 'tippe deinen Namen, Enter zum Eintragen', {
      fontFamily: 'Courier New, monospace', fontSize: '12px', color: '#7a8a9a', fontStyle: 'italic',
    }).setOrigin(0.5);

    // Listen for keystrokes scene-wide
    this.keyHandler = (event) => this.onKey(event);
    this.input.keyboard.on('keydown', this.keyHandler);
  }

  focusInput(on) {
    this.inputFocused = !!on;
    if (this.inputBg) this.inputBg.setStrokeStyle(2, on ? 0x3aa0d2 : 0x0076A7);
  }

  repositionCursor() {
    if (!this.inputCursor || !this.inputText) return;
    const left = this.inputText.x;
    this.inputCursor.x = left + this.inputText.width;
  }

  onKey(event) {
    if (!this.inputFocused || this.submitted) return;
    const k = event.key;
    if (k === 'Enter') {
      event.preventDefault();
      this.handleSubmit(this.submitBtn, this.submitBtnTxt);
      return;
    }
    if (k === 'Escape') {
      this.focusInput(false);
      return;
    }
    if (k === 'Backspace') {
      event.preventDefault();
      if (this.inputName.length > 0) {
        this.inputName = this.inputName.slice(0, -1);
        this.inputText.setText(this.inputName);
        this.repositionCursor();
        if (this.placeholderText && !this.inputName) this.placeholderText.setVisible(true);
      }
      return;
    }
    if (k && k.length === 1 && ALLOWED_NAME_RE.test(k)) {
      if (this.inputName.length < MAX_NAME_LEN) {
        this.inputName += k;
        this.inputText.setText(this.inputName);
        this.repositionCursor();
        if (this.placeholderText) this.placeholderText.setVisible(false);
      }
    }
  }

  async handleSubmit(btn, txt) {
    if (this.submitted) return;
    const name = (this.inputName || '').trim().slice(0, MAX_NAME_LEN) || 'ANON';
    Save.set('playerName', name);
    this.submitted = true;
    if (btn) btn.disableInteractive();
    if (txt) { txt.setText('SENDE...'); txt.setColor('#a89d8a'); }
    if (this.statusText) this.statusText.setText('');

    const horseId = Save.get('selectedHorse') || 'starter';
    const result = await submitScore({
      name, distance: this.distance, stars: this.coinsEarned,
      world: this.world, horseId,
    });

    if (result && result.ok) {
      if (txt) { txt.setText('OK!'); txt.setColor('#9ad07a'); }
      if (this.statusText) {
        this.statusText.setColor('#9ad07a');
        this.statusText.setText('Eingetragen — siehe Bestenliste im Hauptmenü.');
      }
    } else {
      if (txt) { txt.setText('FEHLER'); txt.setColor('#ff8080'); }
      if (this.statusText) {
        this.statusText.setColor('#ff8080');
        this.statusText.setText('Konnte nicht senden — versuch\'s nochmal.');
      }
      this.submitted = false;
      if (btn) btn.setInteractive({ useHandCursor: true });
      this.time.delayedCall(2000, () => { if (txt) txt.setText('NOCHMAL'); });
    }
  }

  shutdown() {
    if (this.keyHandler) this.input.keyboard.off('keydown', this.keyHandler);
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
