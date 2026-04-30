import * as Save from '../save.js';
import { sfx } from '../audio.js';
import { GAME_WIDTH, GAME_HEIGHT } from '../config.js';
import { worldFor, HORSES, STRINGS, AURUBIS_TAGLINE } from '../data.js';

const GROUND_Y = GAME_HEIGHT - 32;
const PLAYER_X = 110;

const D = {
  sky: 0,
  smokestackFar: 1,
  smokestackNear: 2,
  unicorn: 3,
  aurubisBillboard: 3,
  signalTowers: 4,
  scrapPiles: 5,
  ground: 6,
  star: 7,
  obstacle: 8,
  enemy: 8,
  player: 9,
  particle: 10,
  warning: 11,
  hud: 100,
};

// All ground obstacles assume sprite content is flush with bottom edge of source.
// yFromGround offsets sprite-bottom above ground tile top (positive = floats above).
const OBSTACLE_TYPES = {
  copper_ingot:  { kind: 'obstacle', spriteKey: 'copper_ingot',  body: { w: 22, h: 8,  ox: 5,  oy: 1 }, yFromGround: 0,   srcW: 32, srcH: 14 },
  wire_coil:     { kind: 'obstacle', spriteKey: 'wire_coil',     body: { w: 14, h: 12, ox: 5,  oy: 1 }, yFromGround: 0,   srcW: 24, srcH: 16 },
  slag:          { kind: 'obstacle', spriteKey: 'slag',          body: { w: 16, h: 8,  ox: 4,  oy: 1 }, yFromGround: 0,   srcW: 24, srcH: 10, glow: true },
  anode_plate:   { kind: 'obstacle', spriteKey: 'anode_plate',   body: { w: 8,  h: 28, ox: 4,  oy: 4 }, yFromGround: 0,   srcW: 16, srcH: 32 },
  aurubis_crate: { kind: 'obstacle', spriteKey: 'aurubis_crate', body: { w: 22, h: 14, ox: 3,  oy: 1 }, yFromGround: 0,   srcW: 28, srcH: 18 },
  cable_spool:   { kind: 'obstacle', spriteKey: 'cable_spool',   body: { w: 18, h: 24, ox: 5,  oy: 3 }, yFromGround: 0,   srcW: 28, srcH: 28 },
  chemical_drum: { kind: 'obstacle', spriteKey: 'chemical_drum', body: { w: 12, h: 18, ox: 2,  oy: 2 }, yFromGround: 0,   srcW: 16, srcH: 22 },
  copper_sheet:  { kind: 'obstacle', spriteKey: 'copper_sheet',  body: { w: 6,  h: 32, ox: 1,  oy: 2 }, yFromGround: 0,   srcW: 8,  srcH: 36 },
  hanging_pipe:  { kind: 'overhead', spriteKey: 'hanging_pipe',  body: { w: 32, h: 8,  ox: 4,  oy: 2 }, fromTop: 60,      srcW: 41, srcH: 12 },
  arc_spark:     { kind: 'overhead', spriteKey: 'arc_spark',     body: { w: 14, h: 8,  ox: 3,  oy: 4 }, fromTop: 110,     srcW: 20, srcH: 14, blink: true },
  steam_vent:    { kind: 'overhead', spriteKey: 'steam_vent',    body: { w: 18, h: 8,  ox: 3,  oy: 1 }, fromTop: 70,      srcW: 24, srcH: 18 },
  hi_vis:        { kind: 'enemy',    spriteKey: 'hi_vis_worker', body: { w: 12, h: 18, ox: 4,  oy: 2 }, yFromGround: 0,   srcW: 20, srcH: 22 },
  forklift:      { kind: 'enemy',    spriteKey: 'forklift',      body: { w: 24, h: 14, ox: 3,  oy: 6 }, yFromGround: 0,   srcW: 32, srcH: 22 },
  drone:         { kind: 'enemy',    spriteKey: 'drone',         body: { w: 10, h: 8,  ox: 2,  oy: 2 }, yFromGround: 80,  srcW: 14, srcH: 14, hover: true },
};

export class GameScene extends Phaser.Scene {
  constructor() { super('Game'); }

