# 🚀 Deploy ไปยัง Vercel ใน 5 นาที

## ขั้นตอนย่อ (สำหรับคนรีบ!)

### 1️⃣ Push ขึ้น GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git push
```

### 2️⃣ เข้า Vercel
- ไปที่ https://vercel.com
- Login ด้วย GitHub
- คลิก "New Project"
- เลือก repository ของคุณ

### 3️⃣ เพิ่ม Environment Variables (⚠️ สำคัญ!)

คลิก "Environment Variables" และเพิ่ม:

```
SUPABASE_URL = https://xxx.supabase.co
SUPABASE_ANON_KEY = eyJhbGc...
ADMIN_PASSWORD = your-password
```

### 4️⃣ กด Deploy!

รอ 1-2 นาที → เสร็จ! 🎉

---

## ต้องการคำอธิบายละเอียด?
อ่านใน [DEPLOYMENT.md](./DEPLOYMENT.md)

## ติดปัญหา?
ตรวจสอบ:
- ✅ มี Environment Variables ครบ 3 ตัว?
- ✅ Supabase มีตาราง `health_links` แล้ว?
- ✅ Config ถูกต้อง?

ดูวิธีแก้ไขใน [DEPLOYMENT.md](./DEPLOYMENT.md)


