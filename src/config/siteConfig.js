// Centralized configuration file for Yılmazlar İstikbal Mobilya website
// Extracted from official Wix site & updated with exact contact information and official logo.

export const siteConfig = {
  name: "Yılmazlar İstikbal Mobilya",
  shortName: "Yılmazlar İstikbal",
  tagline: "İstikbal Kalitesi ve Yılmazlar Güvencesiyle Evlerinizde",
  logoText: "Yılmazlar Mobilya",
  logoSubtext: "İstikbal Yetkili Bayi",
  developerCredit: "sarfea",

  // Main Brand Logo Image
  logoUrl: "/images/logo.png",

  brandBadges: [
    { name: "İstikbal", subtitle: "Yetkili Bayi" },
    { name: "Gümüşsuyu", subtitle: "Halı & Tekstil" },
    { name: "Doqu Home", subtitle: "Ev Tekstili" }
  ],
  
  // Contact details
  phoneDisplay: "0546 961 01 31",
  phoneRaw: "+905469610131",
  
  secondaryPhones: [
    { label: "Ankara Siteler Şube 1", display: "0 312 348 87 63", raw: "+903123488763" },
    { label: "Ankara Siteler Şube 2", display: "0 312 350 77 92", raw: "+903123507792" },
    { label: "Müşteri Hizmetleri", display: "0 312 350 16 02", raw: "+903123501602" }
  ],
  
  whatsappDisplay: "0546 961 01 31",
  whatsappRaw: "905469610131",
  
  address: "Siteler Mobilyacılar Çarşısı, Altındağ / Ankara",
  city: "Ankara & İstanbul, Türkiye",
  email: "yilmazlar@yilmazlarmobilya.com",
  
  // Map iframe src & direct Google Maps navigation URL
  googleMapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3058.468761895313!2d32.9094121!3d39.953258!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14d350f96bc8e6eb%3A0xb3629e46a7df1e2!2sSiteler%2C%20Alt%C4%B1nda%C4%9F%2FAnkara!5e0!3m2!1str!2str!4v1700000000000!5m2!1str!2str",
  googleMapsDirectUrl: "https://maps.google.com/?q=Siteler+Altindag+Ankara+Yilmazlar+Istikbal",

  // Social Media Links
  instagram: "https://instagram.com/yilmazlar.istikbal.mobilya",
  facebook: "https://facebook.com/yilmazlaristikbalmobilya",

  // Special campaigns extracted from Wix site
  campaignBanner: "3'lü Düğün Paketi 99.000 TL'den Başlayan Fiyatlarla!",

  // Business Working Hours
  workingHours: {
    weekdays: "Pazartesi - Cumartesi: 09:00 - 20:00",
    sunday: "Pazar: 11:00 - 19:00",
  },
  
  // Custom pre-filled WhatsApp inquiry link for a product
  getWhatsAppLink: (productName) => {
    const encodedMessage = encodeURIComponent(
      `Merhaba, Yılmazlar İstikbal Mobilya web sitenizde gördüğüm [${productName}] hakkında detaylı bilgi, stok durumu ve güncel fiyat teklifi almak istiyorum.`
    );
    return `https://wa.me/${siteConfig.whatsappRaw}?text=${encodedMessage}`;
  },

  // General WhatsApp message link
  getGeneralWhatsAppLink: () => {
    const encodedMessage = encodeURIComponent(
      `Merhaba, Yılmazlar İstikbal Mobilya web sitenizden ulaşıyorum. Mobilya modelleriniz, indirimli düğün paketleriniz ve kampanya fiyatlarınız hakkında bilgi almak istiyorum.`
    );
    return `https://wa.me/${siteConfig.whatsappRaw}?text=${encodedMessage}`;
  }
};
