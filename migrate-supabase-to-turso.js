/**
 * สคริปต์ย้ายข้อมูลจาก Supabase ไป Turso (รันครั้งเดียว)
 * ใช้เมื่อ .env.local มีทั้ง SUPABASE_* และ TURSO_*
 *
 * ก่อนรัน: ต้องสร้างตารางใน Turso ก่อน (รัน turso_setup.sql)
 * รัน: node migrate-supabase-to-turso.js
 */

const path = require('path');
const fs = require('fs');

// โหลด .env.local
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split(/\r?\n/).forEach((line) => {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m && !process.env[m[1].trim()]) {
      let val = m[2].trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
      process.env[m[1].trim()] = val;
    }
  });
}

const SUPABASE_URL = (process.env.SUPABASE_URL || '').replace(/\/+$/, '');
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL;
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ ต้องมี SUPABASE_URL และ SUPABASE_ANON_KEY ใน .env.local');
  process.exit(1);
}
if (!TURSO_DATABASE_URL || !TURSO_AUTH_TOKEN) {
  console.error('❌ ต้องมี TURSO_DATABASE_URL และ TURSO_AUTH_TOKEN ใน .env.local');
  process.exit(1);
}

async function fetchFromSupabase() {
  const url = `${SUPABASE_URL}/rest/v1/health_links?select=*&order=created_at.desc`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    throw new Error(`Supabase error ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

async function main() {
  console.log('📥 ดึงข้อมูลจาก Supabase...');
  console.log('   (ถ้ายังไม่เคยรัน turso_setup.sql ใน Turso ให้รันก่อน: turso db shell <ชื่อ-db> < turso_setup.sql)\n');
  const rows = await fetchFromSupabase();
  if (!Array.isArray(rows) || rows.length === 0) {
    console.log('⚠️ ไม่มีข้อมูลใน Supabase หรือได้ array ว่าง');
    return;
  }
  console.log(`   ได้ ${rows.length} แถว`);

  const { createClient } = require('@libsql/client');
  const db = createClient({ url: TURSO_DATABASE_URL, authToken: TURSO_AUTH_TOKEN });

  console.log('📤 ใส่ข้อมูลลง Turso...');
  for (const row of rows) {
    const id = row.id != null ? Number(row.id) : Date.now();
    await db.execute({
      sql: `INSERT OR REPLACE INTO health_links (id, title, url, description, category, icon, clicks, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, COALESCE(?, datetime('now')))`,
      args: [
        id,
        row.title || '',
        row.url || '',
        row.description ?? null,
        row.category ?? null,
        row.icon ?? null,
        row.clicks != null ? Number(row.clicks) : 0,
        row.created_at || null,
      ],
    });
  }
  console.log(`✅ ย้ายครบ ${rows.length} แถวแล้ว`);
}

main().catch((e) => {
  console.error('❌', e.message);
  process.exit(1);
});
