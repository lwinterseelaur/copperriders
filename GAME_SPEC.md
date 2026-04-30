# COPPER RIDERS — Game Design Specification

## Elevator Pitch

A pixel-art rogue-lite side-scroller where you gallop through increasingly absurd obstacle courses on a hobby horse (yes, a stick with a fabric head). Die, lose your progress, but keep your coins to buy hilariously over-engineered upgrades in a shop run by a judgmental horse-craft artisan. The tone: deadpan serious about a fundamentally ridiculous sport.

---

## 1. Core Concept

**Genre:** Rogue-lite side-scrolling platformer
**Art style:** 16-bit pixel art, vibrant palette
**Tone:** Deadpan sarcastic — the game treats hobby horsing with the gravity of Olympic equestrianism while being fully aware of the absurdity
**Target platform:** Web (HTML5 Canvas), desktop-exportable

---

## 2. Gameplay Loop

### Run Phase (Side-Scroller)
- Auto-scrolling left-to-right at increasing speed
- Player controls a hobby horser: a character straddling a stick horse
- **Jump** over obstacles (show jump fences, water trays, traffic cones, hecklers)
- **Duck** under low branches, thrown tomatoes, TikTok drones
- **Collect coins** (golden horseshoes) scattered across the course
- **Pick up temporary power-ups** mid-run
- Courses are procedurally assembled from hand-designed segments
- Difficulty scales with distance — courses progress through themed worlds

### Death
- One-hit death (no health bar by default — you're on a stick horse, you're fragile)
- Dramatic slow-motion ragdoll with the hobby horse flying away
- Score screen: distance, coins collected, cause of death (displayed as a sarcastic "Judge's Comment")

### Shop Phase (Between Runs)
- Spend coins at **"The Tack Room"** — a shop run by **Helga**, a stern Finnish hobby horse breeder who judges every purchase
- Buy permanent upgrades that persist across runs
- Unlock new hobby horses with different stats
- Helga has dialogue for every item — dripping with dry humor

---

## 3. Controls

| Input | Action |
|-------|--------|
| Space / Up / W | Jump (hold for higher jump) |
| Down / S | Duck / Slide |
| Left Click / X | Use active power-up |
| P / Esc | Pause |

Simple two-button core (jump + duck) with optional power-up activation.

---

## 4. World Progression

Five themed worlds, each with 5 procedurally-assembled stages + 1 boss stage:

### World 1: "The Local Paddock"
- Setting: Finnish suburban backyard / school gym
- Obstacles: Low fences, cones, puddles, gym equipment
- Enemies: Skeptical PE teachers, confused dogs
- Boss: **The Gym Teacher** — throws dodgeballs in arc patterns

### World 2: "The Regional Qualifier"
- Setting: Sports hall with proper jump course
- Obstacles: Competition-grade jumps, water trays, tight turns
- Enemies: Rival competitors who body-check you, overzealous photographers
- Boss: **The Instagram Influencer** — summons ring lights and selfie sticks as projectiles

### World 3: "The TikTok Gauntlet"
- Setting: Urban environment, going viral
- Obstacles: Phone-wielding hecklers, "cringe compilation" cameras, thrown internet comments (literal text blocks)
- Enemies: Trolls (literal bridge trolls holding phones), drone cameras
- Boss: **The Algorithm** — a glitching screen entity that changes the scrolling speed/direction

### World 4: "The European Championship"
- Setting: Grand arena in Czech Republic
- Obstacles: International-grade fences, dressage letters, pyrotechnics
- Enemies: International rivals with national-themed hobby horses, strict judges throwing red cards
- Boss: **The Head Judge** — slams a giant scoring paddle that creates shockwaves

### World 5: "The Hobby Horse Apocalypse"
- Setting: Surreal landscape where hobby horses have come to life
- Obstacles: Living hobby horses stampeding, fabric volcanoes, yarn tornadoes
- Enemies: Sentient hobby horses, stuffing golems
- Boss: **The Primal Mare** — a massive, eldritch hobby horse deity

---

## 5. Player Character

### Base Stats
- **Speed:** How fast you move (affects how the scroll speed feels)
- **Jump Height:** Vertical clearance
- **Style Points:** Multiplier for coin collection (hobby horsing rewards looking good)
- **Durability:** Number of hits before death (starts at 1)
- **Luck:** Chance of bonus coin drops and rare power-up spawns

### Animation States
- Idle (bouncing on the spot, hobby horse bobbing)
- Gallop (running with exaggerated high knees, stick between legs)
- Jump (tucking legs like a show jumper, hobby horse angled forward)
- Duck/Slide (crouching low, hobby horse horizontal)
- Death (ragdoll tumble, hobby horse spirals away dramatically)
- Victory (dressage-style halt, salute to judges)

