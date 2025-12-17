const { supabaseRest, json } = require('./_supabase');

// Vercel Serverless Function
// GET    /api/links
// POST   /api/links
// PUT    /api/links?id=123
// DELETE /api/links?id=123

module.exports = async (req, res) => {
  try {
    if (req.method === 'GET') {
      const data = await supabaseRest('health_links?select=*&order=created_at.desc');
      return json(res, 200, { ok: true, data });
    }

    // Read JSON body (Vercel provides req.body sometimes; keep fallback)
    const body = typeof req.body === 'object' && req.body !== null ? req.body : await readJsonBody(req);

    if (req.method === 'POST') {
      const data = await supabaseRest('health_links?select=*', {
        method: 'POST',
        body: [body],
      });
      return json(res, 200, { ok: true, data });
    }

    const id = req.query && req.query.id ? String(req.query.id) : '';
    if (!id) return json(res, 400, { ok: false, error: 'Missing id' });

    if (req.method === 'PUT') {
      const data = await supabaseRest(`health_links?id=eq.${encodeURIComponent(id)}&select=*`, {
        method: 'PATCH',
        body,
      });
      return json(res, 200, { ok: true, data });
    }

    if (req.method === 'DELETE') {
      const data = await supabaseRest(`health_links?id=eq.${encodeURIComponent(id)}&select=*`, {
        method: 'DELETE',
      });
      return json(res, 200, { ok: true, data });
    }

    return json(res, 405, { ok: false, error: 'Method not allowed' });
  } catch (e) {
    console.error(e);
    return json(res, e.status || 500, { ok: false, error: e.message, details: e.payload || null });
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


