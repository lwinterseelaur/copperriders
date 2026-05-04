// Alle Spielinhalte. Texte in Deutsch.

export const UPGRADES = [
  // Steckenpferd-Upgrades
  { id: 'duct_tape',      name: 'Panzertape-Verstärkung',   cost: 50,   tier: 1, cat: 'horse',  effect: 'jump+0.5',     desc: 'Eine Beleidigung für die Handwerkskunst. Aber funktioniert.' },
  { id: 'yarn_mane',      name: 'Premium-Wollmähne',        cost: 120,  tier: 1, cat: 'horse',  effect: 'style+10%',    desc: 'Endlich ein wenig Sinn für Ästhetik.' },
  { id: 'nostrils',       name: 'Aerodynamische Nüstern',   cost: 200,  tier: 2, cat: 'horse',  effect: 'speed+15%',    desc: 'Die Nüstern habe ich von Hand bemalt. Bitte sehr.' },
  { id: 'glass_eye',      name: 'Glasaugen-Upgrade',        cost: 350,  tier: 2, cat: 'horse',  effect: 'preview+',     desc: 'Jetzt sieht dein Pferd seine eigene Enttäuschung.' },
  { id: 'nfc_chip',       name: 'NFC-Pferdepass-Chip',      cost: 500,  tier: 3, cat: 'horse',  effect: 'revive+1',     desc: 'Glückwunsch — dein Stock ist jetzt offiziell ein Pferd.' },
  { id: 'carbon_stick',   name: 'Carbonfaser-Stab',         cost: 800,  tier: 3, cat: 'horse',  effect: 'durability+1', desc: 'Früher nahmen wir Birke. Ihr Kinder seid weich geworden.' },
  { id: 'vaccination',    name: 'Impfausweis',              cost: 1200, tier: 4, cat: 'horse',  effect: 'world_immune', desc: 'Ja, ich habe den Stoff geimpft. Keine Fragen.' },
  // Reiter-Upgrades
  { id: 'used_boots',     name: 'Gebrauchte Reitstiefel',   cost: 80,   tier: 1, cat: 'rider',  effect: 'slide+30%',    desc: 'Sie stinken. Aber sie greifen.' },
  { id: 'helmet',         name: 'Geprüfter Helm',           cost: 150,  tier: 1, cat: 'rider',  effect: 'no_ceiling',   desc: 'Sicherheit zuerst. Würde nie.' },
  { id: 'bonnet',         name: 'Ohrenkappe (für dich)',    cost: 250,  tier: 2, cat: 'rider',  effect: 'mute_hecklers',desc: 'Eigentlich für das Pferd. Aber ich urteile nicht. Viel.' },
  { id: 'leotard',        name: 'Wettkampf-Trikot',         cost: 400,  tier: 2, cat: 'rider',  effect: 'style+20%',    desc: 'Wie eine Eiskunstläuferin, die sich verlaufen hat. Perfekt.' },
  { id: 'sisu',           name: 'Finnisches Sisu',          cost: 600,  tier: 3, cat: 'rider',  effect: 'iframes+',     desc: 'Sisu: zu stur zum Sterben.' },
  { id: 'dressage_book',  name: 'Dressur-Trainingsbuch',    cost: 900,  tier: 3, cat: 'rider',  effect: 'double_jump',  desc: 'Ein fliegender Galoppwechsel. In der Luft. Auf einem Stock. Majestätisch.' },
  { id: 'athlete_card',   name: 'Profisportler-Ausweis',    cost: 1500, tier: 4, cat: 'rider',  effect: 'speed_perm',   desc: 'Du bist jetzt offiziell Athlet. Schlaf gut.' },
  // Meta / Wirtschaft
  { id: 'pockets',        name: 'Größere Taschen',          cost: 100,  tier: 1, cat: 'meta',   effect: 'magnet+10%',   desc: 'Sterne werden von Ehrgeiz angezogen. Und Magneten.' },
  { id: 'haggler',        name: 'Marktplatz-Feilscher',     cost: 300,  tier: 2, cat: 'meta',   effect: 'shop-10%',     desc: 'Ich bin beleidigt. Aber ich respektiere den Geschäftssinn.' },
  { id: 'breeder',        name: 'Züchter-Lizenz',           cost: 500,  tier: 2, cat: 'meta',   effect: 'style_coin+',  desc: 'Du bist jetzt rechtlich Züchter. Von Stoff.' },
  { id: 'passport_book',  name: 'Steckenpferd-Pass',        cost: 750,  tier: 3, cat: 'meta',   effect: 'achievements', desc: 'Jedes Pferd verdient ein Vermächtnis. Selbst dieses.' },
  { id: 'stable',         name: 'Stallerweiterung',         cost: 1000, tier: 3, cat: 'meta',   effect: 'horse_slots+', desc: 'Mehr Pferde. Mehr Probleme. Mehr Spaß.' },
  { id: 'vip',            name: 'VIP-Marktplatzpass',       cost: 2000, tier: 4, cat: 'meta',   effect: 'rare_items',   desc: 'Willkommen im inneren Kreis. Wir haben Kekse.' },
];

