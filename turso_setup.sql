-- ========================================
-- SQL Setup for Turso (libSQL/SQLite)
-- พระสุขภาพดี - health_links
-- ========================================
-- รันผ่าน Turso CLI: turso db shell <database-name> < turso_setup.sql
-- หรือใช้ Turso Dashboard → SQL Editor

-- 1. สร้างตาราง health_links (สอดคล้องกับ Supabase)
CREATE TABLE IF NOT EXISTS health_links (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    description TEXT,
    category TEXT,
    icon TEXT,
    clicks INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
);

-- 2. Index
CREATE INDEX IF NOT EXISTS idx_health_links_category ON health_links(category);
CREATE INDEX IF NOT EXISTS idx_health_links_created_at ON health_links(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_health_links_clicks ON health_links(clicks DESC);

-- 3. ข้อมูลตัวอย่าง (รันครั้งเดียว)
INSERT OR IGNORE INTO health_links (id, title, url, description, category, icon, clicks) VALUES
(1728567890000, 'โรงพยาบาลศิริราช', 'https://www.si.mahidol.ac.th', 'ข้อมูลทางการแพทย์และบริการสุขภาพครบวงจรจากโรงพยาบาลชั้นนำของประเทศ', 'ทั่วไป', 'fa-hospital', 0),
(1728567890001, 'กรมการแพทย์', 'https://www.dmth.moph.go.th', 'ข้อมูลสุขภาพและบริการทางการแพทย์จากกระทรวงสาธารณสุข', 'ทั่วไป', 'fa-stethoscope', 0),
(1728567890002, 'กรมอนามัย', 'https://anamai.moph.go.th', 'ข้อมูลด้านการส่งเสริมสุขภาพและอนามัย', 'ทั่วไป', 'fa-heart', 0),
(1728567890003, 'สถาบันสุขภาพจิตเด็กและวัยรุ่นราชนครินทร์', 'https://www.rcmh.go.th', 'ข้อมูลและบริการด้านสุขภาพจิตสำหรับเด็กและวัยรุ่น', 'จิตใจ', 'fa-brain', 0),
(1728567890004, 'สำนักงานป้องกันควบคุมโรคที่ 1-12', 'https://ddc.moph.go.th', 'ข้อมูลการป้องกันและควบคุมโรคต่างๆ', 'โรค', 'fa-shield-virus', 0);

-- 4. ตรวจสอบ
SELECT COUNT(*) AS total_records FROM health_links;
SELECT * FROM health_links ORDER BY created_at DESC LIMIT 5;
