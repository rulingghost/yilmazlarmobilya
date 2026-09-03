/**
 * Product Sync & Update Engine for Yılmazlar Mobilya
 * Executable via: `npm run update-products`
 * 
 * Features:
 * - Atomic JSON updates (writes to temporary file first).
 * - Copies fresh catalog to both data/ and public/data/ (instant runtime sync on Vercel/web).
 * - Timezone: Europe/Istanbul timestamp formatting.
 * - Detailed audit logging to logs/product-update.log.
 * - Robust error handling preserving existing catalog on network outage.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { scrapeIstikbalProducts } from './scrapers/istikbalScraper.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const DATA_DIR = path.join(ROOT_DIR, 'data');
const PUBLIC_DATA_DIR = path.join(ROOT_DIR, 'public', 'data');
const DIST_DATA_DIR = path.join(ROOT_DIR, 'dist', 'data');
const LOGS_DIR = path.join(ROOT_DIR, 'logs');

const PRODUCTS_JSON = path.join(DATA_DIR, 'products.json');
const PRODUCTS_TMP_JSON = path.join(DATA_DIR, 'products.tmp.json');
const LAST_UPDATE_JSON = path.join(DATA_DIR, 'last_update.json');
const LOG_FILE = path.join(LOGS_DIR, 'product-update.log');

/**
 * Format date in Turkey Timezone (Europe/Istanbul)
 * Output: DD.MM.YYYY HH:mm
 */
function getTurkeyFormattedDate(date = new Date()) {
  const options = {
    timeZone: 'Europe/Istanbul',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  };

  const formatter = new Intl.DateTimeFormat('tr-TR', options);
  const parts = formatter.formatToParts(date);
  
  const day = parts.find(p => p.type === 'day')?.value || '01';
  const month = parts.find(p => p.type === 'month')?.value || '01';
  const year = parts.find(p => p.type === 'year')?.value || '2026';
  const hour = parts.find(p => p.type === 'hour')?.value || '00';
  const minute = parts.find(p => p.type === 'minute')?.value || '00';

  return `${day}.${month}.${year} ${hour}:${minute}`;
}