  create() {
    const horseId = Save.get('selectedHorse') || 'starter';
    const horse = HORSES.find(h => h.id === horseId) || HORSES[0];
    const upgrades = Save.get('upgrades') || {};

    // === Upgrade-derived stats — every upgrade has a measurable effect ===
    this.stats = {
      // Speed: nostrils +15%, athlete card +10% (stacks)
      speed: 200 * horse.speed
        * (upgrades.nostrils ? 1.15 : 1)
        * (upgrades.athlete_card ? 1.10 : 1),
      // Jump: duct tape +5%, dressage book unlocks double jump
      jumpVel: -560 * horse.jump * (upgrades.duct_tape ? 1.08 : 1),
      // Style multiplier: yarn mane +10%, leotard +20%, breeder license +20%
      styleMult: horse.style
        * (upgrades.yarn_mane ? 1.1 : 1)
        * (upgrades.leotard ? 1.2 : 1)
        * (upgrades.breeder ? 1.2 : 1),
      // Durability: carbon stick +1
      durability: horse.durability + (upgrades.carbon_stick ? 1 : 0),
      luck: horse.luck,
      // Magnet: pockets +30 px, breeder gives extra +10 from style
      magnet: 50 + (upgrades.pockets ? 36 : 0),
      // Double jump
      doubleJump: !!upgrades.dressage_book,
      // Sisu: longer i-frames after hits
      iframes: !!upgrades.sisu,
      // NFC chip: one-time revive per run
      revive: !!upgrades.nfc_chip,
      // Bonnet: hi-vis workers do nothing
      muteHecklers: !!upgrades.bonnet,
      // Helmet: protects against arc spark + steam vent (overhead hazards)
      helmet: !!upgrades.helmet,
      // Glass eye: shows warning markers above incoming obstacles
      preview: !!upgrades.glass_eye,
      // Vaccination: one free hit per world (resets on world transition)
      vaccinationFresh: !!upgrades.vaccination,
      vaccinationActive: !!upgrades.vaccination,
      // Used boots: longer slide / faster duck recovery
      slideBoots: !!upgrades.used_boots,
      // VIP: rare power-up drop boost
      rareLuck: upgrades.vip ? 0.20 : 0.10,
      // Passport: bonus stars at world transitions
      passport: !!upgrades.passport_book,
    };

    this.distance = 0;
    this.coinsEarned = 0;
    this.styleCombo = 0;
    this.styleTimer = 0;
    this.alive = true;
    this.usedRevive = false;
    this.invulnUntil = 0;
    this.health = this.stats.durability;
    this.canDoubleJump = false;
    this.scrollSpeed = this.stats.speed;
    this.currentWorld = worldFor(0);

    // === SKY ===
    this.sky = this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 16, `sky_${this.currentWorld.id}`)
      .setDisplaySize(GAME_WIDTH, GAME_HEIGHT).setDepth(D.sky);

    // === DRIFTING SMOKE ===
    this.cloudGroup = this.add.group();
    for (let i = 0; i < 6; i++) {
      const c = this.add.image(Math.random() * GAME_WIDTH, 30 + Math.random() * 80, 'cloud')
        .setScale(2 + Math.random() * 1.2).setAlpha(0.55 + Math.random() * 0.25)
        .setTint(0xc0a090).setDepth(D.smokestackFar);
      c.setData('speed', 0.05 + Math.random() * 0.12);
      this.cloudGroup.add(c);
    }

    // === BACKGROUND PROPS ===
    this.farProps = this.add.group();
    this.midProps = this.add.group();

    for (let i = 0; i < 6; i++) {
      const x = i * (GAME_WIDTH / 3) + Math.random() * 80 - 40;
      const stack = this.add.image(x, GROUND_Y, 'smokestack')
        .setOrigin(0.5, 1).setScale(1.4 + Math.random() * 0.3)
        .setTint(0x6a5a5a).setDepth(D.smokestackFar).setAlpha(0.85);
      this.farProps.add(stack);
    }

    for (let i = 0; i < 4; i++) {
      const x = i * (GAME_WIDTH / 2) + Math.random() * 100 - 50;
      const tower = this.add.image(x, GROUND_Y, 'refinery_tower')
        .setOrigin(0.5, 1).setScale(1.3)
        .setTint(0x8a7a72).setDepth(D.smokestackNear).setAlpha(0.95);
      this.midProps.add(tower);
    }

    // === AURUBIS BILLBOARDS — recurring, scrolling at mid parallax ===
    this.billboards = this.add.group();
    this.spawnBillboard(GAME_WIDTH * 0.6, GROUND_Y - 110);
    this.nextBillboardX = GAME_WIDTH * 1.6;

    // === SIGNAL TOWER BAND ===
    this.signalBand = this.add.container(0, GROUND_Y - 30).setDepth(D.signalTowers);
    for (let x = 0; x < GAME_WIDTH * 2; x += 60 + Math.random() * 80) {
      const t = this.add.image(x, Math.random() * 8, 'signal_tower')
        .setOrigin(0.5, 1).setScale(1.5 + Math.random() * 0.4).setTint(0xa89878);
      this.signalBand.add(t);
    }

    // === SCRAP PILE BAND ===
    this.scrapBand = this.add.container(0, GROUND_Y + 4).setDepth(D.scrapPiles);
    for (let x = 0; x < GAME_WIDTH * 2; x += 80 + Math.random() * 60) {
      const s = this.add.image(x, 0, 'scrap_pile').setOrigin(0.5, 1).setScale(2);
      this.scrapBand.add(s);
    }

    // === GROUND VISUAL ===
    this.groundScroll = this.add.tileSprite(0, GROUND_Y, GAME_WIDTH, 28, `ground_${this.currentWorld.id}`)
      .setOrigin(0).setDepth(D.ground);

