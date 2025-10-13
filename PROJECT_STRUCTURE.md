# 📁 โครงสร้างโปรเจค

## ไฟล์หลัก

```
MENU_Know/
│
├── 🌐 index.html                 # หน้าเว็บหลัก
│
├── ⚙️ config.js                  # ⚠️ Configuration (ห้าม commit!)
├── 📋 config.example.js          # ตัวอย่าง config สำหรับทีม
│
├── 📦 package.json               # Node.js dependencies
├── 🔧 vercel.json                # Vercel configuration
├── 🛠️ generate-config.js         # สร้าง config.js จาก env vars
│
├── 🚫 .gitignore                 # ไฟล์ที่ไม่ต้อง commit
├── 🚫 .vercelignore              # ไฟล์ที่ไม่ต้อง deploy
│
└── 📚 เอกสาร
    ├── README.md                 # คู่มือหลัก
    ├── QUICKSTART.md             # Deploy เร็ว 5 นาที
    ├── DEPLOYMENT.md             # คู่มือ Deploy แบบละเอียด
    └── PROJECT_STRUCTURE.md      # ไฟล์นี้
```

## รายละเอียดแต่ละไฟล์

### 🌐 index.html
- หน้าเว็บหลักของแอปพลิเคชัน
- โหลด `config.js` เพื่อเชื่อมต่อ Supabase และตั้งค่า admin password
- ใช้ Tailwind CSS และ Font Awesome
- มีระบบ Admin Panel สำหรับจัดการข้อมูล

### ⚙️ config.js (⚠️ ห้าม commit!)
```javascript
const CONFIG = {
    SUPABASE_URL: 'https://xxx.supabase.co',
    SUPABASE_ANON_KEY: 'eyJhbGc...',
    ADMIN_PASSWORD: 'your-password'
};
```
- เก็บข้อมูลที่เป็นความลับ
- ถูก ignore โดย `.gitignore`
- บนเครื่อง local: คัดลอกจาก `config.example.js`
- บน Vercel: สร้างอัตโนมัติจาก Environment Variables

### 📋 config.example.js
- ไฟล์ตัวอย่างสำหรับทีม
- แชร์ผ่าน Git ได้
- มี placeholder values และคำอธิบาย

### 🛠️ generate-config.js
```javascript
// สร้าง config.js จาก process.env
const configContent = `
const CONFIG = {
    SUPABASE_URL: '${process.env.SUPABASE_URL}',
    ...
};`;
fs.writeFileSync('config.js', configContent);
```
- รันเมื่อ build บน Vercel
- อ่าน Environment Variables จาก Vercel
- สร้างไฟล์ `config.js` ใหม่

### 🔧 vercel.json
```json
{
  "buildCommand": "node generate-config.js",
  "outputDirectory": "."
}
```
- บอก Vercel ว่าต้องรัน `generate-config.js` ก่อน deploy
- กำหนด output directory

### 📦 package.json
```json
{
  "scripts": {
    "build": "node generate-config.js"
  }
}
```
- กำหนด build script
- ไม่มี dependencies เพราะใช้ CDN

## ขั้นตอนการทำงาน

### 🏠 Local Development

```
1. คุณแก้ไข config.js (manual)
   └── ใส่ค่าจริงจาก Supabase
   
2. เปิด index.html ในเบราว์เซอร์
   └── อ่าน config.js → เชื่อมต่อ Supabase
```

### ☁️ Vercel Deployment

```
1. Push โค้ดขึ้น GitHub
   ├── config.js ไม่ถูก push (.gitignore)
   └── push เฉพาะไฟล์สาธารณะ
   
2. Vercel Build Process
   ├── อ่าน Environment Variables
   ├── รัน: node generate-config.js
   │   └── สร้าง config.js ใหม่จาก env vars
   └── deploy ทุกไฟล์ (รวม config.js ที่สร้างใหม่)
   
3. เว็บไซต์สามารถใช้งานได้
   └── index.html อ่าน config.js → เชื่อมต่อ Supabase
```

## Security Layer 🔒

```
Layer 1: .gitignore
├── config.js ไม่ถูก commit
└── ข้อมูล sensitive ไม่ขึ้น GitHub

Layer 2: Vercel Environment Variables
├── เก็บข้อมูลอย่างปลอดภัยบน Vercel
└── สร้าง config.js เฉพาะเวลา build

Layer 3: Supabase RLS (แนะนำ)
├── ควรตั้งค่า Row Level Security
└── จำกัดการเข้าถึงข้อมูลเพิ่มเติม
```

## ตัวอย่างการใช้งาน

### Setup ครั้งแรก (Local)

```bash
# 1. Clone repository
git clone https://github.com/your-username/menu-know.git
cd menu-know

# 2. สร้าง config.js
cp config.example.js config.js

# 3. แก้ไข config.js ใส่ค่าจริง
# (ใช้ text editor)

# 4. เปิด index.html
# (double click หรือใช้ live server)
```

### Deploy ไป Vercel

```bash
# 1. Push โค้ด
git add .
git commit -m "Ready to deploy"
git push

# 2. เข้า Vercel Dashboard
# - Import Project
# - ตั้งค่า Environment Variables:
#   * SUPABASE_URL
#   * SUPABASE_ANON_KEY
#   * ADMIN_PASSWORD
# - Deploy!

# 3. เว็บไซต์พร้อมใช้งาน! 🎉
```

## คำถามที่พบบ่อย

### Q: ทำไม config.js ถึงไม่ถูก commit?
**A:** เพื่อความปลอดภัย! ไฟล์นี้มี API keys และรหัสผ่าน ถ้า commit เข้า Git คนอื่นจะเห็นได้

### Q: ทำไมต้องมี config.example.js?
**A:** เป็นไฟล์ตัวอย่างสำหรับทีม เพื่อให้รู้ว่าต้องตั้งค่าอะไรบ้าง แต่ไม่มีค่าจริง

### Q: Vercel สร้าง config.js ยังไง?
**A:** Vercel รัน `generate-config.js` ซึ่งอ่าน Environment Variables แล้วสร้างไฟล์ config.js ขึ้นมาใหม่

### Q: ถ้าต้องการเปลี่ยน API key ต้องทำอย่างไร?
**A:** 
- Local: แก้ใน `config.js` โดยตรง
- Vercel: แก้ใน Settings → Environment Variables แล้ว Redeploy

### Q: ทำไมไม่ใช้ .env แทน config.js?
**A:** เพราะนี่เป็น static HTML ที่รันใน browser ไม่ใช่ Node.js จึงไม่สามารถอ่าน .env ได้โดยตรง

---

## สรุป

```
🏠 Local:        config.js (manual) → index.html
☁️  Vercel:       Environment Variables → generate-config.js → config.js → index.html
🔒 Security:     .gitignore → config.js ไม่ขึ้น Git
```

มีคำถามเพิ่มเติม? อ่านเพิ่มเติมใน [DEPLOYMENT.md](./DEPLOYMENT.md)


