/**
 * Full Multi-Category & Deep Product Page İstikbal Scraper Module
 * 
 * Features:
 * 1. Multi-Page Category Crawler (follows ?tp=1, ?tp=2, ... until end of category).
 * 2. Live Authoritative Pricing:
 *    - JSON-LD schema.org offers.price
 *    - .product-price-new
 *    - Installment / 9 Taksit pricing
 *    - Official Stock Code (SKU)
 * 3. Real Bundle / Takım İçeriği Extraction via İstikbal API:
 *    - Component names, quantities, individual unit prices
 *    - Component high-res photos
 *    - Detailed component dimensions (Genişlik, Derinlik, Yükseklik, Oturum Derinliği)
 * 4. Technical Specifications & Dimension Extraction
 * 5. Complete High-Resolution Gallery Image Extraction
 * 6. Resilient batching with retries and fallback
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import http from 'http';
import https from 'https';

const httpAgent = new http.Agent({ keepAlive: true });
const httpsAgent = new https.Agent({ keepAlive: true });

const ISTIKBAL_BASE_URL = 'https://www.istikbal.com.tr';

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
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
  { url: 'https://www.istikbal.com.tr/kategori/genc-odasi-takimlari', name: 'Genç Odası' },
  { url: 'https://www.istikbal.com.tr/kategori/mutfak-masa-takimi', name: 'Yemek Odası' }
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fetch a URL with automatic retry
 */
async function fetchWithRetry(url, options = {}, retries = 2) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await axios.get(url, {
        headers: HEADERS,
        timeout: 15000,
        httpAgent,
        httpsAgent,
        ...options
      });
      return response;
    } catch (err) {
      if (attempt === retries) throw err;
      await sleep(500 * attempt);
    }
  }
}

/**
 * Deep enrichment: Visits a product detail page to extract authoritative price, SKU,
 * real bundle items (takım içeriği), measurements, technical specs, and high-res photos.
 */
