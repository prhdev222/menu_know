# ⚡ Vercel Environment Variables - คู่มือด่วน

## 🎯 การตั้งค่า Environment Variables บน Vercel

### ขั้นตอนที่ 1: เข้า Vercel Dashboard

```
1. ไปที่ https://vercel.com/dashboard
2. เลือกโปรเจกต์ของคุณ
3. คลิก "Settings" (บนเมนูบน)
4. คลิก "Environment Variables" (เมนูซ้าย)
```

---

### ขั้นตอนที่ 2: เพิ่มตัวแปร

#### ตัวแปรที่ 1: SUPABASE_URL

```
┌──────────────────────────────────────────────┐
│ Add New Environment Variable                 │
├──────────────────────────────────────────────┤
│ Name (required)                              │
│ ┌──────────────────────────────────────────┐ │
│ │ SUPABASE_URL                             │ │
│ └──────────────────────────────────────────┘ │
│                                              │
│ Value (required)                             │
│ ┌──────────────────────────────────────────┐ │
│ │ https://xxxxx.supabase.co                │ │
│ └──────────────────────────────────────────┘ │
│                                              │
│ Environments                                 │
│ ☑ Production                                 │
│ ☑ Preview                                    │
│ ☑ Development                                │
│                                              │
│ [Add]  [Cancel]                              │
└──────────────────────────────────────────────┘
```

#### ตัวแปรที่ 2: SUPABASE_ANON_KEY

```
┌──────────────────────────────────────────────┐
│ Add New Environment Variable                 │
├──────────────────────────────────────────────┤
│ Name (required)                              │
│ ┌──────────────────────────────────────────┐ │
│ │ SUPABASE_ANON_KEY                        │ │
│ └──────────────────────────────────────────┘ │
│                                              │
│ Value (required)                             │
│ ┌──────────────────────────────────────────┐ │
│ │ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... │ │
│ └──────────────────────────────────────────┘ │
│                                              │
│ Environments                                 │
│ ☑ Production                                 │
│ ☑ Preview                                    │
│ ☑ Development                                │
│                                              │
│ [Add]  [Cancel]                              │
└──────────────────────────────────────────────┘
```

#### ตัวแปรที่ 3: ADMIN_PASSWORD

```
┌──────────────────────────────────────────────┐
│ Add New Environment Variable                 │
├──────────────────────────────────────────────┤
│ Name (required)                              │
│ ┌──────────────────────────────────────────┐ │
│ │ ADMIN_PASSWORD                           │ │
│ └──────────────────────────────────────────┘ │
│                                              │
│ Value (required)                             │
│ ┌──────────────────────────────────────────┐ │
│ │ MyStr0ng!P@ssw0rd#2024                   │ │
│ └──────────────────────────────────────────┘ │
│                                              │
│ Environments                                 │
│ ☑ Production                                 │
│ ☑ Preview                                    │
│ ☑ Development                                │
│                                              │
│ [Add]  [Cancel]                              │
└──────────────────────────────────────────────┘
```

---

### ขั้นตอนที่ 3: Redeploy

หลังจากเพิ่มตัวแปรครบแล้ว:

```
1. ไปที่ "Deployments" (บนเมนูบน)
2. คลิก "..." บน deployment ล่าสุด
3. เลือก "Redeploy"
4. รอสักครู่
5. ✅ เสร็จ!
```

---

## 📋 Checklist

- [ ] เพิ่ม `SUPABASE_URL`
- [ ] เพิ่ม `SUPABASE_ANON_KEY`
- [ ] เพิ่ม `ADMIN_PASSWORD`
- [ ] เลือก Environment ทั้ง 3 (Production, Preview, Development)
- [ ] Redeploy
- [ ] ทดสอบเว็บ
- [ ] ทดสอบ admin.html

---

## 🔍 หาค่า Supabase

### 1. Supabase URL
```
1. เข้า https://supabase.com/dashboard
2. เลือกโปรเจกต์
3. Settings → API
4. คัดลอก "Project URL"
   
ตัวอย่าง:
https://abcdefghij.supabase.co
```

### 2. Supabase Anon Key
```
1. อยู่หน้าเดียวกับ URL
2. คัดลอก "anon/public"
   
ตัวอย่าง:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWoiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY5MDAwMDAwMCwiZXhwIjoyMDA1NTc2MDAwfQ.xxxxxxxxxxxxxxxxxxxxx
```

---

## 🛠️ Troubleshooting

### ❓ ตั้งค่าแล้วแต่ไม่ทำงาน
```
✅ แก้ไข:
1. ตรวจสอบว่าเลือก Environment ครบทั้ง 3
2. Redeploy ใหม่
3. เคลียร์ cache เบราว์เซอร์
```

### ❓ Supabase connection error
```
✅ แก้ไข:
1. ตรวจสอบ URL และ Key ว่าถูกต้อง
2. ตรวจสอบว่าไม่มีช่องว่างหน้า-หลัง
3. ตรวจสอบว่าสร้าง table health_links แล้ว
```

### ❓ Admin login ไม่ได้
```
✅ แก้ไข:
1. ตรวจสอบ ADMIN_PASSWORD ใน Vercel
2. เปิด Console (F12) ดู error
3. Redeploy
```

---

## 📚 เอกสารเพิ่มเติม

- [ENV_SETUP.md](./ENV_SETUP.md) - คู่มือฉบับเต็ม
- [Vercel Docs](https://vercel.com/docs/environment-variables)

---

**เวอร์ชัน:** 2.0 (Supabase Only)  
**อัปเดต:** 2025

