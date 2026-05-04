// Lightweight client wrapper for the SWA managed Functions backend.
// All endpoints live under /api/ on the same origin as the static site,
// so no CORS configuration is needed.

const BASE = '/api';

export async function fetchScores({ limit = 20, signal } = {}) {
  try {
    const r = await fetch(`${BASE}/getScores?limit=${limit}`, {
      method: 'GET',
      headers: { accept: 'application/json' },
      signal,
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const data = await r.json();
    return Array.isArray(data.scores) ? data.scores : [];
  } catch (err) {
    console.warn('fetchScores failed', err);
    return [];
  }
}

export async function submitScore({ name, distance, stars, world, horseId }) {
  try {
    const r = await fetch(`${BASE}/postScore`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name, distance, stars, world, horseId }),
    });
    if (!r.ok) {
      const t = await r.text().catch(() => '');
      throw new Error(`HTTP ${r.status} ${t}`);
    }
    return await r.json();
  } catch (err) {
    console.warn('submitScore failed', err);
    return { ok: false, error: err.message };
  }
}
