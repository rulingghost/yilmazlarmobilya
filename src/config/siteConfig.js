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
    { 
      name: "İstikbal", 
      subtitle: "Yetkili Bayi",
      logo: "/images/brand-istikbal.svg",
      link: "https://www.istikbal.com.tr"
    },
    { 
      name: "Gümüşsuyu", 
      subtitle: "Halı & Tekstil",
      logo: "/images/brand-gumussuyu.png",
      link: "https://www.gumussuyu.com.tr"
    },
    { 
      name: "Doqu Home", 
      subtitle: "Ev Tekstili",
      logo: "/images/brand-doquhome.webp",
      link: "https://www.doquhome.com.tr"
    }
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
  
  address: "Demirhendek Cad., No:158, Siteler, Altındağ / Ankara",
  coordinates: {
    lat: 39.954087,
    lng: 32.905199
  },
  city: "Ankara, Türkiye",
  email: "yilmazlar@yilmazlarmobilya.com",
  
  // Map iframe src & direct navigation URLs (Google & Yandex)
  googleMapsEmbedUrl: "https://maps.google.com/maps?q=39.954087,32.905199&hl=tr&z=17&output=embed",
  googleMapsDirectUrl: "https://www.google.com/maps/search/?api=1&query=39.954087,32.905199",
  yandexMapsDirectUrl: "https://yandex.com.tr/harita/?pt=32.905199,39.954087&z=17&l=map",

  // Social Media Links
  instagram: "https://instagram.com/yilmazlar.istikbal.mobilya",
  facebook: "https://facebook.com/yilmazlaristikbalmobilya",

  // Special campaigns
  campaignBanner: "",

  // Business Working Hours
  workingHours: {
    weekdays: "Pazartesi - Cumartesi: 09:00 - 19:00",
    sunday: "Pazar: 11:00 - 18:00",
    display: "Pzt - Cmt: 09:00 - 19:00 | Pazar: 11:00 - 18:00"
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
