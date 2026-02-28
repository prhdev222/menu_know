/**
 * รัน turso_setup.sql บน Turso โดยไม่ต้องติดตั้ง Turso CLI
 * ใช้ .env.local (TURSO_DATABASE_URL, TURSO_AUTH_TOKEN)
 *
 * รัน: node run-turso-setup.js
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

const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL;
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;

if (!TURSO_DATABASE_URL || !TURSO_AUTH_TOKEN) {
  console.error('❌ ต้องมี TURSO_DATABASE_URL และ TURSO_AUTH_TOKEN ใน .env.local');
  process.exit(1);
}

async function main() {
  const sqlPath = path.join(__dirname, 'turso_setup.sql');
  const raw = fs.readFileSync(sqlPath, 'utf8');

  // ตัด comment และแบ่งคำสั่งด้วย ;
  const statements = raw
    .split(/\r?\n/)
    .filter((line) => !line.trim().startsWith('--') && line.trim() !== '')
    .join('\n')
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const { createClient } = require('@libsql/client');
  const db = createClient({ url: TURSO_DATABASE_URL, authToken: TURSO_AUTH_TOKEN });

  console.log('📤 รัน SQL ใน Turso...');
  for (const sql of statements) {
    if (!sql) continue;
    try {
      const rs = await db.execute(sql + ';');
      if (rs.rows && rs.rows.length > 0) {
        console.log(rs.rows);
      }
    } catch (e) {
      console.error('คำสั่งที่ error:', sql.slice(0, 60) + '...');
      throw e;
    }
  }
  console.log('✅ รัน turso_setup.sql เสร็จแล้ว (ตาราง + ข้อมูลตัวอย่างพร้อม)');
}

main().catch((e) => {
  console.error('❌', e.message);
  process.exit(1);
});
