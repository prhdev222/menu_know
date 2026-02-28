/**
 * เซิร์ฟเวอร์ local สำหรับรันโปรเจกต์โดยไม่ต้องใช้ vercel dev
 * รัน: node server.js หรือ npm run dev
 * ใช้ .env.local อัตโนมัติ (โหลดใน api/_supabase.js)
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const linksHandler = require('./api/links.js');

const MIMES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.css': 'text/css',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
};

function sendStatic(res, filePath) {
  const ext = path.extname(filePath);
  const mime = MIMES[ext] || 'application/octet-stream';
  res.setHeader('Content-Type', mime);
  fs.createReadStream(filePath).pipe(res);
}

function parseQuery(url) {
  const i = url.indexOf('?');
  if (i === -1) return {};
  const q = {};
  url.slice(i + 1).split('&').forEach((pair) => {
    const [k, v] = pair.split('=').map(decodeURIComponent);
    if (k) q[k] = v === undefined ? '' : v;
  });
  return q;
}

const server = http.createServer(async (req, res) => {
  const url = req.url || '/';
  const pathname = url.split('?')[0];

  // API route
  if (pathname === '/api/links' || pathname.startsWith('/api/')) {
    const reqMock = {
      method: req.method,
      query: parseQuery(url),
      body: undefined,
      on: req.on.bind(req),
    };
    // อ่าน body สำหรับ POST/PUT
    if (req.method === 'POST' || req.method === 'PUT') {
      const chunks = [];
      req.on('data', (chunk) => chunks.push(chunk));
      req.on('end', () => {
        try {
          const raw = Buffer.concat(chunks).toString('utf8');
          reqMock.body = raw ? JSON.parse(raw) : {};
        } catch {
          reqMock.body = {};
        }
        linksHandler(reqMock, res);
      });
      return;
    }
    return linksHandler(reqMock, res);
  }

  // Static files
  let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);
  if (!path.relative(path.join(__dirname, '..'), filePath).split(path.sep).includes('..') && path.dirname(filePath).startsWith(__dirname)) {
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      return sendStatic(res, filePath);
    }
  }
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.end('Not Found');
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log('(ใช้ .env.local อัตโนมัติ)');
});
