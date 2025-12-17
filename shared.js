// Shared functions for Health Portal
// ฟังก์ชันที่ใช้ร่วมกันระหว่าง index.html และ admin.html
// ระบบใช้ API ฝั่งเซิร์ฟเวอร์ (/api) เท่านั้น (เพื่อไม่ต้องมี config.js หรือ key ในฝั่ง client)

// NOTE:
// This file is loaded in the global scope (index.html/admin.html). If it gets loaded twice
// (browser cache quirks, duplicated script tags, etc.), `let/const` re-declarations will crash.
// Use `var` + window-backed singletons to be safe.

// Global singletons (safe to re-run)
var links = window.links = window.links || [];

// Load data from Supabase only
async function loadData() {
    try {
        const res = await fetch('/api/links', { method: 'GET' });
        const payload = await res.json().catch(() => ({}));
        if (!res.ok || !payload.ok) throw new Error(payload.error || 'โหลดข้อมูลไม่สำเร็จ');
        links = payload.data || [];
        updateSyncStatus('เชื่อมต่อแล้ว', new Date());
    } catch (error) {
        console.error('Error loading from API:', error);
        links = [];
        updateSyncStatus('เกิดข้อผิดพลาด', null);
        showNotification('ไม่สามารถโหลดข้อมูลจาก Supabase ได้', 'error');
    }
}

// Save/Update data to Supabase directly
async function saveData() {
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
    try {
        const res = await fetch('/api/links', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(linkData)
        });
        const payload = await res.json().catch(() => ({}));
        if (!res.ok || !payload.ok) throw new Error(payload.error || 'เพิ่มข้อมูลไม่สำเร็จ');

        await loadData(); // Reload to get updated data
        return true;
    } catch (error) {
        console.error('Error adding link (API):', error);
        showNotification('ไม่สามารถเพิ่มข้อมูลได้', 'error');
        return false;
    }
}

// Update link in Supabase
async function updateLink(id, linkData) {
    try {
        const res = await fetch(`/api/links?id=${encodeURIComponent(String(id))}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(linkData)
        });
        const payload = await res.json().catch(() => ({}));
        if (!res.ok || !payload.ok) throw new Error(payload.error || 'อัปเดตข้อมูลไม่สำเร็จ');

        await loadData(); // Reload to get updated data
        return true;
    } catch (error) {
        console.error('Error updating link (API):', error);
        showNotification('ไม่สามารถอัปเดตข้อมูลได้', 'error');
        return false;
    }
}

// Delete link from Supabase
async function deleteLink(id) {
    try {
        const res = await fetch(`/api/links?id=${encodeURIComponent(String(id))}`, { method: 'DELETE' });
        const payload = await res.json().catch(() => ({}));
        if (!res.ok || !payload.ok) throw new Error(payload.error || 'ลบข้อมูลไม่สำเร็จ');

        await loadData(); // Reload to get updated data
        return true;
    } catch (error) {
        console.error('Error deleting link (API):', error);
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
    if (!link) return;

    try {
        const newClicks = (link.clicks || 0) + 1;

        const res = await fetch(`/api/links?id=${encodeURIComponent(String(id))}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ clicks: newClicks })
        });
        const payload = await res.json().catch(() => ({}));
        if (!res.ok || !payload.ok) throw new Error(payload.error || 'อัปเดตคลิกไม่สำเร็จ');
        
        // Update local array
        link.clicks = newClicks;
    } catch (error) {
        console.error('Error tracking click:', error);
    }
}