    // === PLAYER ===
    this.player = this.physics.add.sprite(PLAYER_X, GROUND_Y - 50, 'hero_run_1').setScale(2);
    this.player.setCollideWorldBounds(false);
    this.player.body.setSize(14, 28).setOffset(5, 4);
    this.player.setDepth(D.player);

    if (!this.anims.exists('run')) {
      this.anims.create({ key: 'run', frames: [{ key: 'hero_run_1' }, { key: 'hero_run_2' }], frameRate: 10, repeat: -1 });
    }
    this.player.play('run');

    // Invisible ground collider
    this.groundCollider = this.add.rectangle(GAME_WIDTH / 2, GROUND_Y + 16, GAME_WIDTH * 4, 32, 0x000000, 0);
    this.physics.add.existing(this.groundCollider, true);
    this.physics.add.collider(this.player, this.groundCollider);

    // === GROUPS ===
    this.obstacles = this.physics.add.group({ allowGravity: false, immovable: true });
    this.stars = this.physics.add.group({ allowGravity: false });
    this.enemies = this.physics.add.group({ allowGravity: false, immovable: true });
    this.powerups = this.physics.add.group({ allowGravity: false });

    this.physics.add.overlap(this.player, this.stars, (_, star) => this.collectStar(star));
    this.physics.add.overlap(this.player, this.obstacles, (_, ob) => this.hitBy(ob, ob.getData('cause') || 'fence'));
    this.physics.add.overlap(this.player, this.enemies, (_, en) => this.hitBy(en, en.getData('cause') || 'generic'));
    this.physics.add.overlap(this.player, this.powerups, (_, pu) => this.collectPowerup(pu));

    // === Sparkle particle group (unicorn trail + collected stars) ===
    this.sparkles = this.add.group();

    // === HUD ===
    const fontSm = { fontFamily: 'Courier New, monospace', fontSize: '16px', color: '#ffffff', stroke: '#000', strokeThickness: 4 };
    this.hud = {
      distance: this.add.text(10, 8, '0m', fontSm).setScrollFactor(0).setDepth(D.hud),
      stars: this.add.text(GAME_WIDTH - 10, 8, '★ 0', { ...fontSm, color: '#ffd86b' }).setOrigin(1, 0).setScrollFactor(0).setDepth(D.hud),
      world: this.add.text(GAME_WIDTH / 2, 8, this.currentWorld.name, { ...fontSm, fontSize: '13px', color: '#3aa0d2' }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(D.hud),
      style: this.add.text(GAME_WIDTH / 2, 30, '', { ...fontSm, fontSize: '15px', color: '#ffd86b', fontStyle: 'bold' }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(D.hud),
      health: this.add.text(10, 30, '', { ...fontSm, fontSize: '13px', color: '#ff8080' }).setScrollFactor(0).setDepth(D.hud),
      powerup: this.add.text(GAME_WIDTH - 10, 30, '', { ...fontSm, fontSize: '13px', color: '#88ffe0' }).setOrigin(1, 0).setScrollFactor(0).setDepth(D.hud),
    };
    this.updateHud();

    // === INPUT ===
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keySpace = this.input.keyboard.addKey('SPACE');
    this.keyW = this.input.keyboard.addKey('W');
    this.keyS = this.input.keyboard.addKey('S');
    this.keyEsc = this.input.keyboard.addKey('ESC');

    this.keyEsc.on('down', () => {
      if (!this.alive) return;
      this.scene.pause();
      this.showPause();
    });

    // Touch / pointer
    this.touchDuckActive = false;
    this.input.on('pointerdown', (pointer) => {
      if (!this.alive) return;
      if (pointer.y < GAME_HEIGHT * 0.6) this.tryJump();
      else this.touchDuckActive = true;
    });
    this.input.on('pointerup', () => { this.touchDuckActive = false; });
    this.input.on('pointerupoutside', () => { this.touchDuckActive = false; });

    // === SPAWNING ===
    this.worldX = 0;
    this.nextSpawnWorldX = 100;
    this.lastPattern = -1;
    this.activePowerup = null;
    this.activePowerupUntil = 0;

    // === UNICORN — random background spawn ===
    this.unicorn = null;
    this.nextUnicornAt = this.time.now + 8000 + Math.random() * 12000;
  }

  update(time, deltaMs) {
    const dt = deltaMs / 1000;

    if (!this.alive) {
      this.scrollSpeed *= 0.94;
      this.scrollBackgrounds(this.scrollSpeed * dt);
      this.scrollEntities(this.scrollSpeed * dt);
      return;
    }

    this.scrollSpeed = Math.min(this.stats.speed + this.distance * 0.06, 520);
    const turboActive = this.activePowerup === 'turbo' && time < this.activePowerupUntil;
    if (turboActive) this.scrollSpeed *= 1.6;

    this.distance += this.scrollSpeed * dt * 0.1;

    if (this.styleTimer > 0) {
      this.styleTimer -= deltaMs;
      if (this.styleTimer <= 0) {
        this.styleCombo = 0;
        this.hud.style.setText('');
      }
    }

    if (this.activePowerup && time >= this.activePowerupUntil) {
      this.activePowerup = null;
      this.hud.powerup.setText('');
    }

    const jumpPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up) ||
                        Phaser.Input.Keyboard.JustDown(this.keySpace) ||
                        Phaser.Input.Keyboard.JustDown(this.keyW);
    const duckHeld = this.cursors.down.isDown || this.keyS.isDown || this.touchDuckActive;

    const onGround = this.player.body.blocked.down || this.player.body.touching.down;
    if (onGround) this.canDoubleJump = this.stats.doubleJump;

    if (jumpPressed) this.tryJump();

    if (duckHeld && onGround) {
      this.player.setTexture('hero_duck');
      this.player.anims.stop();
      // Slide boots upgrade — slightly wider duck hitbox
      const w = this.stats.slideBoots ? 22 : 20;
      this.player.body.setSize(w, 16).setOffset(2, 16);
    } else if (onGround) {
      if (!this.player.anims.isPlaying) this.player.play('run');
      this.player.body.setSize(14, 28).setOffset(5, 4);
    } else {
      this.player.setTexture('hero_jump');
    }

    const scrollDx = this.scrollSpeed * dt;
    this.worldX += scrollDx;
    this.scrollBackgrounds(scrollDx);
    this.scrollEntities(scrollDx);
    this.updateUnicorn(time, scrollDx);

    [this.obstacles, this.enemies, this.stars, this.powerups].forEach(g => {
      g.children.iterate(o => { if (o && o.x < -120) o.destroy(); });
    });

    // World transition
    const newWorld = worldFor(this.distance);
    if (newWorld.id !== this.currentWorld.id) {
      this.currentWorld = newWorld;
      this.cameras.main.flash(400, 0x0, 0x76, 0xa7);
      this.sky.setTexture(`sky_${newWorld.id}`);
      this.groundScroll.setTexture(`ground_${newWorld.id}`);
      this.hud.world.setText(newWorld.name);
      // Vaccination resets per world
      if (this.stats.vaccinationFresh) this.stats.vaccinationActive = true;
      // Passport bonus stars
      if (this.stats.passport) {
        this.coinsEarned += 25;
        const t = this.add.text(GAME_WIDTH / 2, 60, '+25 ★ Passport-Bonus', {
          fontFamily: 'Courier New, monospace', fontSize: '14px', color: '#ffd86b',
        }).setOrigin(0.5).setScrollFactor(0).setDepth(D.hud);
        this.tweens.add({ targets: t, y: 30, alpha: 0, duration: 1200, onComplete: () => t.destroy() });
      }
      sfx.coin();
    }

    // Spawn patterns
    while (this.worldX + 100 > this.nextSpawnWorldX) {
      this.spawnPattern();
    }

    this.updateHud();

    if (this.player.y > GAME_HEIGHT + 80) this.die('generic');
  }

