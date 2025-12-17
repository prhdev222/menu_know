const { json, getEnv } = require('./_supabase');

// POST /api/admin-login  { password: "..." }
module.exports = async (req, res) => {
  if (req.method !== 'POST') return json(res, 405, { ok: false, error: 'Method not allowed' });

  try {
    const body = typeof req.body === 'object' && req.body !== null ? req.body : await readJsonBody(req);
    const password = String(body.password || '');
    const expected = getEnv('ADMIN_PASSWORD');

    if (!password) return json(res, 400, { ok: false, error: 'Missing password' });
    if (password !== expected) return json(res, 401, { ok: false, error: 'Invalid password' });

    // Minimal token (client just stores "ok" flag). No secret is shipped to client.
    return json(res, 200, { ok: true });
  } catch (e) {
    console.error(e);
    return json(res, 500, { ok: false, error: 'Server error' });
  }
};

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => (raw += chunk));
    req.on('end', () => {
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}


