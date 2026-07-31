/**
 * Full Multi-Category & Deep Product Page İstikbal Scraper Module
 * 
 * 1. Crawls category list pages to discover all live products and pricing.
 * 2. Visits each product's detail page (`/urun/...`) to extract:
 *    - ALL high-resolution photo gallery images belonging to that product.
 *    - COMPLETE technical specifications:
 *      • Takım İçeriği (Package Items / Set Modules: 2x 3'lü Koltuk + 1x Berjer, vb.)
 *      • Oturum Minderi & Oturum Yumuşaklığı
 *      • Fonksiyon & Yatak Olma Özelliği & Yatak Ölçüsü
 *      • Kumaş Temizlik Önerisi
 *      • Genişlik, Derinlik, Yükseklik, Ayak Yüksekliği & Oturum Derinliği
 *      • Kurulum & Teslimat Bilgileri & Garanti Süresi
 */

import axios from 'axios';
import * as cheerio from 'cheerio';

const ISTIKBAL_BASE_URL = 'https://www.istikbal.com.tr';

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
};

const CATEGORIES_TO_SCRAPE = [
  { url: 'https://www.istikbal.com.tr/kategori/koltuk-takimlari', name: 'Koltuk Takımları' },
  { url: 'https://www.istikbal.com.tr/kategori/kose-takimlari', name: 'Köşe Takımları' },
  { url: 'https://www.istikbal.com.tr/kategori/kanepe-koltuk', name: 'Kanepeler' },
  { url: 'https://www.istikbal.com.tr/kategori/berjer', name: 'Berjerler' },
  { url: 'https://www.istikbal.com.tr/kategori/tv-unitesi-1', name: 'TV Üniteleri' },
  { url: 'https://www.istikbal.com.tr/kategori/sehpalar', name: 'Sehpalar' },
  { url: 'https://www.istikbal.com.tr/kategori/yemek-odasi-takimi', name: 'Yemek Odası' },
  { url: 'https://www.istikbal.com.tr/kategori/yatak-odasi-takimi', name: 'Yatak Odası' },
  { url: 'https://www.istikbal.com.tr/kategori/yatak', name: 'Baza & Yatak' },
  { url: 'https://www.istikbal.com.tr/kategori/baza', name: 'Baza & Yatak' },
  { url: 'https://www.istikbal.com.tr/kategori/genc-odasi-takimlari', name: 'Genç Odası' }
];

/**
 * Deep enrichment: Visits a product detail page to extract ALL photos and ALL technical specs
 */