  // === UNICORN SPAWN + RAINBOW TRAIL ===
  updateUnicorn(time, scrollDx) {
    if (!this.unicorn && time > this.nextUnicornAt) {
      this.spawnUnicorn();
    }
    if (this.unicorn) {
      // Unicorn moves slower than world (so it appears to drift across)
      this.unicorn.x -= scrollDx * 0.6 - 30 * (1/60);
      this.unicorn.y = this.unicorn.getData('baseY') + Math.sin(time * 0.005) * 6;
      // Spawn trail sparkles
      if (time - (this.unicorn.getData('lastSparkle') || 0) > 60) {
        this.unicorn.setData('lastSparkle', time);
        this.spawnSparkle(this.unicorn.x + 14, this.unicorn.y + 4, time);
      }
      if (this.unicorn.x < -80) {
        this.unicorn.destroy();
        this.unicorn = null;
        this.nextUnicornAt = time + 12000 + Math.random() * 18000;
      }
    }
    // Update sparkles
    this.sparkles.children.iterate(s => {
      if (!s) return;
      s.x -= scrollDx * 0.5;
      const age = time - s.getData('born');
      s.alpha = Math.max(0, 1 - age / 1500);
      s.angle += 4;
      if (age > 1500) s.destroy();
    });
  }

  spawnUnicorn() {
    const baseY = 70 + Math.random() * 80;
    this.unicorn = this.add.image(GAME_WIDTH + 60, baseY, 'unicorn').setScale(1.6)
      .setDepth(D.unicorn);
    this.unicorn.setData('baseY', baseY);
    this.unicorn.setData('lastSparkle', 0);
    // Slight bob animation tween
    this.tweens.add({ targets: this.unicorn, scaleY: 1.7, duration: 400, yoyo: true, repeat: -1 });
  }

