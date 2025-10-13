-- ========================================
-- SQL Setup for Supabase - พระสุขภาพดี
-- ========================================
-- Copy script นี้ไปวางใน Supabase SQL Editor

-- 1. สร้างตาราง health_links
CREATE TABLE IF NOT EXISTS health_links (
    id BIGINT PRIMARY KEY,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    description TEXT,
    category TEXT,
    icon TEXT,
    clicks INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. เพิ่ม Index เพื่อเพิ่มความเร็ว
CREATE INDEX IF NOT EXISTS idx_health_links_category ON health_links(category);
CREATE INDEX IF NOT EXISTS idx_health_links_created_at ON health_links(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_health_links_clicks ON health_links(clicks DESC);

-- 3. เปิด Row Level Security (RLS)
ALTER TABLE health_links ENABLE ROW LEVEL SECURITY;

-- 4. สร้าง RLS Policies

-- Policy: อ่านได้ทุกคน
DROP POLICY IF EXISTS "Allow public read access" ON health_links;
CREATE POLICY "Allow public read access"
ON health_links
FOR SELECT
TO public
USING (true);

-- Policy: เพิ่มข้อมูลได้
DROP POLICY IF EXISTS "Allow public insert" ON health_links;
CREATE POLICY "Allow public insert"
ON health_links
FOR INSERT
TO public
WITH CHECK (true);

-- Policy: แก้ไขข้อมูลได้
DROP POLICY IF EXISTS "Allow public update" ON health_links;
CREATE POLICY "Allow public update"
ON health_links
FOR UPDATE
TO public
USING (true);

-- Policy: ลบข้อมูลได้
DROP POLICY IF EXISTS "Allow public delete" ON health_links;
CREATE POLICY "Allow public delete"
ON health_links
FOR DELETE
TO public
USING (true);

-- 5. เพิ่มข้อมูลตัวอย่าง
INSERT INTO health_links (id, title, url, description, category, icon, clicks) VALUES
(1728567890000, 'โรงพยาบาลศิริราช', 'https://www.si.mahidol.ac.th', 'ข้อมูลทางการแพทย์และบริการสุขภาพครบวงจรจากโรงพยาบาลชั้นนำของประเทศ', 'ทั่วไป', 'fa-hospital', 0),
(1728567890001, 'กรมการแพทย์', 'https://www.dmth.moph.go.th', 'ข้อมูลสุขภาพและบริการทางการแพทย์จากกระทรวงสาธารณสุข', 'ทั่วไป', 'fa-stethoscope', 0),
(1728567890002, 'กรมอนามัย', 'https://anamai.moph.go.th', 'ข้อมูลด้านการส่งเสริมสุขภาพและอนามัย', 'ทั่วไป', 'fa-heart', 0),
(1728567890003, 'สถาบันสุขภาพจิตเด็กและวัยรุ่นราชนครินทร์', 'https://www.rcmh.go.th', 'ข้อมูลและบริการด้านสุขภาพจิตสำหรับเด็กและวัยรุ่น', 'จิตใจ', 'fa-brain', 0),
(1728567890004, 'สำนักงานป้องกันควบคุมโรคที่ 1-12', 'https://ddc.moph.go.th', 'ข้อมูลการป้องกันและควบคุมโรคต่างๆ', 'โรค', 'fa-shield-virus', 0)
ON CONFLICT (id) DO NOTHING;

-- 6. ตรวจสอบข้อมูล
SELECT COUNT(*) as total_records FROM health_links;
SELECT * FROM health_links ORDER BY created_at DESC LIMIT 5;

-- ✅ เสร็จสิ้น! ตารางพร้อมใช้งาน