export const HORSES = [
  { id: 'starter',  name: 'Azubi-Andi',             cost: 0,    speed: 1.0, jump: 1.0, style: 1.0, durability: 1, luck: 1.0, desc: 'Frisch aus dem IAZ. Hat noch nie eine Schicht alleine gemacht.' },
  { id: 'flash',    name: 'Schicht-Schorsch',       cost: 300,  speed: 1.3, jump: 1.0, style: 1.0, durability: 1, luck: 1.0, desc: 'Macht jede Spätschicht. Schläft am Ofen. Beschwert sich nie.' },
  { id: 'duchess',  name: 'Anoden-Anke',            cost: 500,  speed: 1.0, jump: 1.1, style: 1.5, durability: 1, luck: 1.0, desc: '99,99 % Reinheit. 0,01 % Geduld mit Praktikanten.' },
  { id: 'duct',     name: 'Schlacken-Sepp',         cost: 400,  speed: 0.9, jump: 1.0, style: 0.7, durability: 2, luck: 1.0, desc: 'Trägt seit 1987 denselben Helm. Kein Kratzer.' },
  { id: 'influencer', name: 'Vorstand-Vincent',     cost: 700,  speed: 1.1, jump: 1.1, style: 1.1, durability: 1, luck: 1.5, desc: 'War zweimal in der Hütte. Trägt nie Helm. Postet auf LinkedIn.' },
  { id: 'woody',    name: 'Hüttenmeister Helmut',   cost: 600,  speed: 1.0, jump: 1.3, style: 0.9, durability: 1, luck: 1.0, desc: 'Riecht nach Schwefel. Erzählt Geschichten von „damals".' },
  { id: 'foal',     name: 'Tankhaus-Trolli',        cost: 1500, speed: 0.9, jump: 1.0, style: 2.0, durability: 1, luck: 1.2, desc: 'Lebt seit Jahren im Tankhaus. Niemand weiß, ob er angestellt ist.' },
  { id: 'gold',     name: 'CEO Cu',                 cost: 5000, speed: 1.2, jump: 1.2, style: 1.5, durability: 2, luck: 1.5, desc: 'Reines Kupfer. Reiner Bonus. Reine Quartalszahlen.' },
];

// Fictional company name + tagline. Close to copper-industry feel
// but distinct from any real company so we steer clear of trademark issues.
export const COMPANY_NAME = 'CUPRION';
export const COMPANY_LOCATION = 'HAMBURG';
export const COMPANY_TAGLINE = 'KUPFER IN BEWEGUNG';
// Legacy export kept so other modules still import without breaking
export const AURUBIS_TAGLINE = COMPANY_TAGLINE;

