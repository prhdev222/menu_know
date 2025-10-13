# 🔐 Environment Variables Guide

คู่มือการตั้งค่า Environment Variables สำหรับ Vercel แบบละเอียด

## ตัวแปรที่ต้องตั้งค่า (ทั้งหมด 3 ตัว)

### 1. SUPABASE_URL

**คืออะไร:** URL ของโปรเจค Supabase ของคุณ

**รูปแบบ:** `https://[project-id].supabase.co`

**ตัวอย่าง:** `https://abcdefghijk.supabase.co`

**หาจากที่ไหน:**
1. เข้า [Supabase Dashboard](https://supabase.com/dashboard)
2. เลือก Project ของคุณ
3. ไปที่ Settings (เฟืองด้านล่างซ้าย)
4. คลิก API
5. คัดลอก **Project URL**

```
Supabase Dashboard
└── Settings
    └── API
        └── Project URL: https://xxx.supabase.co  ← คัดลอกตรงนี้
```

---

### 2. SUPABASE_ANON_KEY

**คืออะไร:** API Key สำหรับเข้าถึง Supabase (public/anonymous key)

**รูปแบบ:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (string ยาวมาก)

**ตัวอย่าง:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBh...`

**หาจากที่ไหน:**
1. เข้า [Supabase Dashboard](https://supabase.com/dashboard)
2. เลือก Project ของคุณ
3. ไปที่ Settings → API
4. คัดลอก **anon/public key** (ไม่ใช่ service_role key!)

```
Supabase Dashboard
└── Settings
    └── API
        └── Project API keys
            ├── anon/public: eyJhbGc...  ← คัดลอกตรงนี้ (public key)
            └── service_role: eyJhbGc... ← ⚠️ ห้ามใช้ตัวนี้!
```

⚠️ **คำเตือน:** ห้ามใช้ `service_role` key เพราะมีสิทธิ์เข้าถึงข้อมูลแบบ full access!

---

### 3. ADMIN_PASSWORD

**คืออะไร:** รหัสผ่านสำหรับเข้าสู่ระบบหน้า Admin Panel

**รูปแบบ:** ตั้งเป็นอะไรก็ได้ที่คุณต้องการ

**ตัวอย่าง:** 
- ✅ `MySecureP@ssw0rd2024`
- ✅ `health_admin_2024!`
- ❌ อย่าใช้รหัสง่าย ๆ!

**แนะนำ:**
- ใช้อย่างน้อย 12 ตัวอักษร
- ผสมตัวพิมพ์ใหญ่-เล็ก, ตัวเลข, อักขระพิเศษ
- อย่าใช้รหัสเดียวกับที่อื่น

---

## วิธีตั้งค่าบน Vercel

### วิธีที่ 1: ตอน Deploy (แนะนำ)

1. **เข้า Vercel Dashboard** → คลิก "New Project"

2. **Import Repository** → เลือก repo ของคุณ

3. **ก่อนกด Deploy** → กรอก Environment Variables:

```
┌─────────────────────────────────────────────────┐
│ Environment Variables                            │
├─────────────────────────────────────────────────┤
│                                                  │
│ Key: SUPABASE_URL                               │
│ Value: https://abcdefghijk.supabase.co          │
│ Environment: ☑ Production ☑ Preview ☑ Development│
│                                                  │
│ [+ Add Another]                                 │
│                                                  │
│ Key: SUPABASE_ANON_KEY                          │
│ Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  │
│ Environment: ☑ Production ☑ Preview ☑ Development│
│                                                  │
│ [+ Add Another]                                 │
│                                                  │
│ Key: ADMIN_PASSWORD                              │
│ Value: MySecurePassword123!                      │
│ Environment: ☑ Production ☑ Preview ☑ Development│
│                                                  │
└─────────────────────────────────────────────────┘
```

4. **กด Deploy** 🚀

---

### วิธีที่ 2: หลัง Deploy แล้ว

1. **เข้า Vercel Dashboard** → เลือก Project ของคุณ

2. **ไปที่ Settings** → เลือก **Environment Variables**

3. **เพิ่มตัวแปรทีละตัว:**

```
Name: SUPABASE_URL
Value: https://abcdefghijk.supabase.co
Environment: Production, Preview, Development
[Save]

Name: SUPABASE_ANON_KEY
Value: eyJhbGc...
Environment: Production, Preview, Development
[Save]

Name: ADMIN_PASSWORD
Value: MySecurePassword123!
Environment: Production, Preview, Development
[Save]
```

4. **Redeploy** → ไปที่ Deployments → คลิก ... → Redeploy

---

### วิธีที่ 3: ใช้ Vercel CLI

```bash
# เพิ่มทีละตัว (Production)
vercel env add SUPABASE_URL production
# จะถามให้ใส่ค่า → ใส่: https://xxx.supabase.co

vercel env add SUPABASE_ANON_KEY production
# จะถามให้ใส่ค่า → ใส่: eyJhbGc...

vercel env add ADMIN_PASSWORD production
# จะถามให้ใส่ค่า → ใส่: your-password

# ถ้าต้องการให้มีทุก environment (production, preview, development)
vercel env pull .env.local
```

---

## ตรวจสอบว่าตั้งค่าถูกต้อง

### ใน Vercel Dashboard

```
Settings → Environment Variables

✅ ควรเห็น:
┌────────────────────────────┬─────────────────┐
│ Name                       │ Environments    │
├────────────────────────────┼─────────────────┤
│ SUPABASE_URL              │ PRD, PRV, DEV   │
│ SUPABASE_ANON_KEY         │ PRD, PRV, DEV   │
│ ADMIN_PASSWORD            │ PRD, PRV, DEV   │
└────────────────────────────┴─────────────────┘

PRD = Production
PRV = Preview
DEV = Development
```

### หลัง Deploy

1. **เปิดเว็บไซต์** → https://your-project.vercel.app

2. **เปิด Browser Console** (F12)

3. **ตรวจสอบ:**
   - ❌ ถ้าเห็น `"Supabase not configured"` → Environment Variables ยังไม่ถูกต้อง
   - ✅ ถ้าไม่มี error → ตั้งค่าถูกต้อง!

4. **ทดสอบ Admin:**
   - คลิก "ผู้ดูแลระบบ"
   - ใส่รหัสผ่านที่ตั้งใน `ADMIN_PASSWORD`
   - ✅ เข้าได้ → สำเร็จ!

---

## การแก้ไข Environment Variables

### เปลี่ยนค่าตัวแปร

1. Vercel Dashboard → Settings → Environment Variables
2. คลิก **Edit** ที่ตัวแปรที่ต้องการเปลี่ยน
3. ใส่ค่าใหม่ → Save
4. **Redeploy** → Deployments → ... → Redeploy

⚠️ **สำคัญ:** ต้อง Redeploy ทุกครั้งที่แก้ไข Environment Variables!

### ลบตัวแปร

1. Vercel Dashboard → Settings → Environment Variables
2. คลิก **Delete** ที่ตัวแปรที่ต้องการลบ
3. ยืนยัน

---

## Environments ต่างกันยังไง?

```
Production (PRD)
├── URL: https://your-project.vercel.app
├── Deploy from: main branch
└── ใช้: SUPABASE_URL, SUPABASE_ANON_KEY, ADMIN_PASSWORD

Preview (PRV)
├── URL: https://your-project-git-feature-branch.vercel.app
├── Deploy from: feature branches, pull requests
└── ใช้: SUPABASE_URL, SUPABASE_ANON_KEY, ADMIN_PASSWORD
    (สามารถตั้งค่าต่างจาก Production ได้)

Development (DEV)
├── ใช้เมื่อ: vercel dev (รันบนเครื่อง)
└── ใช้: SUPABASE_URL, SUPABASE_ANON_KEY, ADMIN_PASSWORD
    (ดึงจาก .env.local)
```

**แนะนำ:**
- ตั้งค่าให้ครบทุก environment (Production, Preview, Development)
- Preview และ Development อาจใช้ Supabase project แยก (test database)

---

## การแก้ปัญหา

### ❌ Error: "Supabase not configured"

**สาเหตุ:** ไม่มี Environment Variables หรือตั้งค่าผิด

**แก้ไข:**
1. ตรวจสอบว่ามี `SUPABASE_URL` และ `SUPABASE_ANON_KEY`
2. ตรวจสอบว่าค่าถูกต้อง (ไม่มี space, ไม่มีอักขระแปลก)
3. Redeploy

---

### ❌ Error: "Invalid API key"

**สาเหตุ:** `SUPABASE_ANON_KEY` ผิด

**แก้ไข:**
1. ตรวจสอบว่าคัดลอก key ครบถ้วน (key ยาวมาก!)
2. ตรวจสอบว่าใช้ `anon` key ไม่ใช่ `service_role` key
3. ลองสร้าง key ใหม่ใน Supabase

---

### ❌ ไม่สามารถ login Admin ได้

**สาเหตุ:** `ADMIN_PASSWORD` ไม่ตรง

**แก้ไข:**
1. ตรวจสอบว่า `ADMIN_PASSWORD` ตั้งค่าแล้ว
2. ใส่รหัสผ่านให้ตรงกับที่ตั้ง (ระวัง case sensitive!)
3. ถ้าลืมรหัส → แก้ไข Environment Variable → Redeploy

---

## Best Practices 🏆

### ความปลอดภัย

✅ **ควรทำ:**
- ใช้รหัสผ่าน Admin ที่แข็งแรง
- เปลี่ยนรหัสเป็นระยะ
- ใช้ Supabase `anon` key เท่านั้น
- เปิด Supabase RLS (Row Level Security)

❌ **ไม่ควรทำ:**
- แชร์ Environment Variables ให้คนอื่น
- Commit ไฟล์ที่มี API keys
- ใช้ `service_role` key
- ใช้รหัสผ่านง่าย ๆ

### การทำงานเป็นทีม

```
Production Environment
├── SUPABASE_URL: Production Database
├── SUPABASE_ANON_KEY: Production Key
└── ADMIN_PASSWORD: รหัสที่แชร์ในทีม (ปลอดภัย)

Preview Environment (แนะนำ)
├── SUPABASE_URL: Test/Staging Database
├── SUPABASE_ANON_KEY: Test Key
└── ADMIN_PASSWORD: test123 (สำหรับทดสอบ)
```

---

## สรุป Quick Reference

```bash
# ตัวแปรที่ต้องมี
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
ADMIN_PASSWORD=your-secure-password

# หาค่าได้จากไหน
SUPABASE_URL → Supabase Dashboard → Settings → API → Project URL
SUPABASE_ANON_KEY → Supabase Dashboard → Settings → API → anon key
ADMIN_PASSWORD → ตั้งเอง

# ตั้งค่าที่ไหน
Vercel Dashboard → Project → Settings → Environment Variables

# ตั้งค่าเมื่อไหร่
ก่อน Deploy หรือ หลัง Deploy แล้ว (ต้อง Redeploy)
```

---

มีปัญหา? กลับไปดู [DEPLOYMENT.md](./DEPLOYMENT.md) หรือ [QUICKSTART.md](./QUICKSTART.md)




