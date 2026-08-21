// proxy.js - Vercel serverless proxy untuk API Setoran Kasir
// Jika ingin dipakai sebagai endpoint Vercel, letakkan file ini sebagai:
// api/proxy.js

const TARGET_API = 'https://lautanapi.vercel.app/api/report/setoran-kasir';

module.exports = async (req, res) => {
  try {
    const params = new URLSearchParams(req.query || {});
    const storeId = params.get('storeId') || 'M604';
    const userId = params.get('userId') || '23067884';
    const periode1 = params.get('periode1') || new Intl.DateTimeFormat('id-ID', {
      timeZone: 'Asia/Jakarta',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date()).replaceAll('/', '-');

    const url = `${TARGET_API}?storeId=${encodeURIComponent(storeId)}&userId=${encodeURIComponent(userId)}&periode1=${encodeURIComponent(periode1)}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });

    const text = await response.text();
    res.status(response.status);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', response.headers.get('content-type') || 'application/json; charset=utf-8');
    res.send(text);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Proxy gagal mengambil data API',
      error: error.message
    });
  }
};
