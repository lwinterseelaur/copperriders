// Zero-dependency diagnostic endpoint. If THIS doesn't return 200 with
// the JSON below, the Functions runtime itself is broken / misconfigured.
// If this works but getScores/postScore don't, the @azure/data-tables
// dependency or storage connection is the problem.
module.exports = async function (context, req) {
  context.res = {
    status: 200,
    headers: { 'content-type': 'application/json' },
    body: {
      ok: true,
      now: new Date().toISOString(),
      node: process.version,
      hasStorageConn: Boolean(process.env.STORAGE_CONNECTION),
      storageConnLen: (process.env.STORAGE_CONNECTION || '').length,
    },
  };
};