  spawnSparkle(x, y, time) {
    const colors = [0xff5a7a, 0xffaa3a, 0xffe600, 0x5acc5a, 0x3aa0e0, 0xa060e0];
    const tint = colors[Math.floor(Math.random() * colors.length)];
    const s = this.add.image(x + (Math.random() * 16 - 8), y + (Math.random() * 12 - 6), 'sparkle')
      .setScale(1.5 + Math.random() * 0.8).setTint(tint).setDepth(D.unicorn - 1);
    s.setData('born', time);
    this.sparkles.add(s);
  }

  // === BILLBOARDS ===
  spawnBillboard(x, y) {
    const bb = this.add.image(x, y, 'aurubis_billboard').setScale(1.4).setDepth(D.aurubisBillboard);
    this.billboards.add(bb);
  }

  tryJump() {
    const onGround = this.player.body.blocked.down || this.player.body.touching.down;
    if (onGround) {
      this.player.setVelocityY(this.stats.jumpVel);
      this.player.setTexture('hero_jump');
      this.player.anims.stop();
      sfx.jump();
      this.bumpStyle();
    } else if (this.canDoubleJump) {
      this.canDoubleJump = false;
      this.player.setVelocityY(this.stats.jumpVel * 0.85);
      this.player.setTexture('hero_jump');
      sfx.doubleJump();
      this.bumpStyle();
    }
  }

  scrollBackgrounds(dx) {
    this.cloudGroup.children.iterate(c => {
      if (!c) return;
      c.x -= dx * c.getData('speed');
      if (c.x < -80) c.x = GAME_WIDTH + 80;
    });
    this.farProps.children.iterate(p => {
      if (!p) return;
      p.x -= dx * 0.10;
      if (p.x < -60) p.x = GAME_WIDTH + 100;
    });
    this.midProps.children.iterate(p => {
      if (!p) return;
      p.x -= dx * 0.22;
      if (p.x < -60) p.x = GAME_WIDTH + 100;
    });
    this.billboards.children.iterate(b => {
      if (!b) return;
      b.x -= dx * 0.30;
      if (b.x < -150) {
        b.destroy();
      }
    });
    // Spawn next billboard occasionally as worldX advances
    this.nextBillboardX -= dx * 0.30;
    if (this.nextBillboardX < GAME_WIDTH) {
      this.spawnBillboard(GAME_WIDTH + 200, GROUND_Y - 110);
      this.nextBillboardX += GAME_WIDTH * 1.5 + Math.random() * 400;
    }
    this.signalBand.iterate(t => {
      if (!t) return;
      t.x -= dx * 0.45;
      if (t.x < -30) t.x += GAME_WIDTH * 2 + 30;
    });
    this.scrapBand.iterate(s => {
      if (!s) return;
      s.x -= dx * 0.85;
      if (s.x < -40) s.x += GAME_WIDTH * 2 + 40;
    });
    this.groundScroll.tilePositionX += dx;
  }

  scrollEntities(dx) {
    this.stars.children.iterate(c => {
      if (!c) return;
      const ddx = this.player.x - c.x;
      const ddy = this.player.y - c.y;
      const dist = Math.sqrt(ddx * ddx + ddy * ddy);
      const mag = (this.activePowerup === 'magnet' ? 240 : this.stats.magnet);
      if (dist < mag) {
        c.x += (ddx / dist) * 320 * (1 / 60);
        c.y += (ddy / dist) * 320 * (1 / 60);
      }
      c.x -= dx;
    });

    this.obstacles.children.iterate(o => {
      if (!o) return;
      o.x -= dx;
      // Glass eye preview — show warning above incoming obstacle
      if (this.stats.preview && o.getData('warning') === undefined) {
        if (o.x < GAME_WIDTH && o.x > GAME_WIDTH - 200) {
          const w = this.add.text(o.x, 50, '⚠', { fontFamily: 'Courier New, monospace', fontSize: '20px', color: '#ff5a7a' }).setOrigin(0.5).setDepth(D.warning);
          w.setData('owner', o);
          o.setData('warning', w);
          this.tweens.add({ targets: w, alpha: 0, duration: 1500, onComplete: () => w.destroy() });
        }
      }
      const warn = o.getData('warning');
      if (warn) warn.x = o.x;
    });
    this.enemies.children.iterate(e => {
      if (!e) return;
      e.x -= dx;
      if (e.getData('hover')) e.y = e.getData('baseY') + Math.sin(this.time.now * 0.005 + (e.getData('phase') || 0)) * 8;
    });
    this.powerups.children.iterate(p => {
      if (!p) return;
      p.x -= dx;
      p.y = p.getData('baseY') + Math.sin(this.time.now * 0.006 + (p.getData('phase') || 0)) * 4;
    });
  }

  bumpStyle() {
    this.styleCombo += 1;
    this.styleTimer = 1500;
    if (this.styleCombo > 1) {
      this.hud.style.setText(`${STRINGS.styleX} x${this.styleCombo}`);
    }
  }

