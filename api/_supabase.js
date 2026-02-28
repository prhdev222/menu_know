// โหลด .env.local เมื่อรัน local (vercel dev) เพื่อให้ process.env มีค่า
const path = require('path');
const fs = require('fs');
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  try {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split(/\r?\n/).forEach((line) => {
      const m = line.match(/^([^#=]+)=(.*)$/);
      if (m && !process.env[m[1].trim()]) {
        let val = m[2].trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
        process.env[m[1].trim()] = val;
      }
    });
  } catch (e) { /* ignore */ }
}

function getEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

function getSupabaseConfig() {
  const url = getEnv('SUPABASE_URL').replace(/\/+$/, '');
  // ใช้ SERVICE_ROLE ถ้ามี (production); ไม่งั้นใช้ ANON สำหรับ local
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  if (!serviceKey) throw new Error('Missing env: SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY');
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


