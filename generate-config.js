// Script สำหรับสร้าง config.js จาก Environment Variables
// ไฟล์นี้จะถูกรันเมื่อ build บน Vercel

const fs = require('fs');
const path = require('path');

// Load .env.local if exists (for local development)
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
        line = line.trim();
        if (line && !line.startsWith('#')) {
            const [key, ...values] = line.split('=');
            if (key && values.length > 0) {
                process.env[key] = values.join('=');
            }
        }
    });
    console.log('✅ Loaded .env.local');
}

const configContent = `// Configuration File - Auto-generated from Environment Variables
const CONFIG = {
    // Supabase Configuration
    SUPABASE_URL: '${process.env.SUPABASE_URL || ''}',
    SUPABASE_ANON_KEY: '${process.env.SUPABASE_ANON_KEY || ''}',
    
    // Admin Password
    ADMIN_PASSWORD: '${process.env.ADMIN_PASSWORD || ''}'
};
`;

fs.writeFileSync('config.js', configContent);
console.log('✅ config.js has been generated from environment variables');