  collectStar(star) {
    if (!star.active) return;
    const styleBonus = 1 + (this.styleCombo * 0.05);
    let value = Math.max(1, Math.floor(1 * this.stats.styleMult * styleBonus));
    // Breeder license: bonus stars by style combo level
    if (this.stats.passport && this.styleCombo >= 5) value += 1;
    this.coinsEarned += value;
    star.destroy();
    sfx.coin();
    const t = this.add.text(star.x, star.y, `+${value}`, {
      fontFamily: 'Courier New, monospace', fontSize: '13px', color: '#ffd86b'
    }).setDepth(D.particle);
    this.tweens.add({ targets: t, y: t.y - 24, alpha: 0, duration: 600, onComplete: () => t.destroy() });
    this.bumpStyle();
  }

  collectPowerup(pu) {
    if (!pu.active) return;
    const kind = pu.getData('kind');
    pu.destroy();
    sfx.coin();
    sfx.doubleJump();
    if (kind === 'shield') {
      this.health += 1;
      this.hud.powerup.setText(STRINGS.shieldGained);
      this.time.delayedCall(2000, () => this.hud.powerup.setText(''));
      this.cameras.main.flash(200, 200, 220, 255);
    } else {
      this.activePowerup = kind;
      this.activePowerupUntil = this.time.now + (kind === 'turbo' ? 4500 : 7000);
      this.hud.powerup.setText(kind === 'turbo' ? STRINGS.turbo : STRINGS.magnet);
    }
  }

  hitBy(thing, cause) {
    if (!this.alive) return;
    if (this.time.now < this.invulnUntil) return;
    if (this.activePowerup === 'turbo') return;
    // Bonnet: hi-vis worker is harmless
    if (cause === 'hi_vis' && this.stats.muteHecklers) {
      thing.destroy();
      return;
    }
    // Helmet: arc spark + steam vent harmless
    if ((cause === 'arc_spark' || cause === 'steam_vent') && this.stats.helmet) {
      this.cameras.main.flash(80, 200, 220, 255);
      this.invulnUntil = this.time.now + 400;
      return;
    }
    // Vaccination: free hit per world
    if (this.stats.vaccinationActive) {
      this.stats.vaccinationActive = false;
      this.cameras.main.flash(200, 0x0, 0x76, 0xa7);
      this.invulnUntil = this.time.now + 800;
      const t = this.add.text(GAME_WIDTH / 2, 60, 'IMPFAUSWEIS!', {
        fontFamily: 'Courier New, monospace', fontSize: '14px', color: '#0076A7', stroke: '#fff', strokeThickness: 2,
      }).setOrigin(0.5).setScrollFactor(0).setDepth(D.hud);
      this.tweens.add({ targets: t, y: 30, alpha: 0, duration: 1200, onComplete: () => t.destroy() });
      return;
    }
    this.health -= 1;
    sfx.hit();
    this.cameras.main.shake(180, 0.014);
    this.cameras.main.flash(80, 255, 80, 80);

    if (this.health <= 0) {
      if (this.stats.revive && !this.usedRevive) {
        this.usedRevive = true;
        this.health = 1;
        this.invulnUntil = this.time.now + 1500;
        this.cameras.main.flash(280, 200, 255, 200);
        return;
      }
      this.die(cause);
    } else {
      this.invulnUntil = this.time.now + (this.stats.iframes ? 1300 : 700);
      this.tweens.add({ targets: this.player, alpha: 0.4, duration: 100, yoyo: true, repeat: 5, onComplete: () => this.player.setAlpha(1) });
    }
  }

  die(cause) {
    this.alive = false;
    sfx.death();
    this.player.setTexture('hero_death');
    this.player.setVelocity(160, -380);
    this.tweens.add({ targets: this.player, angle: 540, duration: 1200 });

    const finalCoins = this.coinsEarned;
    const finalDistance = Math.floor(this.distance);
    const worldName = this.currentWorld.name;

    this.stars.children.iterate(c => { if (c) c.destroy(); });
    this.obstacles.children.iterate(o => { if (o && o.body) o.body.checkCollision.none = true; });
    this.enemies.children.iterate(e => { if (e && e.body) e.body.checkCollision.none = true; });

    Save.addCoins(finalCoins);
    Save.recordRun(finalDistance, finalCoins);

    this.time.delayedCall(1400, () => {
      this.scene.start('Death', { cause, distance: finalDistance, coinsEarned: finalCoins, world: worldName });
    });
  }

  updateHud() {
    this.hud.distance.setText(`${Math.floor(this.distance)}m`);
    this.hud.stars.setText(`★ ${this.coinsEarned}`);
    if (this.health > 1) this.hud.health.setText(`${STRINGS.hp} ${this.health}`);
    else this.hud.health.setText('');
  }