function ensureDirectories() {
  [DATA_DIR, PUBLIC_DATA_DIR, LOGS_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

function readExistingProducts() {
  if (fs.existsSync(PRODUCTS_JSON)) {
    try {
      const data = fs.readFileSync(PRODUCTS_JSON, 'utf-8');
      return JSON.parse(data);
    } catch (e) {
      console.error('[Update Engine] Could not parse existing products.json:', e.message);
    }
  }
  return [];
}

async function runUpdate() {
  ensureDirectories();

  const startTimeObj = new Date();
  const startTimeStr = getTurkeyFormattedDate(startTimeObj);
  console.log(`==================================================`);
  console.log(`[Update Engine] Starting catalog sync at: ${startTimeStr} (Europe/Istanbul)`);

  let errors = [];
  let scrapedProducts = [];
  let existingProducts = readExistingProducts();

  try {
    scrapedProducts = await scrapeIstikbalProducts();
  } catch (err) {
    const errorMsg = `Scraper error: ${err.message}`;
    console.error(`[Update Engine] ${errorMsg}`);
    errors.push(errorMsg);
  }

  // Safety check: Never overwrite with empty dataset
  if (!scrapedProducts || scrapedProducts.length === 0) {
    const criticalError = "Veri çekme işlemi başarısız veya 0 ürün döndü. Mevcut ürün dosyası korundu.";
    errors.push(criticalError);
    console.warn(`[Update Engine] WARNING: ${criticalError}`);

    const endTimeStr = getTurkeyFormattedDate(new Date());
    writeLog({
      startTimeStr,
      endTimeStr,
      totalCount: existingProducts.length,
      addedCount: 0,
      updatedCount: 0,
      removedCount: 0,
      errors
    });
    return;
  }

  // Calculate metrics (Added, Updated, Removed)
  const existingMap = new Map(existingProducts.map(p => [p.id, p]));
  let addedCount = 0;
  let updatedCount = 0;

  const nowISO = new Date().toISOString();

  const finalProducts = scrapedProducts.map(newProd => {
    if (!existingMap.has(newProd.id)) {
      addedCount++;
      return {
        ...newProd,
        createdAt: nowISO,
        updatedAt: nowISO
      };
    } else {
      const oldProd = existingMap.get(newProd.id);

      // Safe merge: Never discard existing enriched specs/bundleItems if newProd had a transient network drop
      const mergedBundleItems = (newProd.bundleItems && newProd.bundleItems.length > 0)
        ? newProd.bundleItems
        : (oldProd.bundleItems || null);

      const mergedSku = newProd.sku || oldProd.sku || null;
      const mergedDetails = { ...(oldProd.details || {}), ...(newProd.details || {}) };
      const mergedImages = (newProd.images && newProd.images.length > 0) ? newProd.images : oldProd.images;

      const isChanged = oldProd.price !== newProd.price || 
                        oldProd.originalPrice !== newProd.originalPrice ||
                        oldProd.sku !== mergedSku ||
                        JSON.stringify(oldProd.bundleItems) !== JSON.stringify(mergedBundleItems) ||
                        oldProd.name !== newProd.name;

      if (isChanged) {
        updatedCount++;
      }
      return {
        ...newProd,
        bundleItems: mergedBundleItems,
        sku: mergedSku,
        details: mergedDetails,
        images: mergedImages,
        createdAt: oldProd.createdAt || nowISO,
        updatedAt: isChanged ? nowISO : (oldProd.updatedAt || nowISO)
      };
    }
  });

  const scrapedIds = new Set(scrapedProducts.map(p => p.id));
  const removedCount = existingProducts.filter(p => !scrapedIds.has(p.id)).length;

  try {
    const jsonOutput = JSON.stringify(finalProducts, null, 2);
    fs.writeFileSync(PRODUCTS_TMP_JSON, jsonOutput, 'utf-8');

    const tmpStats = fs.statSync(PRODUCTS_TMP_JSON);
    if (tmpStats.size > 100) {
      // 1. Target data/products.json
      fs.renameSync(PRODUCTS_TMP_JSON, PRODUCTS_JSON);
      console.log(`[Update Engine] Saved ${finalProducts.length} items to data/products.json.`);

      // 2. Mirror to public/data/products.json for runtime dynamic fetch
      fs.writeFileSync(path.join(PUBLIC_DATA_DIR, 'products.json'), jsonOutput, 'utf-8');

      // 3. If dist exists, mirror to dist/data/products.json
      if (fs.existsSync(path.join(ROOT_DIR, 'dist'))) {
        if (!fs.existsSync(DIST_DATA_DIR)) fs.mkdirSync(DIST_DATA_DIR, { recursive: true });
        fs.writeFileSync(path.join(DIST_DATA_DIR, 'products.json'), jsonOutput, 'utf-8');
      }
    } else {
      throw new Error("Temporary JSON file size is suspiciously small.");
    }

    const endTimeObj = new Date();
    const endTimeStr = getTurkeyFormattedDate(endTimeObj);

    // Save Last Update Metadata
    const updateMeta = {
      lastUpdate: endTimeStr,
      formattedText: `Son güncelleme: ${endTimeStr}`,
      timestamp: endTimeObj.toISOString(),
      status: "success",
      totalProducts: finalProducts.length,
      metrics: {
        added: addedCount,
        updated: updatedCount,
        removed: removedCount
      }
    };
    const updateMetaJson = JSON.stringify(updateMeta, null, 2);

    fs.writeFileSync(LAST_UPDATE_JSON, updateMetaJson, 'utf-8');
    fs.writeFileSync(path.join(PUBLIC_DATA_DIR, 'last_update.json'), updateMetaJson, 'utf-8');
    if (fs.existsSync(DIST_DATA_DIR)) {
      fs.writeFileSync(path.join(DIST_DATA_DIR, 'last_update.json'), updateMetaJson, 'utf-8');
    }

    writeLog({
      startTimeStr,
      endTimeStr,
      totalCount: finalProducts.length,
      addedCount,
      updatedCount,
      removedCount,
      errors
    });

    console.log(`[Update Engine] Sync complete at ${endTimeStr}. Added: ${addedCount}, Updated: ${updatedCount}, Total: ${finalProducts.length}`);
    console.log(`==================================================`);

  } catch (writeErr) {
    const errStr = `JSON yazma hatası: ${writeErr.message}`;
    console.error(`[Update Engine] ${errStr}`);
    errors.push(errStr);

    if (fs.existsSync(PRODUCTS_TMP_JSON)) {
      try { fs.unlinkSync(PRODUCTS_TMP_JSON); } catch (_) {}
    }

    const endTimeStr = getTurkeyFormattedDate(new Date());
    writeLog({
      startTimeStr,
      endTimeStr,
      totalCount: existingProducts.length,
      addedCount: 0,
      updatedCount: 0,
      removedCount: 0,
      errors
    });
  }
}

function writeLog({ startTimeStr, endTimeStr, totalCount, addedCount, updatedCount, removedCount, errors }) {
  const logLines = [
    `--------------------------------------------------`,
    `Güncellemenin Başladığı Saat : ${startTimeStr}`,
    `Güncellemenin Tamamlandığı Saat: ${endTimeStr}`,
    `Bulunan Toplam Ürün Sayısı     : ${totalCount}`,
    `Yeni Eklenen Ürün Sayısı       : ${addedCount}`,
    `Güncellenen Ürün Sayısı        : ${updatedCount}`,
    `Kaldırılan Ürün Sayısı          : ${removedCount}`,
    `Oluşan Hatalar                 : ${errors.length > 0 ? errors.join('; ') : 'Yok (Başarılı)'}`,
    `--------------------------------------------------`,
    ``
  ].join('\n');

  try {
    fs.appendFileSync(LOG_FILE, logLines, 'utf-8');
  } catch (err) {
    console.error('[Update Engine] Failed to write log file:', err.message);
  }
}

runUpdate();
