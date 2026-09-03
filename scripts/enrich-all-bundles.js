import fs from 'fs';

export function enrichAllSetBundles(products) {
  const setKeywords = [
    'koltuk takımı', 'koltuk takimi', 
    'köşe takımı', 'kose takimi', 
    'yemek odası takımı', 'yemek odasi takimi', 
    'yatak odası takımı', 'yatak odasi takimi', 
    'düğün paketi', 'dugun paketi', 
    'genç odası takımı', 'genc odasi takimi'
  ];

  let enrichedCount = 0;

  products.forEach(setProduct => {
    // If it already has bundleItems with items, skip
    if (setProduct.bundleItems && Array.isArray(setProduct.bundleItems) && setProduct.bundleItems.length > 0) {
      return;
    }

    const setNameLower = setProduct.name.toLowerCase();
    const isSet = setKeywords.some(kw => setNameLower.includes(kw));
    if (!isSet) return;

    // Extract series name
    let cleanSeries = setNameLower
      .replace(/koltuk tak[ıi]m[ıi]/g, '')
      .replace(/k[oö][sş]e tak[ıi]m[ıi]/g, '')
      .replace(/yemek odas[ıi] tak[ıi]m[ıi]/g, '')
      .replace(/yatak odas[ıi] tak[ıi]m[ıi]/g, '')
      .replace(/d[uü][gğ][uü]n paketi/g, '')
      .replace(/gen[cç] odas[ıi] tak[ıi]m[ıi]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    const seriesWords = cleanSeries.split(' ').filter(w => 
      w.length > 2 && !['krem', 'gri', 'bej', 'antrasit', 'ceviz', 'beyaz', 'kopya', 'sabit', 'yataklı'].includes(w)
    );
    const mainKey = seriesWords[0];
    if (!mainKey) return;

    // Find candidate items
    const matchingPieces = products.filter(p => {
      if (p.id === setProduct.id) return false;
      const pLower = p.name.toLowerCase();
      if (!pLower.includes(mainKey)) return false;
      // Skip if piece is another full set
      if (setKeywords.some(kw => pLower.includes(kw))) return false;

      if (setProduct.category === 'Koltuk Takımları') {
        if (pLower.includes('köşe') || pLower.includes('kose') || pLower.includes('uzanmalı')) return false;
        return p.category === 'Kanepeler' || p.category === 'Berjerler' || 
               pLower.includes('üçlü') || pLower.includes('ikili') || pLower.includes('berjer') || pLower.includes('koltuk');
      }
      if (setProduct.category === 'Köşe Takımları') {
        return p.category === 'Köşe Takımları' || p.category === 'Berjerler' || 
               pLower.includes('köşe') || pLower.includes('uzanmalı') || pLower.includes('berjer');
      }
      if (setProduct.category === 'Yemek Odası') {
        return pLower.includes('masa') || pLower.includes('sandalye') || pLower.includes('konsol') || pLower.includes('ayna');
      }
      if (setProduct.category === 'Yatak Odası') {
        return pLower.includes('gardırop') || pLower.includes('gardrop') || pLower.includes('karyola') || 
               pLower.includes('baza') || pLower.includes('şifonyer') || pLower.includes('komodin');
      }
      if (setProduct.category === 'Genç Odası') {
        return pLower.includes('karyola') || pLower.includes('dolap') || pLower.includes('çalışma masası') || pLower.includes('komodin');
      }
      return true;
    });

    if (matchingPieces.length > 0) {
      // Remove duplicate names if any
      const uniquePieces = [];
      const seenNames = new Set();
      matchingPieces.forEach(pc => {
        const simpleName = pc.name.replace(/\s+/g, ' ').trim();
        if (!seenNames.has(simpleName)) {
          seenNames.add(simpleName);
          uniquePieces.push(pc);
        }
      });

      // Build bundle items
      const hasIkili = uniquePieces.some(p => p.name.toLowerCase().includes('ikili'));
      const bundleItems = uniquePieces.map(pc => {
        const pcLower = pc.name.toLowerCase();
        let defaultQty = 1;
        if (pcLower.includes('berjer') && !pcLower.includes('orta')) {
          defaultQty = 2; // Standard set comes with 2 armchairs
        } else if (pcLower.includes('üçlü') && !hasIkili) {
          defaultQty = 2; // 3+3+B+B configuration
        } else if (pcLower.includes('sandalye')) {
          defaultQty = 6; // Standard dining set has 6 chairs
        } else if (pcLower.includes('komodin')) {
          defaultQty = 2; // Standard bedroom has 2 nightstands
        }

        // Extract dimension properties
        const dimensions = {};
        if (pc.details) {
          Object.entries(pc.details).forEach(([k, v]) => {
            if (k.toLowerCase().includes('genişlik') || k.toLowerCase().includes('derinlik') || k.toLowerCase().includes('yükseklik')) {
              dimensions[k] = v;
            }
          });
        }

        return {
          id: pc.id,
          name: pc.name,
          sku: pc.sku || '',
          defaultQty: defaultQty,
          quantity: defaultQty,
          price: pc.price,
          originalPrice: pc.originalPrice || null,
          totalPrice: pc.price * defaultQty,
          image: (pc.images && pc.images.length > 0) ? pc.images[0] : null,
          images: pc.images || [],
          dimensions: Object.keys(dimensions).length > 0 ? dimensions : { "Standart Ölçü": "Orijinal İstikbal Ölçüleri" },
          specs: pc.details || {}
        };
      });

      setProduct.bundleItems = bundleItems;
      enrichedCount++;
    }
  });

  return enrichedCount;
}

// If run directly via node
const isMain = process.argv[1] && process.argv[1].includes('enrich-all-bundles.js');
if (isMain) {
  const products = JSON.parse(fs.readFileSync('data/products.json', 'utf-8'));
  const count = enrichAllSetBundles(products);
  console.log(`Successfully enriched ${count} sets with real modular components!`);
  fs.writeFileSync('data/products.json', JSON.stringify(products, null, 2), 'utf-8');
  fs.writeFileSync('public/data/products.json', JSON.stringify(products, null, 2), 'utf-8');
}