---

## 6. The Tack Room — Shop & Items

### Shop Keeper: Helga
- Finnish hobby horse artisan, 50s, stern expression, tiny reading glasses
- Pixel art portrait that changes expression per item category
- Every purchase comes with a one-liner
- Judges you if you buy cheap items, respects you if you buy expensive ones

---

### PERMANENT UPGRADES (persist across all runs)

#### Hobby Horse Upgrades

| Item | Cost | Effect | Helga's Comment |
|------|------|--------|-----------------|
| **Duct Tape Reinforcement** | 50 | +0.5 jump height | "This is an insult to craftsmanship. But it works." |
| **Premium Yarn Mane** | 120 | +10% style multiplier | "Finally, some respect for aesthetics." |
| **Aerodynamic Nostril Flare** | 200 | +15% speed | "I hand-painted those nostrils. You're welcome." |
| **Glass Eye Upgrade** | 350 | Coins visible further ahead (extended preview) | "Now your horse can see its own disappointment." |
| **NFC Passport Chip** | 500 | +1 revive per run (the horse is "registered" — it can't truly die) | "Congratulations, your stick is now officially a horse." |
| **Carbon Fiber Stick** | 800 | +1 durability | "In my day we used birch. You kids are soft." |
| **Vaccination Certificate** | 1200 | Immunity to one hit per world (the horse is "healthy") | "Yes, I vaccinated the fabric. Don't ask questions." |

#### Rider Upgrades

| Item | Cost | Effect | Helga's Comment |
|------|------|--------|-----------------|
| **Second-Hand Riding Boots** | 80 | Slide distance +30% | "They smell. But they grip." |
| **Certified Helmet** | 150 | Survive ceiling bonks | "Safety first. Dignity never." |
| **Ear Bonnet (For You)** | 250 | Muffles heckler audio — heckler enemies deal no knockback | "It's meant for the horse. But I won't judge. Much." |
| **Competition Leotard** | 400 | +20% style multiplier | "You look like a figure skater who got lost. It's perfect." |
| **Finnish Sisu Trait** | 600 | Brief invincibility after taking damage | "Sisu: the Finnish art of being too stubborn to die." |
| **Dressage Training Manual** | 900 | Unlocks double-jump (a "flying lead change" mid-air) | "Ah, the flying change. In the air. On a stick. Majestic." |
| **Professional Athlete Card** | 1500 | Speed boost doesn't decay over time | "The government now recognizes you as an athlete. Sleep well." |

#### Meta / Economy Upgrades

| Item | Cost | Effect | Helga's Comment |
|------|------|--------|-----------------|
| **Bigger Pockets** | 100 | +10% coin collection radius (magnetic) | "Coins are attracted to ambition. And magnets." |
| **Marketplace Haggler** | 300 | All shop prices -10% | "I'm offended. But I respect the hustle." |
| **Breeder Number License** | 500 | Earn bonus coins from style (coin multiplier on tricks) | "You are now legally a breeder. Of fabric." |
| **Hobby Horse Passport Book** | 750 | Track stats, unlock achievements screen | "Every horse deserves a legacy. Even this one." |
| **Stable Expansion** | 1000 | Unlock additional hobby horse slots | "More horses. More problems. More fun." |
| **VIP Marketplace Pass** | 2000 | Rare items appear in shop | "Welcome to the inner circle. We have cookies." |

---

### CONSUMABLE ITEMS (buy in shop, use once per run)

| Item | Cost | Effect | Helga's Comment |
|------|------|--------|-----------------|
| **Energy Drink** | 30 | 5 seconds of max speed | "Your kidneys filed a complaint." |
| **Spare Mane** | 50 | Cosmetic shield — absorbs one hit | "A backup mane. For emergencies." |
| **Judge's Bribe** | 75 | Next obstacle auto-cleared | "I saw nothing. NOTHING." |
| **Inspirational TikTok** | 40 | Temporary style multiplier x2 | "Ugh. But the algorithm demands content." |
| **Artisanal Horse Treat** | 60 | Heal 1 durability | "It's a sugar cube. For fabric. Don't overthink it." |

---

### UNLOCKABLE HOBBY HORSES (alternate characters)

Each horse has different base stats and a unique passive ability.

| Horse | Cost | Stats | Passive | Description |
|-------|------|-------|---------|-------------|
| **Starter Steve** | Free | Balanced | None | A humble sock puppet on a broomstick. Everyone starts somewhere. |
| **Finnish Flash** | 300 | High speed, low durability | Leaves speed afterimages | Regulation Finnish competition horse. Has a passport, a vaccine record, and an attitude. |
| **Dressage Duchess** | 500 | High style, medium speed | Double coins from style combos | Hand-stitched by a grandmaster. The eyes follow you. |
| **Duct Tape Nightmare** | 400 | High durability, low style | Takes 2 hits before losing mane | Built in a panic. Held together by hope and adhesive. |
| **The Influencer** | 700 | Medium all, high luck | Chance to charm enemies (they take selfies instead of attacking) | Has 50k followers. None of them respect it. |
| **Western Woody** | 600 | High jump, medium speed | Sliding stop ability (quick brake) | Leather accessories. Cowboy hat. Problematic accent. |
| **The Eldritch Foal** | 1500 | Low speed, extreme style | Enemies occasionally flee in terror | It has too many eyes. The mane moves on its own. Nobody remembers sewing it. |
| **Golden Stallion** | 5000 | High all stats | Coins worth double | Pure gold fabric. Frankly embarrassing. Helga refuses to discuss it. |

---

## 7. Power-Ups (found during runs)

| Power-Up | Visual | Effect | Duration |
|----------|--------|--------|----------|
| **Turbo Gallop** | Flaming hooves | 2x speed, invincible | 5 sec |
| **Magnet Horseshoe** | Glowing horseshoe | All coins attracted to player | 8 sec |
| **Judge's Favor** | Star above head | Style points x3 | 10 sec |
| **Ghost Horse** | Translucent player | Phase through obstacles | 4 sec |
| **Hobby Horse Revolution** | Documentary camera follows you | All enemies become fans, cheer instead of attack | 6 sec |
| **The Flying Change** | Wings on hobby horse | Infinite jumps | 5 sec |
| **Crowd Funding** | Coin rain | Coins fall from the sky | 7 sec |

---

## 8. Enemies & Obstacles

### Obstacles (Static)
- **Show jump fences** — various heights, must be jumped
- **Water trays** — must be jumped over, slows if landed in
- **Low branches / banners** — must duck under
- **Dressage letters** — spinning letter blocks in the path
- **Traffic cones** — small but annoying
- **Mud patches** — slow zones

### Enemies (Active)
- **Heckler** — stands on sideline, throws comment bubbles ("CRINGE!", "NEIGH WAY!")
- **Rival Rider** — gallops alongside, tries to cut you off
- **Drone Camera** — flies overhead, drops spotlight (slows you in the light)
- **Troll (literal)** — under bridges, swipes at you
- **Judge** — holds up score cards, low scores create shockwaves
- **Stuffing Golem** (World 5) — slow, bulky, drops stuffing clouds that obscure vision
- **Loose Hobby Horse** (World 5) — riderless stick horse that bounces unpredictably

---

## 9. Scoring & Progression

### Coins (Primary Currency)
- Found on course as golden horseshoes
- Bonus coins for style (consecutive jumps without touching ground)
- Bonus coins at end based on distance
- **Persist through death** — this is the rogue-lite hook

### Distance (Run Score)
- Measured in meters
- Each world unlocks at distance milestones:
  - World 2: 500m reached
  - World 3: 1500m reached
  - World 4: 3000m reached
  - World 5: 5000m reached

### Style Combo
- Chaining jumps, near-misses, and ducks builds a style multiplier
- Style multiplier applies to all coin pickups
- Getting hit or stumbling resets the combo
- Visual flair increases with combo (particle effects, crowd cheers)

### Judge's Comments (Death Screen)
Randomly selected sarcastic death messages themed to cause of death:
- Hit by fence: "The fence gave you a 2.3. For effort."
- Hit by heckler: "Words hurt. Especially at 60 pixels per second."
- Fell in water: "Your horse is fabric. FABRIC."
- Hit by troll: "You got trolled. Literally."
- Ran out of time: "The algorithm lost interest."
- Hit by boss: "The judges have spoken. They said 'no.'"

---

## 10. Audio Design

### Music
- **Shop theme:** Cozy acoustic Finnish folk with dry humor undertones
- **World 1:** Upbeat chiptune, bouncy and innocent
- **World 2:** Competitive march, building intensity
- **World 3:** Electronic/glitchy, social media chaos vibes
- **World 4:** Grand orchestral chiptune, European championship pomp
- **World 5:** Dark ambient chiptune, eldritch undertones
- **Boss themes:** Intensified versions of world themes

### Sound Effects
- Galloping: rhythmic clip-clop (cardboard on wood)
- Jump: satisfying "swoosh" + fabric flutter
- Coin: bright "ding" with horseshoe clink
- Hit: comedic "bonk" + horse whinny (squeaky toy)
- Death: dramatic orchestral sting + sad trombone
- Shop purchase: cash register + Helga grunt of approval/disapproval

---

## 11. Visual Style

### Pixel Art Specifications
- **Tile size:** 16x16 base tiles
- **Character size:** 32x48 pixels (character + hobby horse)
- **Resolution:** 480x270 native, scaled up (16:9)
- **Palette:** Limited per-world palette (12-16 colors each), inspired by PICO-8/retro aesthetics
- **Animation:** Fluid frame-by-frame, 6-8 frames per action
- **Parallax:** 3-4 scrolling background layers per world

### UI Style
- Chunky pixel font
- Horseshoe-shaped coin counter
- Style combo meter styled as a dressage score card
- Distance meter styled as a competition timer
- Shop UI: cork board / stable notice board aesthetic

---

## 12. Technical Architecture

### Stack
- **Engine:** [Phaser 3](https://phaser.io) — mature 2D HTML5 framework with built-in physics, scene management, input, audio, and tween systems. Loaded via CDN, no build step required.
- **Rendering:** Phaser's WebGL renderer with pixel-perfect mode (`pixelArt: true`)
- **Physics:** Phaser Arcade Physics (lightweight, perfect for platformers)
- **Scene management:** Phaser scenes — Boot, Menu, Game, Death, Shop
- **Level generation:** Segment-based procedural assembly from pre-designed chunks
- **Save system:** LocalStorage for persistent upgrades, coins, unlocks
- **Asset pipeline:** Programmatically generated pixel art sprites at runtime (no external sprite assets needed for v1) — defined as multi-line palette strings, rasterized to canvas textures, registered with Phaser's TextureManager
- **Audio:** Web Audio API via Phaser's audio system (synth-generated SFX for v1, music files later)

### File Structure
```
copper-riders/
├── index.html              # Entry point (loads Phaser CDN + game)
├── css/
│   └── style.css           # Minimal layout/scaling CSS
├── js/
│   ├── main.js             # Phaser game config, scene registration
│   ├── sprites.js          # SpriteFactory — programmatic pixel art
│   ├── save.js             # LocalStorage save/load wrapper
│   ├── audio.js            # Synth-generated SFX
│   ├── data.js             # All game content (upgrades, horses, dialogue, worlds)
│   └── scenes/
│       ├── Boot.js         # Asset gen, splash
│       ├── Menu.js         # Title screen
│       ├── Game.js         # Main run gameplay
│       ├── Death.js        # Judge's Comment screen
│       └── Shop.js         # Helga's Tack Room
└── GAME_SPEC.md            # This file
```

---

## 13. Milestone Plan

### Phase 1: Core Loop
- Player movement and physics (jump, duck, collide)
- Auto-scrolling camera
- Basic obstacle spawning
- Coin collection
- Death and restart
- Coin persistence via LocalStorage

### Phase 2: Shop & Progression
- Shop UI (The Tack Room)
- Permanent upgrades purchasing
- Helga dialogue system
- Stat system integration

### Phase 3: Content
- All 5 worlds with tilesets and backgrounds
- All enemy types
- All power-ups
- All shop items
- All unlockable horses

### Phase 4: Boss Fights
- 5 boss encounters with unique patterns
- Boss arenas

### Phase 5: Polish
- Pixel art animations (all states)
- Sound effects and music
- Particle effects
- Screen shake, juice
- Death screen with Judge's Comments
- Style combo visual feedback

### Phase 6: Meta
- Achievement system
- Hobby Horse Passport (stats tracking)
- Title screen, credits
- Tutorial / first-run experience

---

## 14. Achievements

| Name | Requirement | Reward |
|------|-------------|--------|
| **First Hoofbeat** | Complete first run | 50 coins |
| **Style Icon** | Reach 50x style combo | "Competition Leotard" -50% |
| **Frugal Finn** | Reach World 2 with starter horse only | 100 coins |
| **Vaccinated** | Buy Vaccination Certificate | Cosmetic: certificate frame |
| **Stable Master** | Unlock 5 different hobby horses | 500 coins |
| **Cringe Survivor** | Defeat the TikTok Algorithm boss | "The Influencer" horse free |
| **Eldritch Embrace** | Unlock The Eldritch Foal | Helga refuses to speak to you for 1 run |
| **Sisu Personified** | Win a run without taking damage | 1000 coins |
| **Marketplace Hustler** | Spend 10,000 total coins in shop | 5% permanent shop discount |
| **Documentary Subject** | Reach 10,000m in a single run | "Hobbyhorse Revolution" mode unlocked |
| **The Real Stuff** | Defeat all 5 bosses | True ending cutscene |
| **Pony Up** | Find the secret golden horseshoe in World 3 | Golden Stallion -2000 coins |

---

## 15. Easter Eggs & Secret Content

- **Konami code at title screen** — unlocks "Documentary Mode" with sepia filter, Selma Vilhunen-style narration overlays
- **Type "FINLAND" in shop** — Helga becomes friendly for one run, no judgmental comments
- **Hidden rival NPC: Brunhilda** — appears randomly in courses after beating World 4. Always wins. Cannot be caught. Drops a single coin labeled "for your trouble."
- **Secret World 6: "The Pasture Beyond"** — accessible by collecting all hidden horseshoes across worlds 1-5. A peaceful infinite walking simulator. No obstacles. The crowd cheers regardless. Final secret achievement.

---

## 16. Daily Challenge Mode

A new fixed seed each day produces the same course for all players globally. Modifiers stacked:
- "**One Mane Day**" — only starter horse allowed
- "**Helga's Wrath**" — shop closed for the run
- "**Cringe Compilation**" — extra hecklers, but 3x style points
- "**Dressage Day**" — extra style multiplier, slower scroll
- "**Puissance Mode**" — only high-jump obstacles, but jumps clear bigger gaps

Leaderboard tracks daily best distance.

---

## 17. Expanded Helga Dialogue

### Random shop entry lines
- "You again. Try not to die immediately this time."
- "Welcome back. Your horse misses you. Probably."
- "I see you've collected coins. How quaint."
- "Did you know? In Finland, we ride hobby horses through actual snow. In actual competitions. Yes, really."
- "The vaccination forms won't fill themselves out, you know."
- "You smell like exertion and disappointment. Welcome."
- "Today's special: anything you can afford."

### Random shop exit lines
- "Try to bring me back something other than dirt."
- "Do not embarrass the horse."
- "If you die, the horse comes back to me. Those are the rules."
- "Sisu. Channel the sisu."
- "The judges are watching. They are always watching."

### Item-specific quotes (extras beyond table)
- **Buying anything cheap repeatedly:** "Please. You're hurting me."
- **Buying premium items:** "Now THIS is craftsmanship."
- **Trying to buy something you can't afford:** "Coins. You need coins. Have you considered earning them?"
- **First-time visitor:** "You're new. I can tell. The horse looks scared."

---

## 18. Cause-of-Death Judge Comments (Expanded)

### Generic
- "0.0 from the Russian judge."
- "The dressage was fine. The dying was not."
- "Your hobby horse passport has been... revoked."
- "Helga is updating your vaccination certificate. Posthumously."
- "The crowd has gone home. They have things to do."

### Fence collision
- "Every fence is a teacher. You learned nothing."
- "The fence remained vertical. You did not."
- "A 'refusal' typically refers to the horse, not the rider."

### Water tray
- "Fabric absorbs water. Fabric does not absorb shame."
- "The water tray is two centimeters deep. You have failed two centimeters."

### Heckler
- "The internet wins again."
- "Sticks and stones may break bones — but words knock you off a stick."

### Time / boundary
- "The algorithm has unsubscribed."
- "The crowd grew bored. Even crowds have limits."

### Boss
- "The Head Judge gave you a 1.5. Out of 100."
- "The Algorithm's verdict: 'Mid.'"
- "The Primal Mare regrets your existence."

---

## 19. Tutorial / Onboarding

First run only:
1. Auto-scrolls slowly for first 200m with helpful tooltips
2. "Press SPACE to jump. Real horses do this. Yours is fabric, but believes."
3. "Press DOWN to duck. Hecklers throw words. Words travel at head height."
4. "Collect golden horseshoes. They are currency. Helga accepts only currency."
5. After first death: full Helga introduction, walks player through shop UI

---

## 20. Design Pillars

1. **Deadpan absurdity** — Never wink at the camera. Treat hobby horsing like the Olympics. The humor comes from the gap between tone and content.
2. **One more run** — Runs are short (1-3 minutes). Death is fast. Getting back in is faster. The shop gives you a reason to try again.
3. **Earn the ridiculous** — The best items and horses are expensive and weird. Players should WANT to grind for "The Eldritch Foal."
4. **Accessible core, deep meta** — Anyone can jump and duck. Mastery comes from style combos, horse selection, and upgrade synergies.
5. **Pixel art charm** — Every sprite should make you smile. The hobby horse bobbing animation is the soul of the game.