  // ============= SPAWNING =============
  spawnPattern() {
    const x = GAME_WIDTH + 60;
    const worldId = this.currentWorld.id;

    const pool = [
      this.patternIngotJump, this.patternWireCoils, this.patternSlagPile,
      this.patternHangingPipe, this.patternHiVisAndIngot, this.patternStarArc,
      this.patternCrate, this.patternDrum,
    ];
    if (worldId >= 2) pool.push(this.patternAnodeJump, this.patternForklift, this.patternIngotPipe, this.patternCableSpool);
    if (worldId >= 3) pool.push(this.patternArcSpark, this.patternDroneLow, this.patternSteamVent, this.patternCopperSheet);
    if (worldId >= 3) pool.push(this.patternDoubleHazard);
    if (worldId >= 4) pool.push(this.patternGauntlet, this.patternBigGauntlet);

    let idx;
    do { idx = Math.floor(Math.random() * pool.length); }
    while (pool.length > 1 && idx === this.lastPattern);
    this.lastPattern = idx;

    const advance = pool[idx].call(this, x);

    if (Math.random() < this.stats.rareLuck) {
      this.spawnPowerup(x + advance * 0.5);
    }

    const baseSpacing = 220;
    const minSpacing = 100;
    const spacing = Math.max(minSpacing, baseSpacing - this.distance * 0.15) + Math.random() * 80;
    this.nextSpawnWorldX += advance + spacing;
  }

  patternIngotJump(x)   { this.spawnObstacle(x, 'copper_ingot'); this.spawnStarArc(x - 20, GROUND_Y - 100, 7, 80); return 200; }
  patternWireCoils(x)   { for (let i = 0; i < 3; i++) this.spawnObstacle(x + i * 40, 'wire_coil'); this.spawnStarLine(x, GROUND_Y - 110, 6, 22); return 200; }
  patternSlagPile(x)    { this.spawnObstacle(x, 'slag'); this.spawnObstacle(x + 80, 'slag'); this.spawnStarArc(x + 20, GROUND_Y - 90, 5, 60); return 200; }
  patternHangingPipe(x) { this.spawnObstacle(x, 'hanging_pipe'); this.spawnStarLine(x, GROUND_Y - 50, 5, 20); return 220; }
  patternHiVisAndIngot(x) { this.spawnEnemy(x - 20, 'hi_vis'); this.spawnObstacle(x + 60, 'copper_ingot'); this.spawnStarArc(x + 30, GROUND_Y - 110, 6, 90); return 240; }
  patternStarArc(x)     { this.spawnStarArc(x, GROUND_Y - 100, 8, 140); return 180; }
  patternAnodeJump(x)   { this.spawnObstacle(x, 'anode_plate'); this.spawnStarArc(x - 30, GROUND_Y - 160, 6, 100); return 220; }
  patternForklift(x)    { this.spawnEnemy(x, 'forklift'); this.spawnStarArc(x, GROUND_Y - 130, 8, 160); return 280; }
  patternIngotPipe(x)   { this.spawnObstacle(x, 'copper_ingot'); this.spawnObstacle(x + 200, 'hanging_pipe'); this.spawnStarLine(x + 100, GROUND_Y - 60, 4, 22); return 380; }
  patternArcSpark(x)    { this.spawnObstacle(x, 'arc_spark'); this.spawnObstacle(x + 100, 'arc_spark'); this.spawnStarLine(x, GROUND_Y - 50, 5, 24); return 220; }
  patternDroneLow(x)    { this.spawnEnemy(x, 'drone'); this.spawnEnemy(x + 90, 'drone'); this.spawnStarArc(x + 40, GROUND_Y - 140, 6, 90); return 220; }
  patternDoubleHazard(x){ this.spawnObstacle(x, 'wire_coil'); this.spawnObstacle(x + 70, 'slag'); this.spawnObstacle(x + 140, 'wire_coil'); this.spawnStarLine(x + 20, GROUND_Y - 110, 8, 22); return 280; }
  patternGauntlet(x)    {
    this.spawnObstacle(x, 'copper_ingot');
    this.spawnObstacle(x + 200, 'hanging_pipe');
    this.spawnObstacle(x + 360, 'wire_coil');
    this.spawnEnemy(x + 460, 'hi_vis');
    this.spawnStarArc(x + 60, GROUND_Y - 130, 12, 380);
    return 520;
  }
  // === NEW PATTERNS ===
  patternCrate(x)       { this.spawnObstacle(x, 'aurubis_crate'); this.spawnStarArc(x - 10, GROUND_Y - 110, 6, 80); return 200; }
  patternDrum(x)        {
    this.spawnObstacle(x, 'chemical_drum');
    this.spawnObstacle(x + 50, 'chemical_drum');
    this.spawnStarArc(x, GROUND_Y - 130, 6, 100);
    return 220;
  }
  patternCableSpool(x)  { this.spawnObstacle(x, 'cable_spool'); this.spawnStarArc(x - 30, GROUND_Y - 170, 8, 120); return 240; }
  patternSteamVent(x)   { this.spawnObstacle(x, 'steam_vent'); this.spawnObstacle(x + 100, 'steam_vent'); this.spawnStarLine(x, GROUND_Y - 50, 6, 24); return 240; }
  patternCopperSheet(x) {
    this.spawnObstacle(x, 'copper_sheet');
    this.spawnObstacle(x + 80, 'copper_sheet');
    this.spawnStarArc(x, GROUND_Y - 200, 5, 120);
    return 240;
  }
  patternBigGauntlet(x) {
    this.spawnObstacle(x, 'aurubis_crate');
    this.spawnObstacle(x + 140, 'cable_spool');
    this.spawnObstacle(x + 300, 'chemical_drum');
    this.spawnObstacle(x + 420, 'steam_vent');
    this.spawnObstacle(x + 540, 'copper_ingot');
    this.spawnEnemy(x + 640, 'forklift');
    this.spawnStarArc(x + 80, GROUND_Y - 150, 14, 600);
    return 720;
  }

