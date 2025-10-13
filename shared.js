// Shared functions for Health Portal
// ฟังก์ชันที่ใช้ร่วมกันระหว่าง index.html และ admin.html
// ระบบใช้ Supabase เท่านั้น - ไม่มี localStorage

// Supabase Configuration
const SUPABASE_URL = CONFIG.SUPABASE_URL;
const SUPABASE_ANON_KEY = CONFIG.SUPABASE_ANON_KEY;

// Initialize Supabase
let supabase;
try {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    if (!supabase) {
        throw new Error('Supabase initialization failed');
    }
} catch (e) {
    console.error('Supabase configuration error:', e);
    alert('⚠️ กรุณาตั้งค่า Supabase ใน config.js ก่อนใช้งาน!');
}

// Global data
let links = [];

// Load data from Supabase only
async function loadData() {
    if (!supabase) {
        console.error('Supabase not configured');
        links = [];
        updateSyncStatus('ไม่พร้อมใช้งาน - ตั้งค่า Supabase', null);
        return;
    }

    try {
        const { data, error } = await supabase
            .from('health_links')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        links = data || [];
        updateSyncStatus('เชื่อมต่อแล้ว', new Date());
    } catch (error) {
        console.error('Error loading from Supabase:', error);
        links = [];
        updateSyncStatus('เกิดข้อผิดพลาด', null);
        showNotification('ไม่สามารถโหลดข้อมูลจาก Supabase ได้', 'error');
    }
}

// Save/Update data to Supabase directly
async function saveData() {
    if (!supabase) {
        showNotification('กรุณาตั้งค่า Supabase ก่อน', 'error');
        return false;
    }

    try {
        showSyncIndicator();
        
        // Note: This will be called after individual operations
        // Just reload data to ensure consistency
        await loadData();
        
        hideSyncIndicator();
        return true;
    } catch (error) {
        console.error('Error in saveData:', error);
        hideSyncIndicator();
        return false;
    }
}

// Add new link to Supabase
async function addLink(linkData) {
    if (!supabase) {
        showNotification('กรุณาตั้งค่า Supabase ก่อน', 'error');
        return false;
    }

    try {
        const { data, error } = await supabase
            .from('health_links')
            .insert([linkData])
            .select();
        
        if (error) throw error;
        
        await loadData(); // Reload to get updated data
        return true;
    } catch (error) {
        console.error('Error adding link:', error);
        showNotification('ไม่สามารถเพิ่มข้อมูลได้', 'error');
        return false;
    }
}

// Update link in Supabase
async function updateLink(id, linkData) {
    if (!supabase) {
        showNotification('กรุณาตั้งค่า Supabase ก่อน', 'error');
        return false;
    }

    try {
        const { error } = await supabase
            .from('health_links')
            .update(linkData)
            .eq('id', id);
        
        if (error) throw error;
        
        await loadData(); // Reload to get updated data
        return true;
    } catch (error) {
        console.error('Error updating link:', error);
        showNotification('ไม่สามารถอัปเดตข้อมูลได้', 'error');
        return false;
    }
}

// Delete link from Supabase
async function deleteLink(id) {
    if (!supabase) {
        showNotification('กรุณาตั้งค่า Supabase ก่อน', 'error');
        return false;
    }

    try {
        const { error } = await supabase
            .from('health_links')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        
        await loadData(); // Reload to get updated data
        return true;
    } catch (error) {
        console.error('Error deleting link:', error);
        showNotification('ไม่สามารถลบข้อมูลได้', 'error');
        return false;
    }
}

// Update sync status
function updateSyncStatus(status, date) {
    const statusEl = document.getElementById('syncStatus');
    const lastSyncEl = document.getElementById('lastSync');
    
    if (statusEl) statusEl.textContent = status;
    if (lastSyncEl && date) {
        lastSyncEl.textContent = date.toLocaleString('th-TH');
    }
}

// Show/hide sync indicator
function showSyncIndicator() {
    const indicator = document.getElementById('syncIndicator');
    if (indicator) indicator.style.display = 'block';
}

function hideSyncIndicator() {
    setTimeout(() => {
        const indicator = document.getElementById('syncIndicator');
        if (indicator) indicator.style.display = 'none';
    }, 1000);
}

// Show notification
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-4 px-6 py-3 rounded-lg shadow-lg z-50 fade-in ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
    } text-white`;
    notification.innerHTML = `<i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}-circle mr-2"></i>${message}`;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// Track link clicks and update Supabase
async function trackClick(id) {
    const link = links.find(l => l.id === id);
    if (!link || !supabase) return;

    try {
        const newClicks = (link.clicks || 0) + 1;
        
        // Update in Supabase
        const { error } = await supabase
            .from('health_links')
            .update({ clicks: newClicks })
            .eq('id', id);
        
        if (error) throw error;
        
        // Update local array
        link.clicks = newClicks;
    } catch (error) {
        console.error('Error tracking click:', error);
    }
}

