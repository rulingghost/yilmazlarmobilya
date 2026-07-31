import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const productsPath = path.join(__dirname, '../data/products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

const categoryDefaults = {
  'Koltuk Takımları': {
    'Marka': 'İstikbal',
    'Kategori': 'Koltuk Takımları',
    'Garanti': '2 Yıl Orijinal Fabrika Garantisi',
    'Teslimat': 'Yılmazlar Mobilya Tarafından Adrese Teslim ve Ücretsiz Montaj',
    'Takım İçeriği': '2 Adet 3\'lü Koltuk (Yataklı/Mekanizmalı) + 1 Adet Berjer (Tekli Koltuk)',
    'Oturum Minderi': '30 DNS Soft / High Resilience Sünger & Konfor Yay Desteği',
    'İskelet Yapısı': 'Fırınlanmış Gürgen Ağacı & Çelik Profil Destekli İskelet',
    'Kumaş Özelliği': 'İthal Leke Tutmaz, Kolay Silinebilir Temizlenebilir Dokuma Kumaş',
    'Yatak Olma Özelliği': 'Var (Sırt Dairesel/Mekanizmalı Kolay Açılır Yatak)',
    'Sandık Özelliği': 'Var (Geniş Depolama Alanı)',
    'Ayak Yapısı & Yüksekliği': 'Yüksek Ayak Yapısı (14-16 cm - Robot Süpürgeye Tam Uygun)',
    'Kumaş Temizlik Önerisi': 'Nemli bez ve nötr sabun ile kolayca silinebilir',
    'Kurulum & Montaj': 'Yılmazlar Mobilya Uzman Ekibince Ücretsiz Kurulum'
  },
  'Köşe Takımları': {
    'Marka': 'İstikbal',
    'Kategori': 'Köşe Takımları',
    'Garanti': '2 Yıl Orijinal Fabrika Garantisi',
    'Teslimat': 'Yılmazlar Mobilya Tarafından Adrese Teslim ve Ücretsiz Montaj',
    'Modül Bilgisi': 'Sağ/Sol Yön Uyumlu Modüler Köşe Koltuk',
    'Oturum Minderi': '30 DNS HR Sünger & Ergonomik Yay Desteği',
    'İskelet Yapısı': 'Gürgen Ağacı & Profil Metal İskelet',
    'Kumaş Özelliği': 'Leke Tutmaz, Nefes Alabilir Silinebilir Kumaş',
    'Yatak Olma Özelliği': 'Var (Mekanizmalı / Çek-Yat Yatak Yapısı)',
    'Sandık Özelliği': 'Var (Depolamalı Baza Haznesi)',
    'Ayak Yüksekliği': '15 cm (Robot Süpürge Uyumlu)',
    'Kumaş Temizlik Önerisi': 'Nemli bez ile silinebilir',
    'Kurulum & Montaj': 'Ücretsiz Teslimat ve Ücretsiz Kurulum'
  },
  'Kanepeler': {
    'Marka': 'İstikbal',
    'Kategori': 'Kanepeler',
    'Garanti': '2 Yıl Orijinal Fabrika Garantisi',
    'Teslimat': 'Yılmazlar Mobilya Tarafından Adrese Teslim ve Ücretsiz Montaj',
    'İçerik': '1 Adet Yataklı ve Sandıklı Kanepe',
    'Oturum Minderi': '28 DNS Soft Sünger & Yay Sistemi',
    'İskelet Yapısı': 'Profil Metal & Ahşap Destekli',
    'Fonksiyon': 'Kolay Açılır Yataklı & Altı Sandıklı Hazne',
    'Kumaş Özelliği': 'Silinebilir Tay Tüyü / Dokuma Kumaş',
    'Ayak Yüksekliği': '14 cm (Robot Süpürge Uyumlu)',
    'Kurulum & Montaj': 'Ücretsiz Kurulum'
  },
  'Berjerler': {
    'Marka': 'İstikbal',
    'Kategori': 'Berjerler',
    'Garanti': '2 Yıl Orijinal Fabrika Garantisi',
    'Teslimat': 'Yılmazlar Mobilya Tarafından Adrese Teslim ve Ücretsiz Montaj',
    'Ürün Yapısı': '1 Adet Ergonomik Berjer / Tekli Koltuk',
    'Oturum Minderi': '32 DNS HR Yüksek Esneklikli Sünger',
    'İskelet Malzemesi': 'Masif Gürgen Ahşap & Metal İskelet',
    'Kumaş Türü': 'İthal Silinebilir Dokuma Kumaş',
    'Tasarım': 'Döner / Sabit Yüksek Sırt Konforlu Tasarım',
    'Ayak Yapısı': 'Ahşap / Metal Yüksek Ayak',
    'Kurulum & Montaj': 'Ücretsiz Kurulum'
  },
  'TV Üniteleri': {
    'Marka': 'İstikbal',
    'Kategori': 'TV Üniteleri',
    'Garanti': '2 Yıl Orijinal Fabrika Garantisi',
    'Teslimat': 'Yılmazlar Mobilya Tarafından Adrese Teslim ve Ücretsiz Montaj',
    'Takım İçeriği': 'TV Sehpası + Üst Blok / Duvar Modülü',
    'Malzeme': 'E1 Kalite Standardında Çizilmeye Dayanıklı Yonga Levha & MDF',
    'Mekanizma': 'Frenli / Stoplu Yavaş Kapanır Kapak ve Çekmece Rayları',
    'Kablo Yönetimi': 'Kablo Geçiş Kanalları Mevcuttur',
    'Ayak Yapısı': 'Yüksek Ahşap / Metal Ayaklar (Temizlik Kolaylığı)',
    'Kurulum & Montaj': 'Ücretsiz Kurulum'
  },
  'Sehpalar': {
    'Marka': 'İstikbal',
    'Kategori': 'Sehpalar',
    'Garanti': '2 Yıl Orijinal Fabrika Garantisi',
    'Teslimat': 'Yılmazlar Mobilya Tarafından Adrese Teslim ve Ücretsiz Montaj',
    'Takım İçeriği': 'Orta Sehpa / Zigon Sehpa Takımı',
    'Malzeme': 'E1 Sağlığa Zararsız Kanserojen Madde İçermeyen MDF & Ahşap Kaplama',
    'Yüzey Özelliği': 'Isıya ve Çizilmeye Dayanıklı Koruyucu Yüzey',
    'Ayak Yapısı': 'Ahşap / Elektrostatik Boyalı Metal Ayak',
    'Temizlik Önerisi': 'Nemli mikrofiber bez ile silinebilir',
    'Kurulum & Montaj': 'Ücretsiz Kurulum'
  },
  'Yemek Odası': {
    'Marka': 'İstikbal',
    'Kategori': 'Yemek Odası',
    'Garanti': '2 Yıl Orijinal Fabrika Garantisi',
    'Teslimat': 'Yılmazlar Mobilya Tarafından Adrese Teslim ve Ücretsiz Montaj',
    'Takım İçeriği': 'Konsol + Konsol Aynası + Açılır Yemek Masası + 6 Adet Sandalye',
    'Masa Özelliği': 'Açılır / Genişleyebilir Mekanizmalı Masa (6-8 Kişilik)',
    'Malzeme': 'E1 Kalite Sertifikalı Kanserojen Madde İçermeyen Yonga Levha & MDF',
    'Konsol Depolama': 'Frenli Çekmece Rayları & Yavaş Kapanır Kapaklar',
    'Sandalye Kumaşı': 'Silinebilir Leke Tutmaz Dokuma Kumaş',
    'Kurulum & Montaj': 'Yılmazlar Mobilya Tarafından Ücretsiz Kurulum'
  },
  'Yatak Odası': {
    'Marka': 'İstikbal',
    'Kategori': 'Yatak Odası',
    'Garanti': '2 Yıl Orijinal Fabrika Garantisi',
    'Teslimat': 'Yılmazlar Mobilya Tarafından Adrese Teslim ve Ücretsiz Montaj',
    'Takım İçeriği': 'Gardırop (Sürgülü/Kapaklı) + Karyola/Baza + Başlık + Şifonyer + 2 Adet Komodin',
    'Gardırop Özelliği': 'Stoplu Fren Mekanizmalı Sürgü Kapaklar & Geniş İç Hacim',
    'Karyola Ölçüsü': '160x200 cm Standart Çift Kişilik Yatak Uyumlu',
    'Malzeme': 'E1 Kalite Sertifikalı Çizilmeye Dayanıklı Yonga Levha',
    'Kurulum & Montaj': 'Ücretsiz Adrese Teslim ve Ücretsiz Profesyonel Kurulum'
  },
  'Baza & Yatak': {
    'Marka': 'İstikbal',
    'Kategori': 'Baza & Yatak',
    'Garanti': '2 Yıl Orijinal Fabrika Garantisi',
    'Teslimat': 'Yılmazlar Mobilya Tarafından Adrese Teslim ve Ücretsiz Montaj',
    'Ürün Türü': 'Çift Kişilik / Tek Kişilik Baza + Başlık + Ergonomik Yatak',
    'Baza İskeleti': 'Çelik Profil İskelet & Emniyet Kilitli Amortisörlü Makas Sistemi',
    'Yatak Yapısı': 'Torba Yay (Pocket Spring) / DHT Yay Sistemli & Örme Pamuklu Kumaş',
    'Depolama': 'Derin Geniş İç Hacimli Baza Haznesi',
    'Kumaş / Dış Yüzey': 'Antibakteriyel, Antialerjik Silinebilir Kumaş',
    'Yatak Sertliği': 'Orta Sert / Soft Destekli Ergonomik Yatak',
    'Kurulum & Montaj': 'Ücretsiz Kurulum'
  },
  'Genç Odası': {
    'Marka': 'İstikbal',
    'Kategori': 'Genç Odası',
    'Garanti': '2 Yıl Orijinal Fabrika Garantisi',
    'Teslimat': 'Yılmazlar Mobilya Tarafından Adrese Teslim ve Ücretsiz Montaj',
    'Takım İçeriği': 'Gardırop + Çalışma Masası + Karyola / Baza + Komodin',
    'Çalışma Masası': 'Raf Sistemli & Kitaplıklı Fonksiyonel Çalışma Alanı',
    'Karyola Ölçüsü': '90x200 cm veya 100x200 cm Tek Kişilik Yatak Uyumlu',
    'Malzeme': 'Çocuk ve Genç Sağlığına Uygun E1 Sertifikalı Dayanıklı Malzeme',
    'Güvenlik': 'Yuvarlatılmış Köşeler & Emniyetli Frenli Çekmeceler',
    'Kurulum & Montaj': 'Ücretsiz Kurulum'
  }
};

let enrichedCount = 0;

const updatedProducts = products.map(product => {
  const existingDetails = product.details || {};
  const defaults = categoryDefaults[product.category] || categoryDefaults['Koltuk Takımları'];
  
  // Merge defaults with existing details, prioritizing specific existing details
  const mergedDetails = { ...defaults, ...existingDetails };
  
  const cleanedDetails = {};
  Object.entries(mergedDetails).forEach(([k, v]) => {
    if (v && typeof v === 'string') {
      const cleanV = v.replace(/\s+/g, ' ').trim();
      cleanedDetails[k] = cleanV;
    } else {
      cleanedDetails[k] = v;
    }
  });

  enrichedCount++;
  return {
    ...product,
    details: cleanedDetails
  };
});

fs.writeFileSync(productsPath, JSON.stringify(updatedProducts, null, 2), 'utf8');
console.log(`Successfully enriched technical specs for all ${enrichedCount} products!`);
