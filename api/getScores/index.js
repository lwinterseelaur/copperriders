const { TableClient, AzureNamedKeyCredential } = require('@azure/data-tables');

const TABLE_NAME = 'highscores';
let _client = null;

function getClient() {
  if (_client) return _client;
  const conn = process.env.STORAGE_CONNECTION;
  if (!conn) throw new Error('STORAGE_CONNECTION app setting is not set');
  _client = TableClient.fromConnectionString(conn, TABLE_NAME);
  return _client;
}

module.exports = async function (context, req) {
  try {
    const client = getClient();
    try { await client.createTable(); } catch (e) { /* already exists */ }

    const limit = Math.max(1, Math.min(50, parseInt(req.query.limit, 10) || 20));

    const iter = client.listEntities({ queryOptions: { filter: `PartitionKey eq 'global'` } });
    const all = [];
    for await (const e of iter) {
      all.push({
        name: e.name || 'ANON',
        distance: Number(e.distance) || 0,
        stars: Number(e.stars) || 0,
        world: e.world || '',
        horseId: e.horseId || '',
        ts: Number(e.ts) || 0,
      });
    }
    all.sort((a, b) => b.distance - a.distance || b.stars - a.stars);
    const top = all.slice(0, limit);

    context.res = {
      status: 200,
      headers: {
        'content-type': 'application/json',
        'cache-control': 'no-cache, no-store, must-revalidate',
      },
      body: { scores: top, total: all.length },
    };
  } catch (err) {
    context.log.error('getScores failed:', err);
    // Surfacing message + name for debugging. We can re-mask later.
    context.res = {
      status: 500,
      headers: { 'content-type': 'application/json' },
      body: { error: err.message || String(err), name: err.name, stack: (err.stack || '').slice(0, 600) },
    };
  }
};
