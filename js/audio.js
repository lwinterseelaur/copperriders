// Synth-generated SFX using Web Audio API. No asset files.

let ctx = null;

function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(freq, dur, type = 'square', vol = 0.15, attack = 0.005, release = 0.05) {
  const c = getCtx();
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  osc.connect(gain);
  gain.connect(c.destination);
  const now = c.currentTime;
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(vol, now + attack);
  gain.gain.linearRampToValueAtTime(0, now + dur + release);
  osc.start(now);
  osc.stop(now + dur + release + 0.02);
}

function sweep(fStart, fEnd, dur, type = 'square', vol = 0.15) {
  const c = getCtx();
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.value = fStart;
  osc.frequency.linearRampToValueAtTime(fEnd, c.currentTime + dur);
  osc.connect(gain);
  gain.connect(c.destination);
  const now = c.currentTime;
  gain.gain.setValueAtTime(vol, now);
  gain.gain.linearRampToValueAtTime(0, now + dur);
  osc.start(now);
  osc.stop(now + dur + 0.02);
}

function noise(dur, vol = 0.1) {
  const c = getCtx();
  const buf = c.createBuffer(1, c.sampleRate * dur, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  const src = c.createBufferSource();
  src.buffer = buf;
  const gain = c.createGain();
  gain.gain.value = vol;
  src.connect(gain);
  gain.connect(c.destination);
  src.start();
}

export const sfx = {
  jump: () => sweep(420, 720, 0.12, 'square', 0.12),
  doubleJump: () => sweep(620, 920, 0.10, 'triangle', 0.13),
  duck: () => sweep(300, 180, 0.08, 'sine', 0.08),
  coin: () => { tone(880, 0.05, 'square', 0.1); setTimeout(() => tone(1320, 0.08, 'square', 0.1), 50); },
  hit: () => { sweep(180, 60, 0.25, 'sawtooth', 0.18); noise(0.15, 0.08); },
  death: () => { sweep(440, 80, 0.6, 'sawtooth', 0.18); setTimeout(() => sweep(330, 50, 0.5, 'square', 0.14), 200); },
  click: () => tone(660, 0.04, 'square', 0.08),
  buy: () => { tone(523, 0.08, 'square', 0.1); setTimeout(() => tone(659, 0.08, 'square', 0.1), 80); setTimeout(() => tone(784, 0.12, 'square', 0.1), 160); },
  reject: () => { tone(220, 0.1, 'sawtooth', 0.12); setTimeout(() => tone(165, 0.15, 'sawtooth', 0.12), 100); },
  step: () => noise(0.03, 0.04),
};