  spawnObstacle(x, type) {
    const def = OBSTACLE_TYPES[type];
    let y;
    if (def.kind === 'overhead') y = (def.fromTop || 80);
    else y = GROUND_Y - (def.yFromGround || 0);
    const ob = this.obstacles.create(x, y, def.spriteKey).setScale(2);
    ob.setOrigin(0.5, def.kind === 'overhead' ? 0 : 1);
    ob.setData('cause', type);
    ob.setDepth(D.obstacle);
    if (def.body) ob.body.setSize(def.body.w, def.body.h).setOffset(def.body.ox, def.body.oy);
    if (def.glow) this.tweens.add({ targets: ob, alpha: 0.7, duration: 400, yoyo: true, repeat: -1 });
    if (def.blink) this.tweens.add({ targets: ob, alpha: 0.3, duration: 150, yoyo: true, repeat: -1 });
    return ob;
  }

  spawnEnemy(x, type) {
    const def = OBSTACLE_TYPES[type];
    const baseY = GROUND_Y - (def.yFromGround || 0);
    const en = this.enemies.create(x, baseY, def.spriteKey).setScale(2);
    en.setOrigin(0.5, 1);
    en.setData('cause', type);
    en.setData('baseY', baseY);
    en.setDepth(D.enemy);
    if (def.hover) {
      en.setData('hover', true);
      en.setData('phase', Math.random() * Math.PI * 2);
    }
    if (def.body) en.body.setSize(def.body.w, def.body.h).setOffset(def.body.ox, def.body.oy);
    return en;
  }

  spawnStarLine(x, y, count, spacing = 24) {
    for (let i = 0; i < count; i++) {
      const c = this.stars.create(x + i * spacing, y, 'star').setScale(2);
      c.body.setSize(10, 10).setOffset(3, 3);
      c.setDepth(D.star);
    }
  }

  spawnStarArc(x, y, count, span = 120) {
    for (let i = 0; i < count; i++) {
      const t = count > 1 ? i / (count - 1) : 0.5;
      const ax = x + t * span;
      const ay = y - Math.sin(t * Math.PI) * 50;
      const c = this.stars.create(ax, ay, 'star').setScale(2);
      c.body.setSize(10, 10).setOffset(3, 3);
      c.setDepth(D.star);
    }
  }

  spawnPowerup(x) {
    const kinds = ['turbo', 'magnet', 'shield'];
    const kind = kinds[Math.floor(Math.random() * kinds.length)];
    const spriteKey = kind === 'turbo' ? 'pu_turbo' : kind === 'magnet' ? 'pu_magnet' : 'pu_shield';
    const baseY = GROUND_Y - 130;
    const pu = this.powerups.create(x, baseY, spriteKey).setScale(2.4);
    pu.setData('kind', kind);
    pu.setData('baseY', baseY);
    pu.setData('phase', Math.random() * Math.PI * 2);
    pu.body.setSize(12, 12).setOffset(2, 2);
    pu.setDepth(D.star);
    this.tweens.add({ targets: pu, alpha: 0.7, duration: 500, yoyo: true, repeat: -1 });
  }

  showPause() {
    const overlay = this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'panel_dark')
      .setDisplaySize(GAME_WIDTH, GAME_HEIGHT).setScrollFactor(0).setDepth(200);
    const txt = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 16, STRINGS.paused,
      { fontFamily: 'Courier New, monospace', fontSize: '32px', color: '#ffd86b' })
      .setOrigin(0.5).setScrollFactor(0).setDepth(201);
    const sub = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 18, STRINGS.pauseHint,
      { fontFamily: 'Courier New, monospace', fontSize: '14px', color: '#f0e7d8' })
      .setOrigin(0.5).setScrollFactor(0).setDepth(201);
    const onResume = () => {
      overlay.destroy(); txt.destroy(); sub.destroy();
      this.input.keyboard.off('keydown-ESC', onResume);
      this.input.keyboard.off('keydown-M', onMenu);
      this.scene.resume();
    };
    const onMenu = () => {
      this.input.keyboard.off('keydown-ESC', onResume);
      this.input.keyboard.off('keydown-M', onMenu);
      this.scene.resume();
      this.scene.start('Menu');
    };
    this.input.keyboard.once('keydown-ESC', onResume);
    this.input.keyboard.once('keydown-M', onMenu);
  }
}
