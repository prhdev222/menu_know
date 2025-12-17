function getEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

function getSupabaseConfig() {
  const url = getEnv('SUPABASE_URL').replace(/\/+$/, '');
  // IMPORTANT: keep this secret (server-side only)
  const serviceKey = getEnv('SUPABASE_SERVICE_ROLE_KEY');
  return { url, serviceKey };
}

async function supabaseRest(pathWithQuery, { method = 'GET', body } = {}) {
  const { url, serviceKey } = getSupabaseConfig();
  const endpoint = `${url}/rest/v1/${pathWithQuery.replace(/^\/+/, '')}`;

  const headers = {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
  };

  if (body !== undefined) headers['Content-Type'] = 'application/json';

  const res = await fetch(endpoint, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const text = await res.text();
  let json;
  try { json = text ? JSON.parse(text) : null; } catch { json = text; }

  if (!res.ok) {
    const err = new Error(`Supabase REST error ${res.status}`);
    err.status = res.status;
    err.payload = json;
    throw err;
  }
  return json;
}

function json(res, status, data) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(data));
}

module.exports = { supabaseRest, json, getEnv };


