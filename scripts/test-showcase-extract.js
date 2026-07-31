import axios from 'axios';
import * as cheerio from 'cheerio';

async function testShowcaseExtraction() {
  try {
    const url = 'https://www.istikbal.com.tr/kategori/koltuk-takimlari';
    const res = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      timeout: 15000
    });

    const $ = cheerio.load(res.data);
    const products = [];

    $('.showcase').each((i, el) => {
      const title = $(el).find('.showcase-title a').text().trim();
      const relativeLink = $(el).find('.showcase-title a').attr('href');
      const newPriceText = $(el).find('.showcase-price-new, .showcase-price').text().trim();
      
      const images = [];
      $(el).find('.showcase-image img').each((idx, imgEl) => {
        let src = $(imgEl).attr('src') || $(imgEl).attr('data-src');
        if (src) {
          if (src.startsWith('//')) src = 'https:' + src;
          else if (src.startsWith('/')) src = 'https://www.istikbal.com.tr' + src;

          // Convert thumbnail to main image URL
          src = src.replace('_min.jpg', '.jpg').replace('_min.png', '.png');
          if (!images.includes(src)) images.push(src);
        }
      });

      if (title && relativeLink) {
        products.push({
          title,
          relativeLink,
          newPriceText,
          images
        });
      }
    });

    console.log(`Successfully extracted ${products.length} products with images!`);
    console.log('\n--- Sample First 5 Products ---');
    console.log(JSON.stringify(products.slice(0, 5), null, 2));

  } catch (e) {
    console.error('Error:', e.message);
  }
}

testShowcaseExtraction();
