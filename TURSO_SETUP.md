# ใช้ Turso เป็น Database

โปรเจกต์นี้รองรับ **Turso** (libSQL/SQLite แบบ edge) เป็นทางเลือกแทน Supabase

## ขั้นตอน

### 1. สร้างฐานข้อมูล Turso

- ลงทะเบียนที่ [turso.tech](https://turso.tech) และติดตั้ง Turso CLI
- สร้าง DB และรับ URL + Auth Token:

```bash
turso db create menu-know
turso db show menu-know --url
turso db tokens create menu-know
```

### 2. สร้างตารางและข้อมูลเริ่มต้น

รัน SQL ใน Turso:

```bash
turso db shell menu-know < turso_setup.sql
```

หรือคัดลอกเนื้อหาใน `turso_setup.sql` ไปวางใน Turso Dashboard → SQL Editor

### 3. ตั้งค่า Environment

ใน **.env.local** (local) หรือ **Vercel → Settings → Environment Variables**:

```env
# ใส่เฉพาะสองตัวนี้ ระบบจะใช้ Turso แทน Supabase
TURSO_DATABASE_URL=https://menu-know-your-username.turso.io
TURSO_AUTH_TOKEN=your-token-from-step-1
```

ถ้า**ไม่ใส่** `TURSO_DATABASE_URL` ระบบจะใช้ Supabase ตามเดิม (SUPABASE_URL + SUPABASE_ANON_KEY)

### 4. ติดตั้ง dependency

```bash
npm install
```

### 5. รันโปรเจกต์

```bash
npm run dev
```

หรือ deploy ขึ้น Vercel แล้วตั้งค่า `TURSO_DATABASE_URL` และ `TURSO_AUTH_TOKEN` ใน Vercel

---

**หมายเหตุ:** โครงสร้างตาราง `health_links` ใช้แบบเดียวกับ Supabase (ดู `turso_setup.sql`) หากย้ายข้อมูลจาก Supabase ไป Turso ให้ export เป็น CSV/JSON แล้ว INSERT ตามโครงสร้างใน `turso_setup.sql`
