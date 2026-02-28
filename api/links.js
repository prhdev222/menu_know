// เลือก DB ตาม env: มี TURSO_DATABASE_URL = ใช้ Turso, ไม่มี = ใช้ Supabase
const useTurso = !!process.env.TURSO_DATABASE_URL;
const supabase = useTurso ? null : require('./_supabase');
const turso = useTurso ? require('./_turso') : null;

const json = (res, status, data) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(data));
};

// Vercel Serverless Function
// GET    /api/links
// POST   /api/links
// PUT    /api/links?id=123
// DELETE /api/links?id=123

module.exports = async (req, res) => {
  try {
    if (req.method === 'GET') {
      const data = useTurso ? await turso.getAllLinks() : await supabase.supabaseRest('health_links?select=*&order=created_at.desc');
      return json(res, 200, { ok: true, data: Array.isArray(data) ? data : (data || []) });
    }

    // Read JSON body (Vercel provides req.body sometimes; keep fallback)
    const body = typeof req.body === 'object' && req.body !== null ? req.body : await readJsonBody(req);

    if (req.method === 'POST') {
      const data = useTurso ? await turso.insertLink(body) : await supabase.supabaseRest('health_links?select=*', { method: 'POST', body: [body] });
      return json(res, 200, { ok: true, data: Array.isArray(data) ? data : (data || []) });
    }

    const id = req.query && req.query.id ? String(req.query.id) : '';
    if (!id) return json(res, 400, { ok: false, error: 'Missing id' });

    if (req.method === 'PUT') {
      const data = useTurso ? await turso.updateLink(id, body) : await supabase.supabaseRest(`health_links?id=eq.${encodeURIComponent(id)}&select=*`, { method: 'PATCH', body });
      return json(res, 200, { ok: true, data: Array.isArray(data) ? data : (data || []) });
    }

    if (req.method === 'DELETE') {
      if (useTurso) await turso.deleteLink(id);
      else await supabase.supabaseRest(`health_links?id=eq.${encodeURIComponent(id)}&select=*`, { method: 'DELETE' });
      return json(res, 200, { ok: true, data: [] });
    }

    return json(res, 405, { ok: false, error: 'Method not allowed' });
  } catch (e) {
    console.error(e);
    const status = e.status || 500;
    const payload = supabase ? { ok: false, error: e.message, details: e.payload || null } : { ok: false, error: e.message };
    return json(res, status, payload);
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


