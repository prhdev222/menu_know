# คู่มือการ Deploy ไปยัง Vercel

## ขั้นตอนการ Deploy (ง่ายมาก!) 🚀

### 1. เตรียม Repository

```bash
# สร้าง Git repository (ถ้ายังไม่มี)
git init
git add .
git commit -m "Initial commit"

# Push ขึ้น GitHub
git remote add origin https://github.com/your-username/your-repo.git
git push -u origin main
```

⚠️ **หมายเหตุ:** ไฟล์ `config.js` จะไม่ถูก push เพราะอยู่ใน `.gitignore` แล้ว

### 2. เตรียมข้อมูลที่จำเป็น

เตรียมข้อมูลเหล่านี้ให้พร้อม:
- ✅ Supabase URL (จาก Supabase Dashboard → Settings → API)
- ✅ Supabase Anon Key (จาก Supabase Dashboard → Settings → API)  
- ✅ Admin Password (รหัสผ่านที่คุณต้องการใช้)

### 3. Deploy บน Vercel

#### วิธีที่ 1: ผ่าน Vercel Dashboard (แนะนำสำหรับมือใหม่)

1. **สมัครสมาชิก/เข้าสู่ระบบ Vercel**
   - ไปที่ https://vercel.com
   - คลิก "Sign Up" และเชื่อมต่อกับ GitHub

2. **สร้าง Project ใหม่**
   - คลิก "Add New..." → "Project"
   - เลือก Repository ของคุณจากรายการ
   - คลิก "Import"

3. **ตั้งค่า Environment Variables** ⚠️ **สำคัญมาก!**
   
   ก่อนกด Deploy ให้ไปที่ "Environment Variables" และเพิ่ม:
   
   | Name | Value | Environment |
   |------|-------|-------------|
   | `SUPABASE_URL` | https://xxx.supabase.co | Production, Preview, Development |
   | `SUPABASE_ANON_KEY` | eyJhbGc... (your key) | Production, Preview, Development |
   | `ADMIN_PASSWORD` | your-secure-password | Production, Preview, Development |

4. **กด Deploy!**
   - รอสักครู่ Vercel จะ build และ deploy ให้
   - เมื่อเสร็จจะได้ URL เช่น `https://your-project.vercel.app`

#### วิธีที่ 2: ผ่าน Vercel CLI (สำหรับคนชอบใช้ Terminal)

```bash
# 1. ติดตั้ง Vercel CLI
npm install -g vercel

# 2. Login เข้า Vercel
vercel login

# 3. Deploy (ครั้งแรก)
vercel

# 4. ตั้งค่า Environment Variables
vercel env add SUPABASE_URL production
# จะถามให้ใส่ค่า: https://your-project.supabase.co

vercel env add SUPABASE_ANON_KEY production
# จะถามให้ใส่ค่า: your-anon-key

vercel env add ADMIN_PASSWORD production
# จะถามให้ใส่ค่า: your-password

# 5. Deploy ใหม่พร้อม Environment Variables
vercel --prod
```

### 4. ตรวจสอบว่า Deploy สำเร็จ

เปิด URL ที่ Vercel ให้มา แล้วตรวจสอบ:

- ✅ หน้าเว็บโหลดขึ้นมาได้
- ✅ ไม่มี error ใน Browser Console
- ✅ คลิกปุ่ม "ผู้ดูแลระบบ" และใส่รหัสผ่านเข้าได้
- ✅ ทดสอบซิงค์ข้อมูลกับ Supabase

### 5. อัปเดตเว็บไซต์ในอนาคต

```bash
# แก้ไขโค้ดตามต้องการ
git add .
git commit -m "Update features"
git push

# Vercel จะ auto-deploy ให้อัตโนมัติ! 🎉
```

## การแก้ปัญหา (Troubleshooting)

### ❌ เว็บไซต์แสดง "Supabase not configured"

**สาเหตุ:** Environment Variables ยังไม่ถูกตั้ง

**วิธีแก้:**
1. ไปที่ Vercel Dashboard → Project → Settings → Environment Variables
2. ตรวจสอบว่ามีครบ 3 ตัว: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `ADMIN_PASSWORD`
3. Redeploy: คลิก Deployments → ... → Redeploy

### ❌ ไม่สามารถซิงค์ข้อมูลได้

**สาเหตุ:** ตาราง `health_links` ยังไม่ได้สร้างใน Supabase

**วิธีแก้:**
1. เปิด Supabase Dashboard → SQL Editor
2. รันคำสั่ง SQL:
```sql
CREATE TABLE health_links (
    id BIGINT PRIMARY KEY,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    description TEXT,
    category TEXT,
    icon TEXT,
    clicks INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### ❌ รหัสผ่าน Admin ไม่ถูกต้อง

**สาเหตุ:** `ADMIN_PASSWORD` ใน Vercel ไม่ตรงกับที่พิมพ์

**วิธีแก้:**
1. ไปที่ Vercel → Settings → Environment Variables
2. แก้ไข `ADMIN_PASSWORD` ให้ถูกต้อง
3. Redeploy

## วิธีการทำงานของระบบ

```
┌─────────────────────────────────────────────┐
│  Vercel Build Process                        │
├─────────────────────────────────────────────┤
│                                              │
│  1. อ่าน Environment Variables จาก Vercel  │
│     - SUPABASE_URL                          │
│     - SUPABASE_ANON_KEY                     │
│     - ADMIN_PASSWORD                        │
│                                              │
│  2. รัน generate-config.js                  │
│     → สร้างไฟล์ config.js                   │
│                                              │
│  3. Deploy ไฟล์ทั้งหมด (รวม config.js)     │
│                                              │
│  4. ✅ เว็บไซต์พร้อมใช้งาน!                 │
│                                              │
└─────────────────────────────────────────────┘
```

## เคล็ดลับเพิ่มเติม 💡

### ใช้ Preview Deployments

Vercel จะสร้าง preview deployment อัตโนมัติสำหรับทุก branch และ PR:
- `main` branch → Production (your-project.vercel.app)
- Feature branches → Preview (your-project-git-feature.vercel.app)

### ตั้งค่า Custom Domain

1. ไปที่ Vercel → Settings → Domains
2. เพิ่ม domain ของคุณ (เช่น healthportal.com)
3. ตั้งค่า DNS ตามที่ Vercel บอก
4. ใช้ HTTPS ฟรีอัตโนมัติ! 🔒

### เปิด Analytics

1. ไปที่ Vercel → Analytics
2. เปิดการใช้งาน
3. ดูสถิติการเข้าชมเว็บไซต์

## ความปลอดภัย 🔒

✅ **ปลอดภัย:**
- Environment Variables เก็บใน Vercel อย่างปลอดภัย
- ไม่มีข้อมูล sensitive ใน Git
- รองรับ HTTPS อัตโนมัติ

⚠️ **คำเตือน:**
- อย่าแชร์ Environment Variables กับคนอื่น
- เปลี่ยนรหัสผ่าน Admin จากค่าเริ่มต้น
- ใช้ Supabase RLS (Row Level Security) เพิ่มเติม

---

หากมีปัญหาหรือคำถาม สามารถดูเพิ่มเติมได้ที่:
- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)

