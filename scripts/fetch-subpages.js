import axios from 'axios';
import fs from 'fs';
import * as cheerio from 'cheerio';

const subpages = [
  '',
  '/iletisim',
  '/hakkimizda',
  '/contact',
  '/about',
  '/uyku-testi',
  '/dijital-katalog'
];

async function fetchSubpages() {
  for (const page of subpages) {
    const url = `https://agbyazilimcom.wixsite.com/my-site-15${page}`;
    try {
      console.log('Fetching:', url);
      const res = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      const name = page === '' ? 'home' : page.replace('/', '');
      fs.writeFileSync(`scripts/wix_${name}.html`, res.data);
      console.log(`Saved ${name}.html length:`, res.data.length);
    } catch (err) {
      console.log(`Failed ${page}:`, err.message);
    }
  }
}

fetchSubpages();