// Death quotes are all about failing the obstacle/dressage course —
// the player gets eliminated from the show, not injured. We deliberately
// avoid any framing that resembles a real workplace incident.
export const DEATH_QUOTES = {
  cable_spool: [
    'An der Kabeltrommel hängengeblieben. Stilnote 1,2.',
    'Die Spule blieb stehen. Du auch. Punkteabzug.',
  ],
  chemical_drum: [
    'Das Fass war hübsch markiert. Du hast es trotzdem touchiert.',
    'Hindernis nicht gemeistert. Die Jury seufzt vereint.',
  ],
  copper_sheet: [
    'Eine Kupferplatte. Senkrecht. Wie die Lernkurve.',
    '99,99 % rein. Genauso wie deine Verlegenheit.',
  ],
  steam_vent: [
    'Bücken vergessen. Die Jury winkt mit dem Kärtchen.',
    'Das Ventil pfeift. Du wirst ausgepfiffen.',
  ],
  aurubis_crate: [
    'Eine Frachtkiste. Zielgenau platziert. Du leider auch.',
    'Lieferung blockiert. Reiter blockiert. Pause.',
  ],
  copper_ingot: [
    'Tonnenweise Kupfer. Tonnenweise Schande.',
    'Ein Kupferbarren. 99,99 % rein. Du: 0,01 % aufmerksam.',
    'Die Kathodenplatte stand. Du strauchelst. Disqualifiziert.',
  ],
  wire_coil: [
    'Im Kupferdraht verheddert. Ein klassischer Patzer.',
    'Die Spule blieb liegen. Deine Punkte auch.',
  ],
  slag: [
    'Slalom um die Schlacke? Eher Slalom durch die Schlacke.',
    'Glühende Schlacke ist umzureiten. Theoretisch.',
  ],
  hanging_pipe: [
    'Bücken war eine Option. Eine, die du nicht gewählt hast.',
    'Das Rohr hängt seit zwanzig Jahren. Du hast es übersehen.',
  ],
  anode_plate: [
    'Anodenplatte verfehlt. Stilnote: ungenügend.',
    'Eine Anodenplatte schlägt dich. Eine. Anodenplatte.',
  ],
  arc_spark: [
    'Funkenflug. Stilbruch. Die Jury rauft sich die Haare.',
    'Bücken war auf der Checkliste. Punkt 4. Vergessen.',
  ],
  hi_vis: [
    'Worte tun weh. Besonders bei sechzig Pixeln pro Sekunde.',
    'Der Vorarbeiter hat dir winkend signalisiert. Du hast gewinkt zurück.',
  ],
  forklift: [
    'Der Gabelstapler hat Vorfahrt. Immer.',
    'Vorfahrt nicht beachtet. Pause beendet.',
  ],
  drone: [
    'Kameradrohne hat alles aufgezeichnet. Cringe-Compilation läuft.',
    'Die Inspektionsdrohne notiert: ungenügend.',
  ],
  generic: [
    'Die Menge ist nach Hause gegangen. Hatte Termine.',
    'Dein Steckenpferd-Pass wurde widerrufen.',
    '0,0 von der russischen Jury.',
    'Jenser aktualisiert deinen Impfausweis. Mit roter Tinte.',
    'Die Dressur war in Ordnung. Der Rest nicht.',
  ],
};

export const HELGA_GREETINGS = [
  'Du schon wieder. Versuch diesmal, nicht sofort zu sterben.',
  'Willkommen zurück. Dein Pferd hat dich vermisst. Vermutlich.',
  'Moin. Ich seh, du hast Sterne gesammelt. Wie niedlich.',
  'Du riechst nach Schwefel und Enttäuschung. Willkommen.',
  'Heutiges Sonderangebot: alles, was du dir leisten kannst.',
  'Die Impfausweise füllen sich nicht von selbst aus, weißt du.',
  'Glotz nicht so. Hier ist die Sattelkammer, kein Streichelzoo.',
  'Schicht zu Ende? Oder bist du wieder zu früh getürmt?',
];

