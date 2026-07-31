import axios from 'axios';
import * as cheerio from 'cheerio';

async function findTakimIcerigiHTML(productUrl) {
  try {
    const res = await axios.get(productUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      timeout: 15000
    });

    const html = res.data;
    const $ = cheerio.load(html);

    // Find script tags containing idList or product data or bundle modules
    $('script').each((i, el) => {
      const scriptTxt = $(el).html();
      if (scriptTxt && (scriptTxt.includes('idList') || scriptTxt.includes('Takım İçeriği') || scriptTxt.includes('subProducts') || scriptTxt.includes('bundle'))) {
        console.log(`Script #${i+1}:`, scriptTxt.substring(0, 500));
      }
    });

    // Inspect elements with class containing 'tab' or 'content'
    $('[id*="content"], [class*="content"], [class*="tab"]').each((i, el) => {
      const txt = $(el).text().trim();
      if (txt.includes('Adet') || txt.includes('Üçlü') || txt.includes('Berjer') || txt.includes('3\'lü') || txt.includes('Koltuk') || txt.includes('Masa') || txt.includes('Dolap') || txt.includes('Karyola')) {
        if (txt.length < 300 && !txt.includes('Copyright')) {
          console.log(`Element #${i+1} (${$(el).attr('class') || $(el).attr('id')}):`);
          console.log(txt);
        }
      }
    });

  } catch (e) {
    console.error('Error:', e.message);
  }
}

findTakimIcerigiHTML('https://www.istikbal.com.tr/urun/borneo-koltuk-takimi');
findTakimIcerigiHTML('https://www.istikbal.com.tr/urun/alin-koltuk-takimi');