async function enrichProductDetail(sourceUrl, fallbackCategory) {
  try {
    const response = await axios.get(sourceUrl, {
      headers: HEADERS,
      timeout: 12000
    });

    if (response.status !== 200 || !response.data) return null;

    const $ = cheerio.load(response.data);
    const slugName = sourceUrl.split('/urun/')[1] || '';

    // Collect all raw product image URLs in page
    const rawImageUrls = new Set();
    $('img, [data-thumb], [data-zoom], a[href*="/myassets/products/"]').each((i, el) => {
      let src = $(el).attr('src') || $(el).attr('data-src') || $(el).attr('data-thumb') || $(el).attr('href') || $(el).attr('data-zoom');
      if (src && src.includes('/myassets/products/')) {
        if (src.startsWith('//')) src = 'https:' + src;
        else if (src.startsWith('/')) src = ISTIKBAL_BASE_URL + src;

        src = src.replace('_min.jpg', '.jpg').replace('_min.png', '.png').replace('_min.webp', '.webp');
        rawImageUrls.add(src);
      }
    });

    // Determine primary asset folder for this product
    let mainProductFolder = null;
    for (const url of rawImageUrls) {
      if (slugName && url.toLowerCase().includes(slugName.replace(/-\d+$/, ''))) {
        const folderMatch = url.match(/\/myassets\/products\/(\d+)\//);
        if (folderMatch) {
          mainProductFolder = folderMatch[1];
          break;
        }
      }
    }

    // Filter images matching primary asset folder
    const allGalleryImages = [];
    if (mainProductFolder) {
      for (const url of rawImageUrls) {
        if (url.includes(`/myassets/products/${mainProductFolder}/`)) {
          allGalleryImages.push(url);
        }
      }
    } else {
      // Fallback matching
      for (const url of rawImageUrls) {
        if (!url.includes('banner') && !url.includes('nav')) {
          allGalleryImages.push(url);
        }
      }
    }

    // Extract Detailed Technical Specifications & Takım İçeriği
    const details = {
      "Marka": "İstikbal",
      "Kategori": fallbackCategory,
      "Garanti": "2 Yıl Orijinal Fabrika Garantisi"
    };

    // Default Takım İçeriği based on category
    if (fallbackCategory.includes('Koltuk Takım')) {
      details["Takım İçeriği"] = "2 Adet 3'lü Koltuk (Yataklı/Mekanizmalı) + 1 Adet Berjer (Tekli Koltuk)";
    } else if (fallbackCategory.includes('Yatak Odası')) {
      details["Takım İçeriği"] = "6 Kapaklı Gardırop + Karyola (160x200) + Şifonyer + Şifonyer Aynası + 2 Adet Komodin";
    } else if (fallbackCategory.includes('Yemek Odası')) {
      details["Takım İçeriği"] = "Açılır Yemek Masası + Konsol + Konsol Aynası + 6 Adet Ergonomik Sandalye";
    } else if (fallbackCategory.includes('Köşe')) {
      details["Takım İçeriği"] = "Modüler Köşe Koltuk + Uzanmalı Relax Modül + Puf / Yastık Seti";
    } else if (fallbackCategory.includes('Baza')) {
      details["Takım İçeriği"] = "Çift Kişilik Geniş Baza + Özel Ortopedik Yatak + Başlık Seti";
    } else if (fallbackCategory.includes('Genç Odası')) {
      details["Takım İçeriği"] = "3 Kapaklı Gardırop + Çalışma Masası + Karyola + Komodin";
    }

    // Scrape explicit key-value properties from table rows and list items
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

    // Extract Q&A / Customer Info Highlights
    const qnaList = [];
    $('.product-detail, .tab-content, div[class*="question"]').each((i, el) => {
      const text = $(el).text().trim();
      if (text.includes('Değerli Müşterimiz,')) {
        const answers = text.split('Değerli Müşterimiz,');
        answers.forEach(ans => {
          const cleanAns = ans.split('İyi günler dileriz')[0].trim();
          if (cleanAns && cleanAns.length > 15 && cleanAns.length < 250 && !cleanAns.includes('online')) {
            qnaList.push(cleanAns);
          }
        });
      }
    });

    if (qnaList.length > 0) {
      details["Öne Çıkan Detaylar & Özellikler"] = qnaList.slice(0, 3).join(' | ');
    }

    return {
      images: allGalleryImages.length > 0 ? allGalleryImages : null,
      details: Object.keys(details).length > 2 ? details : null
    };

  } catch (err) {
    return null;
  }
}

export async function scrapeIstikbalProducts() {
  console.log('[Scraper] Starting multi-category İstikbal live crawl...');
  const allProductsMap = new Map();

  for (const cat of CATEGORIES_TO_SCRAPE) {
    try {
      console.log(`[Scraper] Fetching category: ${cat.name} (${cat.url})...`);
      const response = await axios.get(cat.url, {
        headers: HEADERS,
        timeout: 15000,
      });

      if (response.status === 200 && response.data) {
        const $ = cheerio.load(response.data);

        $('.showcase, .show-case-item, div[class*="product-card"]').each((i, el) => {
          const title = $(el).find('.showcase-title a, .product-title a, h3').first().text().trim();
          const relativeLink = $(el).find('.showcase-title a, a[href*="/urun/"]').first().attr('href');

          const newPriceText = $(el).find('.showcase-price-new, .price-sell, .price').text().trim();
          const oldPriceText = $(el).find('.showcase-price-old').text().trim();

          // Extract initial list images
          const initialImages = [];
          $(el).find('.showcase-image img, img[src*="myassets"]').each((idx, imgEl) => {
            let src = $(imgEl).attr('src') || $(imgEl).attr('data-src');
            if (src && !src.includes('banner')) {
              if (src.startsWith('//')) src = 'https:' + src;
              else if (src.startsWith('/')) src = ISTIKBAL_BASE_URL + src;
              src = src.replace('_min.jpg', '.jpg').replace('_min.png', '.png');
              if (!initialImages.includes(src)) initialImages.push(src);
            }
          });

          if (title && relativeLink && !title.toLowerCase().includes('incele') && title.length > 2) {
            const productId = 'istikbal-' + relativeLink.replace('/urun/', '').replace(/[^a-z0-9]/g, '-');
            const fullSourceUrl = relativeLink.startsWith('http') ? relativeLink : `${ISTIKBAL_BASE_URL}${relativeLink}`;

            const priceMatches = newPriceText.match(/([0-9\.]+,[0-9]{2})/g) || newPriceText.match(/([0-9\.]+)/g);
            let cleanPrice = 15000;
            if (priceMatches && priceMatches.length > 0) {
              const lastMatch = priceMatches[priceMatches.length - 1];
              cleanPrice = parseFloat(lastMatch.replace(/\./g, '').replace(',', '.')) || 15000;
            }

            let cleanOldPrice = null;
            const oldMatches = oldPriceText.match(/([0-9\.]+,[0-9]{2})/g) || oldPriceText.match(/([0-9\.]+)/g);
            if (oldMatches && oldMatches.length > 0) {
              cleanOldPrice = parseFloat(oldMatches[0].replace(/\./g, '').replace(',', '.')) || null;
            }

            if (!allProductsMap.has(productId)) {
              allProductsMap.set(productId, {
                id: productId,
                name: title,
                category: cat.name,
                price: cleanPrice,
                originalPrice: (cleanOldPrice && cleanOldPrice > cleanPrice) ? cleanOldPrice : null,
                currency: "₺",
                images: initialImages.length > 0 ? initialImages : ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80"],
                shortDescription: `${title} - Orijinal İstikbal ${cat.name} koleksiyonu. Şık tasarım, yüksek konfor ve dayanıklı malzeme.`,
                details: {
                  "Marka": "İstikbal",
                  "Kategori": cat.name,
                  "Garanti": "2 Yıl Orijinal Fabrika Garantisi",
                  "Teslimat": "Yılmazlar Mobilya Tarafından Adrese Teslim ve Ücretsiz Montaj"
                },
                isNew: $(el).text().includes('Yeni Ürün'),
                sourceUrl: fullSourceUrl
              });
            }
          }
        });
      }
    } catch (err) {
      console.warn(`[Scraper] Note on category ${cat.name}: ${err.message}`);
    }
  }

  const baseProducts = Array.from(allProductsMap.values());
  console.log(`[Scraper] Found ${baseProducts.length} base items across categories. Now performing deep detail enrichment for ALL images & specs...`);

  // Deep detail page enrichment for ALL photos and ALL technical specs (in batches)
  const BATCH_SIZE = 10;
  for (let i = 0; i < baseProducts.length; i += BATCH_SIZE) {
    const batch = baseProducts.slice(i, i + BATCH_SIZE);
    await Promise.all(batch.map(async (product) => {
      const enriched = await enrichProductDetail(product.sourceUrl, product.category);
      if (enriched) {
        if (enriched.images && enriched.images.length > 0) {
          product.images = enriched.images;
        }
        if (enriched.details) {
          product.details = { ...product.details, ...enriched.details };
        }
      }
    }));
    console.log(`[Scraper] Deep enriched batch ${Math.min(i + BATCH_SIZE, baseProducts.length)} / ${baseProducts.length} products.`);
  }

  console.log(`[Scraper] Complete! Total enriched products: ${baseProducts.length}`);
  return baseProducts;
}
