import * as Save from '../save.js';
import { sfx } from '../audio.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../config.js';
import { UPGRADES, HORSES, HELGA_GREETINGS, HELGA_FAREWELLS, HELGA_PURCHASE, STRINGS, pickRandom } from '../data.js';

const ROW_H = 30;

export class ShopScene extends Phaser.Scene {
  constructor() { super('Shop'); }

  init(data) {
    this.fromMenu = !!(data && data.fromMenu);
  }

  create() {
    this.tab = 'upgrades';
    this.scrollOffset = 0;

    this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'panel_helga').setDisplaySize(GAME_WIDTH, GAME_HEIGHT);

    this.add.text(GAME_WIDTH / 2, 16, STRINGS.tackRoom, {
      fontFamily: 'Courier New, monospace', fontSize: '18px', color: '#ffd86b', fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.image(70, 124, 'helga').setScale(1.8);

    this.helgaText = this.add.text(150, 70, `„${pickRandom(HELGA_GREETINGS)}"`, {
      fontFamily: 'Courier New, monospace', fontSize: '13px', color: '#f0e7d8',
      wordWrap: { width: 460 }, fontStyle: 'italic',
    });

    this.coinDisplay = this.add.text(GAME_WIDTH - 12, 18, `${Save.get('coins')} ${STRINGS.coins}`, {
      fontFamily: 'Courier New, monospace', fontSize: '15px', color: '#ffd86b', fontStyle: 'bold',
    }).setOrigin(1, 0.5);

    this.tabUpgrades = this.makeTab(12, 150, 130, 24, STRINGS.upgrades, () => this.switchTab('upgrades'));
    this.tabHorses = this.makeTab(150, 150, 110, 24, STRINGS.horses, () => this.switchTab('horses'));

    this.add.rectangle(GAME_WIDTH / 2, 248, GAME_WIDTH - 24, 168, 0x1a0f24, 1).setStrokeStyle(1, 0x3a2a44);

    this.makeButton(GAME_WIDTH / 2 - 130, GAME_HEIGHT - 22, 110, 28, STRINGS.back, () => {
      sfx.click();
      const farewell = pickRandom(HELGA_FAREWELLS);
      this.helgaText.setText(`„${farewell}"`);
      this.time.delayedCall(400, () => this.scene.start('Menu'));
    });
    this.makeButton(GAME_WIDTH / 2 + 20, GAME_HEIGHT - 22, 130, 28, STRINGS.gallop, () => {
      sfx.click();
      this.scene.start('Game');
    });

    this.input.keyboard.on('keydown-ESC', () => { sfx.click(); this.scene.start('Menu'); });
    this.input.keyboard.on('keydown-TAB', () => this.switchTab(this.tab === 'upgrades' ? 'horses' : 'upgrades'));
    this.input.keyboard.on('keydown-SPACE', () => { sfx.click(); this.scene.start('Game'); });

    this.input.on('wheel', (_, __, ___, dy) => {
      this.scrollOffset = Math.max(0, Math.min(this.maxScroll || 0, this.scrollOffset + dy * 0.5));
      this.renderList();
    });

    this.itemContainer = this.add.container(0, 0);
    this.renderList();
  }

  switchTab(tab) {
    if (this.tab === tab) return;
    sfx.click();
    this.tab = tab;
    this.scrollOffset = 0;
    this.tabUpgrades.bg.setTexture(tab === 'upgrades' ? 'btn_hover' : 'btn');
    this.tabHorses.bg.setTexture(tab === 'horses' ? 'btn_hover' : 'btn');
    this.renderList();
  }

  renderList() {
    this.itemContainer.removeAll(true);

    const items = this.tab === 'upgrades' ? UPGRADES : HORSES;
    const startY = 184;
    const visible = 5;

    this.maxScroll = Math.max(0, (items.length - visible) * ROW_H);
    const scrollIdx = Math.floor(this.scrollOffset / ROW_H);

    for (let i = 0; i < visible && i + scrollIdx < items.length; i++) {
      const item = items[i + scrollIdx];
      const y = startY + i * ROW_H;
      this.renderRow(item, y);
    }

    if (this.maxScroll > 0) {
      const indicator = this.add.text(GAME_WIDTH - 16, 184, '⇅', { fontFamily: 'Courier New, monospace', fontSize: '14px', color: '#a89d8a' });
      this.itemContainer.add(indicator);
    }
  }

  renderRow(item, y) {
    const isHorse = this.tab === 'horses';
    const owned = isHorse ? Save.ownsHorse(item.id) : Save.ownsUpgrade(item.id);
    const selected = isHorse && Save.get('selectedHorse') === item.id;
    const haggler = Save.ownsUpgrade('haggler');
    const cost = haggler ? Math.floor(item.cost * 0.9) : item.cost;
    const canAfford = Save.get('coins') >= cost;

    const rowBg = this.add.rectangle(GAME_WIDTH / 2, y, GAME_WIDTH - 32, ROW_H - 2, selected ? 0x3a4a2a : 0x2a1f34, 1)
      .setStrokeStyle(1, owned ? 0x4a8a4a : 0x3a2a44)
      .setInteractive({ useHandCursor: !owned || isHorse });

    rowBg.on('pointerdown', () => this.handleClick(item, owned, selected, cost));
    rowBg.on('pointerover', () => rowBg.setFillStyle(selected ? 0x4a5a3a : 0x3a2f44));
    rowBg.on('pointerout', () => rowBg.setFillStyle(selected ? 0x3a4a2a : 0x2a1f34));

    const name = this.add.text(28, y - 10, item.name, {
      fontFamily: 'Courier New, monospace', fontSize: '13px',
      color: owned ? '#9ad07a' : '#ffd86b', fontStyle: 'bold',
    });

    const desc = this.add.text(28, y + 4, item.desc, {
      fontFamily: 'Courier New, monospace', fontSize: '10px',
      color: '#a89d8a', fontStyle: 'italic',
    });

    let rightLabel;
    if (owned && isHorse) {
      rightLabel = selected ? STRINGS.selected : STRINGS.select;
    } else if (owned) {
      rightLabel = STRINGS.owned;
    } else {
      rightLabel = `${cost}`;
    }
    const right = this.add.text(GAME_WIDTH - 30, y, rightLabel, {
      fontFamily: 'Courier New, monospace', fontSize: '13px',
      color: owned ? (selected ? '#9ad07a' : '#ffd86b') : (canAfford ? '#ffd86b' : '#8a4a4a'),
      fontStyle: 'bold',
    }).setOrigin(1, 0.5);

    if (isHorse) {
      const statsLine = `S${item.speed.toFixed(1)} J${item.jump.toFixed(1)} St${item.style.toFixed(1)} D${item.durability} L${item.luck.toFixed(1)}`;
      const stats = this.add.text(GAME_WIDTH - 30, y + 8, statsLine, {
        fontFamily: 'Courier New, monospace', fontSize: '9px', color: '#7a8a9a',
      }).setOrigin(1, 0.5);
      this.itemContainer.add(stats);
    }

    this.itemContainer.add([rowBg, name, desc, right]);
  }

  handleClick(item, owned, selected, cost) {
    const isHorse = this.tab === 'horses';

    if (isHorse && owned) {
      if (!selected) {
        Save.selectHorse(item.id);
        sfx.click();
        this.helgaText.setText(`„${STRINGS.selectComment(item.name)}"`);
        this.renderList();
      }
      return;
    }

    if (owned) {
      sfx.click();
      this.helgaText.setText(`„${STRINGS.alreadyOwn}"`);
      return;
    }

    if (!Save.spendCoins(cost)) {
      sfx.reject();
      this.helgaText.setText(`„${pickRandom(HELGA_PURCHASE.broke)}"`);
      return;
    }

    sfx.buy();
    if (isHorse) Save.buyHorse(item.id);
    else Save.buyUpgrade(item.id);

    const flavor = item.cost <= 200 ? pickRandom(HELGA_PURCHASE.cheap) : pickRandom(HELGA_PURCHASE.premium);
    this.helgaText.setText(`„${flavor}"`);

    this.coinDisplay.setText(`${Save.get('coins')} ${STRINGS.coins}`);
    this.renderList();
  }

  makeTab(x, y, w, h, label, onClick) {
    const bg = this.add.image(x, y, this.tab === label.toLowerCase() ? 'btn_hover' : 'btn').setOrigin(0, 0.5).setDisplaySize(w, h).setInteractive({ useHandCursor: true });
    this.add.text(x + w / 2, y, label, {
      fontFamily: 'Courier New, monospace', fontSize: '13px', color: '#ffd86b', fontStyle: 'bold',
    }).setOrigin(0.5);
    bg.on('pointerdown', onClick);
    bg.on('pointerover', () => bg.setTexture('btn_hover'));
    bg.on('pointerout', () => {
      const isUpg = label === STRINGS.upgrades && this.tab === 'upgrades';
      const isHor = label === STRINGS.horses && this.tab === 'horses';
      bg.setTexture((isUpg || isHor) ? 'btn_hover' : 'btn');
    });
    return { bg };
  }

  makeButton(x, y, w, h, label, onClick) {
    const bg = this.add.image(x, y, 'btn').setOrigin(0, 0.5).setDisplaySize(w, h).setInteractive({ useHandCursor: true });
    this.add.text(x + w / 2, y, label, {
      fontFamily: 'Courier New, monospace', fontSize: '13px', color: '#ffd86b', fontStyle: 'bold',
    }).setOrigin(0.5);
    bg.on('pointerover', () => bg.setTexture('btn_hover'));
    bg.on('pointerout', () => bg.setTexture('btn'));
    bg.on('pointerdown', onClick);
  }
}
