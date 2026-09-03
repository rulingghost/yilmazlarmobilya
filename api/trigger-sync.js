export default async function handler(req, res) {
  // Allow CORS if needed
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { password, token } = req.body || {};
    const ADMIN_PASSWORD = process.env.ADMIN_SYNC_PASSWORD || 'yilmazlar2026';

    if (password !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Geçersiz yönetici şifresi.' });
    }

    const ghToken = token || process.env.GITHUB_SYNC_TOKEN;

    if (!ghToken) {
      return res.status(400).json({ 
        error: 'GitHub erişim anahtarı (Token) eksik. Lütfen modal alanına GitHub Token yapıştırın veya Vercel panelinde GITHUB_SYNC_TOKEN tanımlayın.' 
      });
    }

    const ghResponse = await fetch('https://api.github.com/repos/rulingghost/yilmazlarmobilya/actions/workflows/catalog-sync.yml/dispatches', {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `Bearer ${ghToken.trim()}`,
        'User-Agent': 'Yilmazlar-Mobilya-Admin-Sync',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ref: 'main' })
    });

    if (ghResponse.status === 204 || ghResponse.ok) {
      return res.status(200).json({ 
        success: true, 
        message: 'Senkronizasyon bulut üzerinde başarıyla başlatıldı!' 
      });
    } else {
      const errText = await ghResponse.text();
      return res.status(ghResponse.status).json({ 
        error: `GitHub API Hatası (${ghResponse.status}): ${errText}` 
      });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
