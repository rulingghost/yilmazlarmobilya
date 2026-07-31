import axios from 'axios';
import * as cheerio from 'cheerio';

async function extractFullProductGalleryAndSpecs(productUrl, sourceUrlName) {
  try {
    const res = await axios.get(productUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      timeout: 15000
    });

    const $ = cheerio.load(res.data);
    const slugName = productUrl.split('/urun/')[1] || '';

    // Find all image URLs in the page
    const rawImageUrls = new Set();
    $('img, [data-thumb], [data-zoom], a[href*="/myassets/products/"]').each((i, el) => {
      let src = $(el).attr('src') || $(el).attr('data-src') || $(el).attr('data-thumb') || $(el).attr('href') || $(el).attr('data-zoom');
      if (src && src.includes('/myassets/products/')) {
        if (src.startsWith('//')) src = 'https:' + src;
        else if (src.startsWith('/')) src = 'https://www.istikbal.com.tr' + src;

        src = src.replace('_min.jpg', '.jpg').replace('_min.png', '.png').replace('_min.webp', '.webp');
        rawImageUrls.add(src);
      }
    });

    // 1. Identify primary asset folder for this product
    // Find the image URL that matches the product slug
    let mainProductFolder = null;
    let mainProductPrefix = null;

    for (const url of rawImageUrls) {
      if (slugName && url.toLowerCase().includes(slugName.replace(/-\d+$/, ''))) {
        const folderMatch = url.match(/\/myassets\/products\/(\d+)\//);
        if (folderMatch) {
          mainProductFolder = folderMatch[1];
          break;
        }
      }
    }

    // 2. Filter images matching primary asset folder
    const productImages = [];
    if (mainProductFolder) {
      for (const url of rawImageUrls) {
        if (url.includes(`/myassets/products/${mainProductFolder}/`)) {
          productImages.push(url);
        }
      }
    }

    // 3. Extract Full Specifications (Table + Q&A + Description)
    const details = {
      "Marka": "İstikbal",
      "Garanti": "2 Yıl Orijinal Fabrika Garantisi"
    };

    $('tr, div[class*="property"], div[class*="attribute"], .product-detail-tab-content li').each((i, el) => {
      const text = $(el).text().trim();
      if (text.includes(':')) {
        const parts = text.split(':');
        const key = parts[0].trim();
        const val = parts.slice(1).join(':').trim();
        if (key && val && key.length < 35 && val.length < 150 && !key.toLowerCase().includes('seçiniz')) {
          details[key] = val;
        }
      }
    });

    // Q&A features
    const qnaList = [];
    $('.product-detail, .tab-content, div[class*="question"]').each((i, el) => {
      const text = $(el).text().trim();
      if (text.includes('Değerli Müşterimiz,')) {
        const answers = text.split('Değerli Müşterimiz,');
        answers.forEach(ans => {
          const cleanAns = ans.split('İyi günler dileriz')[0].trim();
          if (cleanAns && cleanAns.length > 15 && cleanAns.length < 250) {
            qnaList.push(cleanAns);
          }
        });
      }
    });

    if (qnaList.length > 0) {
      details["Öne Çıkan Detaylar & Soru-Cevap"] = qnaList.slice(0, 3).join(' | ');
    }

    console.log(`\n==================================================`);
    console.log(`Product: ${sourceUrlName}`);
    console.log(`URL: ${productUrl}`);
    console.log(`Main Asset Folder ID: ${mainProductFolder}`);
    console.log(`FULL GALLERY IMAGES SCAPED (${productImages.length}):`);
    console.log(productImages);
    console.log('\nFULL EXTRACTED TECHNICAL DETAILS:');
    console.log(JSON.stringify(details, null, 2));
    console.log(`==================================================`);

  } catch (e) {
    console.error(`Error in ${productUrl}:`, e.message);
  }
}

extractFullProductGalleryAndSpecs('https://www.istikbal.com.tr/urun/alin-koltuk-takimi', 'Alin Koltuk Takımı');
extractFullProductGalleryAndSpecs('https://www.istikbal.com.tr/urun/legato-koltuk-takimi', 'Legato Koltuk Takımı');
extractFullProductGalleryAndSpecs('https://www.istikbal.com.tr/urun/panteon-yatak-odasi-takimi', 'Panteon Yatak Odası Takımı');
