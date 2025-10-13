# 🔐 การตั้งค่า Environment Variables

คู่มือการตั้งค่าตัวแปรสภาพแวดล้อมสำหรับโปรเจกต์พระสุขภาพดี

---

## 📋 ตัวแปรที่ต้องตั้งค่า

มี 3 ตัวแปรหลัก:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
ADMIN_PASSWORD=your-secure-password
```

---

## 🏠 การตั้งค่าสำหรับ Local Development

### วิธีที่ 1: ใช้ไฟล์ .env.local (แนะนำ) ⭐

1. **สร้างไฟล์ `.env.local`** ในโฟลเดอร์โปรเจกต์:
   ```bash
   cp env.example .env.local
   ```

2. **แก้ไขไฟล์ `.env.local`** ใส่ค่าจริง:
   ```env
   SUPABASE_URL=https://xxxxx.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ADMIN_PASSWORD=MySecureP@ssw0rd!
   ```

3. **สร้างไฟล์ config.js** จาก environment variables:
   ```bash
   node generate-config.js
   ```

4. **เปิดเว็บ**:
   ```bash
   # ใช้ Live Server หรือ
   python -m http.server 8000
   # หรือ
   npx serve .
   ```

### วิธีที่ 2: ใช้ไฟล์ config.js โดยตรง

1. **คัดลอก config.example.js**:
   ```bash
   cp config.example.js config.js
   ```

2. **แก้ไข config.js** ใส่ค่าจริง
3. **เปิดเว็บได้เลย**

> ⚠️ **คำเตือน:** ไฟล์ `config.js` และ `.env.local` อยู่ใน .gitignore แล้ว อย่า commit!

---

## ☁️ การตั้งค่าสำหรับ Vercel (Production)

### ขั้นตอนที่ 1: เตรียม Environment Variables

1. **เข้า Vercel Dashboard**: https://vercel.com/dashboard
2. **เลือกโปรเจกต์** ของคุณ
3. **Settings → Environment Variables**

### ขั้นตอนที่ 2: เพิ่มตัวแปร

เพิ่มตัวแปรทั้ง 3 ตัว:

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `SUPABASE_URL` | `https://xxxxx.supabase.co` | Production, Preview, Development |
| `SUPABASE_ANON_KEY` | `eyJhbGciOi...` | Production, Preview, Development |
| `ADMIN_PASSWORD` | `YourSecurePassword` | Production, Preview, Development |

#### ตัวอย่างการกรอก:

```
Name: SUPABASE_URL
Value: https://abcdefghij.supabase.co
Environments: ✅ Production ✅ Preview ✅ Development
```

```
Name: SUPABASE_ANON_KEY  
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWoiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY5MDAwMDAwMCwiZXhwIjoyMDA1NTc2MDAwfQ.xxxxxxxxxxxxxxxxxxxxx
Environments: ✅ Production ✅ Preview ✅ Development
```

```
Name: ADMIN_PASSWORD
Value: MyStr0ng!P@ssw0rd#2024
Environments: ✅ Production ✅ Preview ✅ Development
```

### ขั้นตอนที่ 3: Redeploy

1. **ไปที่ Deployments**
2. **คลิก "..." บน deployment ล่าสุด**
3. **เลือก "Redeploy"**
4. ✅ **เสร็จ!** ระบบจะใช้ Environment Variables ที่ตั้งไว้

---

## 🔍 หา Supabase URL และ Key

### 1. เข้า Supabase Dashboard
- ไปที่: https://supabase.com/dashboard

### 2. เลือกโปรเจกต์
- คลิกโปรเจกต์ที่ต้องการใช้

### 3. ไปที่ Settings → API
- **Project URL** → คัดลอกไปใส่ใน `SUPABASE_URL`
- **anon/public key** → คัดลอกไปใส่ใน `SUPABASE_ANON_KEY`