export const HELGA_FAREWELLS = [
  'Bring mir bitte was Brauchbares mit. Nicht nur Schlacke.',
  'Blamiere das Pferd nicht.',
  'Sisu. Kanalisiere das Sisu.',
  'Die Kampfrichter beobachten dich. Immer.',
  'Und nicht wieder mit Schlacke an den Stiefeln zurückkommen.',
];

export const HELGA_PURCHASE = {
  cheap: ['Bitte. Du tust mir weh.', 'Eine bescheidene Wahl. Für einen bescheidenen Reiter.'],
  premium: ['DAS nenne ich Handwerkskunst.', 'Endlich was Vernünftiges. Wie ein A-Posten.'],
  broke: ['Sterne. Du brauchst Sterne. Hast du an Verdienen gedacht?', 'Komm wieder, wenn was im Säckel ist.'],
};

export const WORLDS = [
  { id: 1, name: 'CUPRION: Hüttenhalle',    skyTop: '#6a4a3a', skyBot: '#c08858', soil: '#3a2a26', grass: '#7a5a44', accent: '#b56a3a', distance: 0 },
  { id: 2, name: 'CUPRION: Schmelzwerk',    skyTop: '#4a2a2a', skyBot: '#a04830', soil: '#2a1a18', grass: '#6a3a28', accent: '#d28858', distance: 600 },
  { id: 3, name: 'CUPRION: Drahtzieherei',  skyTop: '#2a3a5a', skyBot: '#4a5a8a', soil: '#1a2030', grass: '#4a5a70', accent: '#b56a3a', distance: 1800 },
  { id: 4, name: 'CUPRION: Anodenhof',      skyTop: '#1a1a2a', skyBot: '#3a3a4a', soil: '#0a0a14', grass: '#2a2a3a', accent: '#d28858', distance: 3500 },
  { id: 5, name: 'CUPRION: Der Schmelztiegel', skyTop: '#6a1a2a', skyBot: '#ff5a20', soil: '#1a0606', grass: '#6a1a0a', accent: '#ffaa55', distance: 6000 },
];

export function worldFor(distance) {
  let w = WORLDS[0];
  for (const world of WORLDS) {
    if (distance >= world.distance) w = world;
  }
  return w;
}

export function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Strings — UI labels
export const STRINGS = {
  title: 'COPPER RIDERS',
  subtitle: 'Vom IAZ bis zum Dock, Hobby Horse macht Bock',
  best: 'BESTE',
  coins: 'STERNE',
  gallop: 'LOSREITEN!',
  tackRoom: "JENSERS SATTELKAMMER",
  tackRoomShort: 'SATTELKAMMER',
  judgeComment: 'RICHTERSPRUCH',
  distance: 'DISTANZ',
  coinsEarned: 'GESAMMELTE STERNE',
  world: 'WELT',
  total: 'gesamt',
  again: 'NOCHMAL',
  back: 'ZURÜCK',
  menu: 'HAUPTMENÜ',
  paused: 'PAUSIERT',
  pauseHint: 'ESC zum Fortsetzen · M für Menü',
  upgrades: 'UPGRADES',
  horses: 'PFERDE',
  owned: 'BESITZT',
  selected: 'GEWÄHLT',
  select: 'WÄHLEN',
  hint: 'LEERTASTE = SPRINGEN · UNTEN = DUCKEN · ESC = PAUSE',
  hintMobile: 'OBEN TIPPEN: SPRINGEN · UNTEN HALTEN: DUCKEN',
  alreadyOwn: 'Das besitzt du bereits. Geht es dir gut?',
  selectComment: (name) => `${name}. Eine Wahl. Mal sehen, ob du ihr gerecht wirst.`,
  hp: 'HP',
  styleX: 'STIL',
  turbo: 'TURBO',
  magnet: 'MAGNET',
  shieldGained: '+SCHILD',
};
