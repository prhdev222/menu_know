/**
 * Turso (libSQL/SQLite) adapter สำหรับ health_links
 * ใช้เมื่อตั้งค่า TURSO_DATABASE_URL และ TURSO_AUTH_TOKEN ใน .env.local หรือ Vercel
 */
const path = require('path');
const fs = require('fs');

// โหลด .env.local เหมือน _supabase.js
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

let _client = null;

function getClient() {
  if (_client) return _client;
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url || !authToken) throw new Error('Missing env: TURSO_DATABASE_URL and TURSO_AUTH_TOKEN');
  const { createClient } = require('@libsql/client');
  _client = createClient({ url, authToken });
  return _client;
}

/** ผลลัพธ์จาก @libsql/client เป็น array of objects อยู่แล้ว */
function rowsToObjects(rs) {
  return Array.isArray(rs.rows) ? rs.rows : [];
}

async function getAllLinks() {
  const db = getClient();
  const rs = await db.execute('SELECT id, title, url, description, category, icon, clicks, created_at FROM health_links ORDER BY created_at DESC');
  return rowsToObjects(rs);
}

async function insertLink(row) {
  const db = getClient();
  const id = row.id != null ? Number(row.id) : Date.now();
  await db.execute({
    sql: `INSERT INTO health_links (id, title, url, description, category, icon, clicks, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
    args: [
      id,
      row.title || '',
      row.url || '',
      row.description ?? null,
      row.category ?? null,
      row.icon ?? null,
      row.clicks != null ? Number(row.clicks) : 0,
    ],
  });
  const rs = await db.execute({ sql: 'SELECT * FROM health_links WHERE id = ?', args: [id] });
  const rows = rowsToObjects(rs);
  return Array.isArray(rows) ? rows : [rows];
}

async function updateLink(id, row) {
  const db = getClient();
  const updates = [];
  const args = [];
  if (row.title !== undefined) { updates.push('title = ?'); args.push(row.title); }
  if (row.url !== undefined) { updates.push('url = ?'); args.push(row.url); }
  if (row.description !== undefined) { updates.push('description = ?'); args.push(row.description); }
  if (row.category !== undefined) { updates.push('category = ?'); args.push(row.category); }
  if (row.icon !== undefined) { updates.push('icon = ?'); args.push(row.icon); }
  if (row.clicks !== undefined) { updates.push('clicks = ?'); args.push(Number(row.clicks)); }
  if (updates.length === 0) {
    const rs = await db.execute({ sql: 'SELECT * FROM health_links WHERE id = ?', args: [String(id)] });
    return rowsToObjects(rs);
  }
  args.push(String(id));
  await db.execute({
    sql: `UPDATE health_links SET ${updates.join(', ')} WHERE id = ?`,
    args,
  });
  const rs = await db.execute({ sql: 'SELECT * FROM health_links WHERE id = ?', args: [String(id)] });
  return rowsToObjects(rs);
}

async function deleteLink(id) {
  const db = getClient();
  await db.execute({ sql: 'DELETE FROM health_links WHERE id = ?', args: [String(id)] });
  return [];
}

function json(res, status, data) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(data));
}

module.exports = { getAllLinks, insertLink, updateLink, deleteLink, json };