async function enrichProductDetail(sourceUrl, fallbackCategory) {
  try {
    const response = await fetchWithRetry(sourceUrl);
    if (!response || response.status !== 200 || !response.data) return null;

    const html = response.data;
    const $ = cheerio.load(html);
    const slugName = sourceUrl.split('/urun/')[1] || '';

    // 1. Authoritative price & SKU from JSON-LD schema
    let authoritativePrice = null;
    let authoritativeSku = null;

    $('script[type="application/ld+json"]').each((i, el) => {
      try {
        const json = JSON.parse($(el).html() || '{}');
        if (json['@type'] === 'Product' || json.offers) {
          if (json.offers && json.offers.price) {
            const p = parseFloat(json.offers.price);
            if (!isNaN(p) && p > 0) authoritativePrice = p;
          }
          if (json.sku) authoritativeSku = String(json.sku).trim();
          else if (json.mpn) authoritativeSku = String(json.mpn).trim();
        }
      } catch (_) {}
    });

    // Fallback price extraction from .product-price-new
    if (!authoritativePrice) {
      const priceText = $('.product-price-new').first().text().trim();
      const match = priceText.match(/([0-9\.]+,[0-9]{2})/) || priceText.match(/([0-9\.]+)/);
      if (match) {
        authoritativePrice = parseFloat(match[1].replace(/\./g, '').replace(',', '.'));
      }
    }

    // Installment price (Diğer kartlara 9 taksitli fiyatı)
    let installmentPrice = null;
    const installmentMatch = html.match(/Diğer\s*Kartlara\s*9\s*Taksitli\s*Fiyat[ıi]:?\s*([0-9\.]+,[0-9]{2})/i) ||
                             html.match(/9\s*Taksitli\s*Fiyat[ıi]:?\s*([0-9\.]+,[0-9]{2})/i);
    if (installmentMatch) {
      installmentPrice = parseFloat(installmentMatch[1].replace(/\./g, '').replace(',', '.'));
    }

    // Stock Code (SKU) fallback from DOM
    if (!authoritativeSku) {
      $('*').each((i, el) => {
        const t = $(el).text();
        if (t.includes('Stok Kodu') && $(el).children().length === 0) {
          const parentTxt = $(el).parent().text().replace('Stok Kodu', '').replace(':', '').trim();
          if (parentTxt && parentTxt.length >= 4 && parentTxt.length < 35) {
            authoritativeSku = parentTxt.split(/\s+/)[0];
          }
        }
      });
    }

    // 2. Extract Real Bundle Modules (Takım İçeriği) via İstikbal API
    const bundleItems = [];
    const idListMatch = html.match(/var\s+idList\s*=\s*['"]([^'"]+)['"]/);

    if (idListMatch) {
      const idParts = idListMatch[1].split('|');
      const ids = [];
      const quantities = {};

      for (const part of idParts) {
        const [id, q] = part.split('-');
        if (id) {
          ids.push(id);
          quantities[id] = parseInt(q, 10) || 0;
        }
      }

      if (ids.length > 0) {
        try {
          const params = new URLSearchParams();
          params.append('action', '1');
          params.append('ids', encodeURIComponent(JSON.stringify(ids)));

          const apiRes = await axios.post('https://s2.digitalfikirler.com/istikbal/request.php', params, {
            headers: {
              'User-Agent': HEADERS['User-Agent'],
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            timeout: 10000
          });

          const apiData = apiRes.data;
          if (apiData && typeof apiData === 'object') {
            for (const id of ids) {
              const mod = apiData[id];
              if (mod && mod.status !== 0) {
                const defaultQty = quantities[id] !== undefined ? quantities[id] : 0;
                // Dimensions and specs for each module
                const dimensions = {};
                const moduleSpecs = {};
                if (Array.isArray(mod.product_specs2)) {
                  mod.product_specs2.forEach(s => {
                    if (s.location === 'boyut') {
                      dimensions[s.name] = s.value;
                    } else if (s.location === 'özellik') {
                      moduleSpecs[s.name] = s.value;
                    }
                  });
                }

                let modImage = null;
                const modImages = [];
                if (Array.isArray(mod.images) && mod.images.length > 0) {
                  mod.images.forEach(img => {
                    let full = img.startsWith('http') ? img : `https://${img}`;
                    full = full.replace('_min.jpg', '.jpg').replace('_min.png', '.png');
                    modImages.push(full);
                  });
                  modImage = modImages[0];
                }

                bundleItems.push({
                  id: String(mod.product_id || id),
                  name: mod.name,
                  sku: mod.sku || '',
                  defaultQty: defaultQty,
                  quantity: defaultQty,
                  price: mod.price || 0,
                  originalPrice: (mod.discounted_price && mod.discounted_price < mod.price) ? mod.price : null,
                  totalPrice: (mod.price || 0) * defaultQty,
                  image: modImage,
                  images: modImages,
                  dimensions,
                  specs: moduleSpecs
                });
              }
            }
          }
        } catch (apiErr) {
          // Bundle API warning handled gracefully
        }
      }
    }

    // 3. Extract High-Resolution Images
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

    const allGalleryImages = [];
    if (mainProductFolder) {
      for (const url of rawImageUrls) {
        if (url.includes(`/myassets/products/${mainProductFolder}/`)) {
          allGalleryImages.push(url);
        }
      }
    } else {
      for (const url of rawImageUrls) {
        if (!url.includes('banner') && !url.includes('nav')) {
          allGalleryImages.push(url);
        }
      }
    }

    // 4. Extract Technical Specifications
    const details = {
      "Marka": "İstikbal",
      "Kategori": fallbackCategory,
      "Garanti": "2 Yıl Orijinal Fabrika Garantisi",
      "Teslimat": "Yılmazlar Mobilya Tarafından Adrese Teslim ve Ücretsiz Montaj"
    };

    if (authoritativeSku) details["Stok Kodu"] = authoritativeSku;

    // Set genuine Takım İçeriği if bundleItems exists
    if (bundleItems.length > 0) {
      const activeItems = bundleItems.filter(b => b.defaultQty > 0);
      details["Takım İçeriği"] = (activeItems.length > 0 ? activeItems : bundleItems)
        .map(b => `${b.defaultQty || 1} Adet ${b.name}`)
        .join(' + ');
    }

    // Scrape table rows
    $('table tr').each((i, el) => {
      const cols = $(el).find('td, th');
      if (cols.length >= 2) {
        const key = $(cols[0]).text().trim().replace(/:$/, '').trim();
        const val = $(cols[cols.length - 1]).text().trim();
        if (key && val && key.length < 40 && val.length < 150 && key !== ':' && !key.toLowerCase().includes('seçiniz')) {
          details[key] = val;
        }
      }
    });

    // Scrape key-value properties
    $('div[class*="property"], div[class*="attribute"], .product-detail-tab-content li').each((i, el) => {
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

    return {
      price: authoritativePrice,
      installmentPrice,
      sku: authoritativeSku,
      bundleItems: bundleItems.length > 0 ? bundleItems : null,
      images: allGalleryImages.length > 0 ? allGalleryImages : null,
      details: Object.keys(details).length > 2 ? details : null
    };

  } catch (err) {
    return null;
  }
}

/**
 * Main Scraping Engine
 */
export async function scrapeIstikbalProducts() {
  console.log('[Scraper] Starting multi-category İstikbal live crawl with pagination...');
  const allProductsMap = new Map();

  for (const cat of CATEGORIES_TO_SCRAPE) {
    let currentPage = 1;
    let hasMorePages = true;
    let categoryProductCount = 0;

    console.log(`[Scraper] Crawling category: ${cat.name} (${cat.url})...`);

    while (hasMorePages && currentPage <= 20) {
      try {
        const pageUrl = currentPage === 1 ? cat.url : `${cat.url}?tp=${currentPage}`;
        const response = await fetchWithRetry(pageUrl, {}, 2);

        if (!response || response.status !== 200 || !response.data) {
          break;
        }

        const $ = cheerio.load(response.data);
        const productElements = $('.showcase, .show-case-item, div[class*="product-card"]');

        if (productElements.length === 0) {
          hasMorePages = false;
          break;
        }

        let addedOnThisPage = 0;

        productElements.each((i, el) => {
          const title = $(el).find('.showcase-title a, .product-title a, h3').first().text().trim();
          const relativeLink = $(el).find('.showcase-title a, a[href*="/urun/"]').first().attr('href');

          const newPriceText = $(el).find('.showcase-price-new, .price-sell, .price').text().trim();
          const oldPriceText = $(el).find('.showcase-price-old').text().trim();

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
                bundleItems: null,
                sku: null,
                installmentPrice: null,
                isNew: $(el).text().includes('Yeni Ürün'),
                sourceUrl: fullSourceUrl
              });
              addedOnThisPage++;
              categoryProductCount++;
            }
          }
        });

        // Check if pagination exists and has next page
        const hasNextPageLink = $(`a[href*="?tp=${currentPage + 1}"]`).length > 0 || $('.paginate-right.paginate-active').length > 0;
        if (!hasNextPageLink || addedOnThisPage === 0 || productElements.length < 30) {
          hasMorePages = false;
        } else {
          currentPage++;
          await sleep(200);
        }

      } catch (catErr) {
        console.warn(`[Scraper] Note on category ${cat.name} page ${currentPage}: ${catErr.message}`);
        hasMorePages = false;
      }
    }

    console.log(`[Scraper] Category ${cat.name} complete: ${categoryProductCount} items found.`);
  }

  const baseProducts = Array.from(allProductsMap.values());
  console.log(`[Scraper] Total unique products discovered across all pages: ${baseProducts.length}.`);
  console.log(`[Scraper] Now performing deep enrichment for prices, SKU, bundle modules, and specs...`);

  // Deep detail enrichment in controlled concurrent batches
  const BATCH_SIZE = 5;
  for (let i = 0; i < baseProducts.length; i += BATCH_SIZE) {
    const batch = baseProducts.slice(i, i + BATCH_SIZE);
    await Promise.all(batch.map(async (product) => {
      const enriched = await enrichProductDetail(product.sourceUrl, product.category);
      if (enriched) {
        // Authoritative live price update
        if (enriched.price && !isNaN(enriched.price)) {
          product.price = enriched.price;
        }
        if (enriched.installmentPrice && !isNaN(enriched.installmentPrice)) {
          product.installmentPrice = enriched.installmentPrice;
          if (!product.originalPrice || product.installmentPrice > product.price) {
            product.originalPrice = enriched.installmentPrice;
          }
        }
        if (enriched.sku) {
          product.sku = enriched.sku;
        }
        if (enriched.bundleItems && enriched.bundleItems.length > 0) {
          product.bundleItems = enriched.bundleItems;
        }
        if (enriched.images && enriched.images.length > 0) {
          product.images = enriched.images;
        }
        if (enriched.details) {
          product.details = { ...product.details, ...enriched.details };
        }
      }
    }));

    if ((i + BATCH_SIZE) % 25 === 0 || i + BATCH_SIZE >= baseProducts.length) {
      console.log(`[Scraper] Deep enriched ${Math.min(i + BATCH_SIZE, baseProducts.length)} / ${baseProducts.length} products.`);
    }
    await sleep(200);
  }

  console.log(`[Scraper] Completed full enrichment! Total products: ${baseProducts.length}`);
  return baseProducts;
}
