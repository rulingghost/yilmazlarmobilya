import axios from 'axios';
import * as cheerio from 'cheerio';

async function inspectTakimIcerigi(productUrl) {
  try {
    const res = await axios.get(productUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      timeout: 15000
    });

    const $ = cheerio.load(res.data);

    console.log('=== ALL TABS & CONTENT IN DETAIL PAGE ===');
    $('.product-detail-tab-content, .furniture-extended-tab, [id*="tab"], div[class*="content"]').each((i, el) => {
      const txt = $(el).text().trim();
      if (txt.length > 20 && txt.length < 1500 && !txt.includes('Copyright')) {
        console.log(`\n--- Element #${i+1} (${$(el).attr('class') || $(el).attr('id')}) ---`);
        console.log(txt);
      }
    });

  } catch (e) {
    console.error('Error:', e.message);
  }
}

inspectTakimIcerigi('https://www.istikbal.com.tr/urun/borneo-koltuk-takimi');
