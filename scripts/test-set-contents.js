import axios from 'axios';
import * as cheerio from 'cheerio';

async function testSetContents(productUrl) {
  try {
    console.log(`Fetching detail page for set contents: ${productUrl}`);
    const res = await axios.get(productUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      timeout: 15000
    });

    const $ = cheerio.load(res.data);

    console.log('--- LOOKING FOR TAKIM İÇERİĞİ / PAKET İÇERİĞİ / MODÜLLER ---');
    
    // Check all tabs, tables, divs, spans, lists containing "Takım İçeriği", "İçerik", "Modül", "Paket"
    $('*').each((i, el) => {
      const text = $(el).text().trim();
      if (text.includes('Takım İçeriği') || text.includes('Paket İçeriği') || text.includes('Set İçeriği')) {
        if (text.length < 300) {
          console.log(`Matched element <${$(el).prop('tagName')} class="${$(el).attr('class')}">:`);
          console.log(text);
        }
      }
    });

    console.log('\n--- LOOKING FOR SPECIFICATION TABLES & KEY-VALUE PAIRS ---');
    const allSpecs = {};
    $('tr, div[class*="property"], div[class*="attribute"], div[class*="spec"], li').each((i, el) => {
      const text = $(el).text().trim();
      if (text.includes(':')) {
        const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
        lines.forEach(line => {
          if (line.includes(':')) {
            const parts = line.split(':');
            const key = parts[0].trim();
            const val = parts.slice(1).join(':').trim();
            if (key && val && key.length < 40 && val.length < 150 && !key.toLowerCase().includes('seçiniz')) {
              allSpecs[key] = val;
            }
          }
        });
      }
    });

    console.log(JSON.stringify(allSpecs, null, 2));

  } catch (e) {
    console.error('Error:', e.message);
  }
}

testSetContents('https://www.istikbal.com.tr/urun/borneo-koltuk-takimi');
testSetContents('https://www.istikbal.com.tr/urun/legato-koltuk-takimi');
