# Deploy ขึ้น Vercel ผ่าน GitHub

## 1. ส่งโค้ดขึ้น GitHub

ถ้ายังไม่มี repo บน GitHub:

```bash
cd c:\Users\urare\OneDrive\Desktop\MENU_Know
git init
git add .
git commit -m "Initial commit"
```

ไปที่ [github.com/new](https://github.com/new) สร้าง repo ใหม่ (เช่น `MENU_Know`) แล้วรัน:

```bash
git remote add origin https://github.com<username>/MENU_Know.git
git branch -M main
git push -u origin main
```

ถ้ามี repo อยู่แล้ว แค่ push ล่าสุด:

```bash
git add .
git commit -m "Update"
git push
```

---

## 2. เชื่อม GitHub กับ Vercel

1. เปิด **[vercel.com](https://vercel.com)** → ล็อกอิน (เลือก **Continue with GitHub**)
2. กด **Add New...** → **Project**
3. เลือก repo **MENU_Know** (หรือชื่อที่สร้างไว้) → **Import**
4. หน้า Configure:
   - **Framework Preset:** Other
   - **Root Directory:** . (เว้นว่างหรือใส่ `.`)
   - **Build Command:** `npm run build` (ใช้ค่าเดิมได้)
   - **Output Directory:** `.` (ใช้ค่าเดิมได้)
   - กด **Deploy** ได้เลย (จะ deploy ครั้งแรกก่อน)

---

## 3. ตั้งค่า Environment Variables

หลัง deploy เสร็จ (หรือก่อน Deploy):

1. เข้าโปรเจกต์ → **Settings** → **Environment Variables**
2. เพิ่มทีละตัว:

| Name | Value |
|------|--------|
| `TURSO_DATABASE_URL` | คัดจาก .env.local (libsql://...) |
| `TURSO_AUTH_TOKEN` | คัดจาก .env.local |
| `ADMIN_PASSWORD` | รหัสผ่านแอดมินที่ต้องการใช้บน production |

3. เลือก **Production** (และ **Preview** ถ้าต้องการ)
4. กด **Save**

---

## 4. Redeploy ให้โหลด env ใหม่

หลังเพิ่ม/แก้ env:

1. ไปที่ **Deployments**
2. กด **⋯** ที่ deployment ล่าสุด → **Redeploy** → **Redeploy**

---

## 5. เปิดเว็บ

หลัง deploy สำเร็จ Vercel จะให้ URL เช่น `https://menu-know-xxx.vercel.app`  
ใช้ลิงก์นี้เป็นเว็บหลัก หรือต่อกับโดเมนใน **Settings → Domains**

---

## สรุป

- **Push ขึ้น GitHub** → Vercel จะ deploy อัตโนมัติ (ถ้าเชื่อม repo ไว้แล้ว)
- **รหัส admin / ค่า Turso** ใส่ใน Vercel → Settings → Environment Variables เท่านั้น **อย่า push .env.local ขึ้น GitHub**
