const { TableClient } = require('@azure/data-tables');
const crypto = require('crypto');

const TABLE_NAME = 'highscores';
const MAX_DISTANCE = 50000;
const MAX_STARS = 100000;
const MAX_NAME_LEN = 16;
const MIN_DISTANCE_TO_RECORD = 50;

// Very basic profanity filter (anglo). Server-side last line of defense.
const SUS_WORDS = [
  'fuck', 'shit', 'bitch', 'asshole', 'cunt', 'dick', 'cock',
  'wichser', 'arschloch', 'fotze', 'schwuchtel',
  'nazi', 'hitler', 'heil',
];

let _client = null;
function getClient() {
  if (_client) return _client;
  const conn = process.env.STORAGE_CONNECTION;
  if (!conn) throw new Error('STORAGE_CONNECTION app setting is not set');
  _client = TableClient.fromConnectionString(conn, TABLE_NAME);
  return _client;
}

function sanitizeName(input) {
  if (!input || typeof input !== 'string') return 'ANON';
  let s = input.trim().slice(0, MAX_NAME_LEN);
  // Allow letters/digits/space + common European letters + a few punctuation
  s = s.replace(/[^A-Za-z0-9 äöüÄÖÜßéèêàçñ\-_.]/g, '');
  if (!s) return 'ANON';
  const lower = s.toLowerCase();
  for (const w of SUS_WORDS) {
    if (lower.includes(w)) return 'ANON';
  }
  return s;
}

function clampInt(v, lo, hi) {
  const n = Math.floor(Number(v) || 0);
  if (Number.isNaN(n)) return lo;
  return Math.max(lo, Math.min(hi, n));
}

module.exports = async function (context, req) {
  try {
    const body = req.body || {};
    const distance = clampInt(body.distance, 0, MAX_DISTANCE);
    const stars = clampInt(body.stars, 0, MAX_STARS);
    const world = String(body.world || '').slice(0, 32);
    const horseId = String(body.horseId || '').slice(0, 24);
    const name = sanitizeName(body.name);

    if (distance < MIN_DISTANCE_TO_RECORD) {
      context.res = { status: 400, body: { error: 'score below threshold' } };
      return;
    }

    const client = getClient();
    try { await client.createTable(); } catch (e) { /* already exists */ }

    const ts = Date.now();
    // Sortable rowKey: invert distance so listEntities returns top first
    const distancePart = (MAX_DISTANCE - distance).toString().padStart(8, '0');
    const tsPart = ts.toString().padStart(14, '0');
    const rand = crypto.randomBytes(3).toString('hex');
    const rowKey = `${distancePart}_${tsPart}_${rand}`;

    await client.createEntity({
      partitionKey: 'global',
      rowKey,
      name,
      distance,
      stars,
      world,
      horseId,
      ts,
    });

    context.res = {
      status: 200,
      headers: { 'content-type': 'application/json' },
      body: { ok: true, name, distance, stars, ts },
    };
  } catch (err) {
    context.log.error('postScore failed:', err);
    context.res = {
      status: 500,
      headers: { 'content-type': 'application/json' },
      body: { error: err.message || String(err), name: err.name, stack: (err.stack || '').slice(0, 600) },
    };
  }
};