#### ตัวอย่าง:
```
Project URL: https://abcdefghij.supabase.co
              ↓
SUPABASE_URL=https://abcdefghij.supabase.co

anon public: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
              ↓
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🚀 การ Deploy แบบเต็ม

### ขั้นตอนการ Deploy ครั้งแรก:

1. **Push โค้ดขึ้น GitHub** (config.js จะไม่ถูก push)
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **เชื่อม Vercel กับ GitHub**
   - เข้า https://vercel.com/new
   - Import repository ของคุณ

3. **ตั้งค่า Environment Variables** (ตามขั้นตอนข้างต้น)
   - SUPABASE_URL
   - SUPABASE_ANON_KEY
   - ADMIN_PASSWORD

4. **Deploy**
   - Vercel จะรัน `node generate-config.js` อัตโนมัติ
   - สร้างไฟล์ `config.js` จาก env variables
   - Deploy เว็บ

5. **ทดสอบ**
   - เปิด URL ที่ Vercel ให้มา
   - ตรวจสอบว่าโหลดข้อมูลจาก Supabase ได้
   - ทดสอบเข้า admin.html

---

## 📦 package.json

ตรวจสอบว่ามี build script:

```json
{
  "scripts": {
    "build": "node generate-config.js"
  }
}
```

---

## 🔐 ความปลอดภัย

### ✅ ที่ควรทำ:

- ✅ ใช้ Environment Variables บน Vercel
- ✅ ใช้ไฟล์ `.env.local` สำหรับ local
- ✅ ใช้รหัสผ่านที่แข็งแรง (8+ ตัวอักษร, ผสมตัวเลข-สัญลักษณ์)
- ✅ ตรวจสอบว่า `.gitignore` มี:
  ```
  config.js
  .env
  .env.local
  .env*.local
  ```

### ❌ ที่ไม่ควรทำ:

- ❌ **อย่า** commit ไฟล์ `config.js`
- ❌ **อย่า** commit ไฟล์ `.env.local`
- ❌ **อย่า** ใช้รหัสผ่านง่ายๆ
- ❌ **อย่า** share Supabase Keys ในที่สาธารณะ

---

## 🛠️ Troubleshooting

### ปัญหา 1: ไม่มี config.js
**วิธีแก้:**
```bash
node generate-config.js
```

### ปัญหา 2: Vercel ไม่อ่าน Environment Variables
**วิธีแก้:**
1. ตรวจสอบว่าตั้งค่าครบทั้ง 3 ตัว
2. เลือก Environment ให้ถูกต้อง (Production, Preview, Development)
3. Redeploy

### ปัญหา 3: Supabase error
**วิธีแก้:**
1. ตรวจสอบ URL และ Key ว่าถูกต้อง
2. ตรวจสอบว่าสร้าง table `health_links` แล้ว
3. ตรวจสอบ RLS policies

### ปัญหา 4: Admin login ไม่ได้
**วิธีแก้:**
1. ตรวจสอบ `ADMIN_PASSWORD` ใน Vercel
2. ลอง console.log(CONFIG) ใน browser
3. Redeploy Vercel

---

## 📚 เอกสารเพิ่มเติม

- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)
- [Supabase API Keys](https://supabase.com/docs/guides/api/api-keys)
- [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md)

---

## ✅ Checklist

### Local Development
- [ ] คัดลอก `env.example` เป็น `.env.local`
- [ ] กรอกค่า Supabase URL และ Key
- [ ] กรอกรหัสผ่าน Admin
- [ ] รัน `node generate-config.js`
- [ ] ทดสอบเปิดเว็บ

### Vercel Deployment
- [ ] Push code ขึ้น GitHub
- [ ] เชื่อม Vercel กับ GitHub repo
- [ ] เพิ่ม Environment Variables ทั้ง 3 ตัว
- [ ] Deploy
- [ ] ทดสอบเว็บที่ Vercel URL
- [ ] ทดสอบเข้า admin.html

---

**สร้างโดย:** โปรเจกต์พระสุขภาพดี  
**อัปเดตล่าสุด:** 2025  
**สถานะ:** Supabase Only - No localStorage ✅

