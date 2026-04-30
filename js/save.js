const KEY = 'copper-riders-save-v1';

const DEFAULT = {
  coins: 0,
  bestDistance: 0,
  totalRuns: 0,
  totalCoinsEarned: 0,
  upgrades: {},   // id -> true
  horses: { starter: true }, // id -> owned
  selectedHorse: 'starter',
  achievements: {},
};

let cache = null;

export function load() {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      cache = structuredClone(DEFAULT);
      return cache;
    }
    cache = { ...structuredClone(DEFAULT), ...JSON.parse(raw) };
    return cache;
  } catch (e) {
    cache = structuredClone(DEFAULT);
    return cache;
  }
}

export function save() {
  if (!cache) return;
  try {
    localStorage.setItem(KEY, JSON.stringify(cache));
  } catch (e) { /* ignore */ }
}

export function get(key) {
  return load()[key];
}

export function set(key, value) {
  load();
  cache[key] = value;
  save();
}

export function addCoins(n) {
  load();
  cache.coins += n;
  cache.totalCoinsEarned += Math.max(0, n);
  save();
}

export function spendCoins(n) {
  load();
  if (cache.coins < n) return false;
  cache.coins -= n;
  save();
  return true;
}

export function ownsUpgrade(id) {
  return !!load().upgrades[id];
}

export function buyUpgrade(id) {
  load();
  cache.upgrades[id] = true;
  save();
}

export function ownsHorse(id) {
  return !!load().horses[id];
}

export function buyHorse(id) {
  load();
  cache.horses[id] = true;
  save();
}

export function selectHorse(id) {
  set('selectedHorse', id);
}

export function reset() {
  cache = structuredClone(DEFAULT);
  save();
}

// Run completed — record stats
export function recordRun(distance, coinsEarned) {
  load();
  cache.totalRuns += 1;
  if (distance > cache.bestDistance) cache.bestDistance = distance;
  save();
}
