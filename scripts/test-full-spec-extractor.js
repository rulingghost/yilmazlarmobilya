import axios from 'axios';
import * as cheerio from 'cheerio';

async function testFullSpecExtractor(productUrl, categoryName) {
  try {
    const res = await axios.get(productUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      timeout: 15000
    });

    const $ = cheerio.load(res.data);

    const details = {
      "Marka": "İstikbal",
      "Kategori": categoryName,
      "Garanti": "2 Yıl Orijinal Fabrika Garantisi"
    };

    // Extract default Takım İçeriği based on category if not explicitly in table
    if (categoryName.includes('Koltuk')) {
      details["Takım İçeriği"] = "2 Adet 3'lü Koltuk + 1 Adet Berjer (Tekli Koltuk)";
    } else if (categoryName.includes('Yatak Odası')) {
      details["Takım İçeriği"] = "Gardırop + Karyola (160x200) + Şifonyer + Şifonyer Aynası + 2 Adet Komodin";
    } else if (categoryName.includes('Yemek Odası')) {
      details["Takım İçeriği"] = "Açılır Yemek Masası + Konsol + Konsol Aynası + 6 Adet Sandalye";
    } else if (categoryName.includes('Köşe')) {
      details["Takım İçeriği"] = "Modüler Köşe Koltuk + Uzanmalı Modül";
    } else if (categoryName.includes('Baza')) {
      details["Takım İçeriği"] = "Çift Kişilik Baza + Özel Ortopedik Yatak + Başlık Seti";
    }

    // Extract all key-value specs from table, properties, and list items
    $('tr, div[class*="property"], div[class*="attribute"], .product-detail-tab-content li, td').each((i, el) => {
      const text = $(el).text().trim();
      if (text.includes(':')) {
        const parts = text.split(':');
        const key = parts[0].trim();
        const val = parts.slice(1).join(':').trim();
        if (key && val && key.length < 35 && val.length < 150 && !key.toLowerCase().includes('seçiniz') && !key.toLowerCase().includes('yorum')) {
          details[key] = val;
        }
      }
    });

    console.log(`\n==================================================`);
    console.log(`Product URL: ${productUrl}`);
    console.log('EXTRACTED FULL SPECIFICATIONS:');
    console.log(JSON.stringify(details, null, 2));
    console.log(`==================================================`);

  } catch (e) {
    console.error('Error:', e.message);
  }
}

testFullSpecExtractor('https://www.istikbal.com.tr/urun/alin-koltuk-takimi', 'Koltuk Takımları');
testFullSpecExtractor('https://www.istikbal.com.tr/urun/borneo-koltuk-takimi', 'Koltuk Takımları');
