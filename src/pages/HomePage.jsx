import React from 'react';
import { 
  ArrowRight, 
  Phone, 
  ShieldCheck, 
  Truck, 
  Sparkles, 
  Award,
  Tag
} from 'lucide-react';
import { WhatsAppIcon } from '../components/WhatsAppIcon';
import { ProductCard } from '../components/ProductCard';
import { siteConfig } from '../config/siteConfig';

export function HomePage({ products, onSelectProduct, setActivePage, setSelectedCategory }) {
  const categories = Array.from(new Set(products.map(p => p.category)));
  const featuredProducts = products.slice(0, 6);

  return (
    <div className="animate-fade-in">
      {/* Hero Showcase Section */}
      <section className="hero-section">
        <div className="hero-content">
          
          <div className="hero-badges">
            <span className="hero-badge-primary">
              <Sparkles size={14} /> İstikbal Yetkili Bayi
            </span>
            <span className="hero-badge-glass">
              <Tag size={14} style={{ color: 'var(--accent-gold)' }} /> {siteConfig.campaignBanner}
            </span>
          </div>

          <h1 className="hero-title">
            İstikbal Kalitesi ve Yılmazlar Güvencesi Evinizde
          </h1>

          <p className="hero-desc">
            Oturma gruplarından yatak odalarına, yemek masalarından halı ve ev tekstiline kadar yüzlerce güncel İstikbal modelini inceleyin. Mağaza fiyatları ve özel indirimler için temsilcimizle WhatsApp'tan görüşün.
          </p>

          <div className="hero-cta-row">
            <button 
              onClick={() => { setActivePage('products'); window.scrollTo(0,0); }} 
              className="btn-primary hero-cta-primary"
            >
              <span>Kataloğu İncele ({products.length} Ürün)</span>
              <ArrowRight size={18} />
            </button>

            <a 
              href={siteConfig.getGeneralWhatsAppLink()} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-whatsapp hero-cta-wa"
            >
              <WhatsAppIcon size={20} />
              <span>WhatsApp Bilgi Al</span>
            </a>
          </div>
        </div>
      </section>

      {/* Feature Highlights Banner */}
      <section className="container" style={{ marginBottom: '3.5rem' }}>
        <div className="features-grid">
          <div className="feature-item">
            <div className="feature-icon-box">
              <Award size={24} />
            </div>
            <div>
              <h4 className="feature-title">Orijinal İstikbal Garantisi</h4>
              <p className="feature-desc">2 Yıl resmi fabrika garantisi</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon-box">
              <Truck size={24} />
            </div>
            <div>
              <h4 className="feature-title">Teslimat ve Montaj Hizmeti</h4>
              <p className="feature-desc">Uzman ekibimizle kapınıza teslimat</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon-box">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="feature-title">Doğrudan Temsilci Desteği</h4>
              <p className="feature-desc">{siteConfig.phoneDisplay} hattımızdan bilgi</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories Grid */}
      <section className="container" style={{ marginBottom: '4.5rem' }}>
        <div className="section-header">
          <span className="section-tag">Kategoriler</span>
          <h2 className="section-title">Mobilya & Ev Tekstili Koleksiyonları</h2>
          <p className="section-desc">Evinizin her odası için özenle tasarlanmış İstikbal mobilya modellerini keşfedin.</p>
        </div>

        <div className="categories-grid">
          {categories.map((catName) => {
            const categoryProducts = products.filter(p => p.category === catName);
            const count = categoryProducts.length;
            const sampleProduct = categoryProducts.find(p => p.images && p.images.length > 0);
            const bgImg = sampleProduct ? sampleProduct.images[0] : "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80";

            return (
              <div 
                key={catName}
                onClick={() => {
                  setSelectedCategory(catName);
                  setActivePage('products');
                  window.scrollTo(0, 0);
                }}
                className="category-banner-card"
              >
                <div 
                  className="category-card-bg"
                  style={{
                    background: `linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.85) 100%), url("${bgImg}") center/cover no-repeat`
                  }}
                />
                <div className="category-card-content">
                  <span className="category-card-count">
                    {count} Ürün
                  </span>
                  <h3 className="category-card-name">
                    {catName}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Popular Showcase Products */}
      <section className="container" style={{ marginBottom: '4.5rem' }}>
        <div className="products-header">
          <div>
            <span className="section-tag">Vitrin Modelleri</span>
            <h2 className="section-title">Öne Çıkan Ürünlerimiz</h2>
          </div>
          <button 
            onClick={() => { setActivePage('products'); window.scrollTo(0,0); }}
            className="btn-outline products-header-btn"
          >
            Tümünü Gör ({products.length})
          </button>
        </div>

        <div className="grid-3">
          {featuredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onSelectProduct={onSelectProduct} 
            />
          ))}
        </div>
      </section>

      {/* Quick Contact & Inquiry Banner */}
      <section className="container" style={{ marginBottom: '2rem' }}>
        <div className="cta-banner">
          <div className="cta-banner-text">
            <h3 className="cta-banner-title">
              Mobilyalarınız İçin Özel Fiyat Teklifi Alın
            </h3>
            <p className="cta-banner-desc">
              Mağazamızı ziyaret edebilir veya satış temsilcimizle WhatsApp üzerinden iletişime geçerek indirim ve ödeme seçeneklerini öğrenebilirsiniz.
            </p>
          </div>

          <div className="cta-banner-actions">
            <a href={`tel:${siteConfig.phoneRaw}`} className="btn-phone cta-banner-btn">
              <Phone size={18} />
              <span>{siteConfig.phoneDisplay}</span>
            </a>
            <a 
              href={siteConfig.getGeneralWhatsAppLink()} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-whatsapp cta-banner-btn"
            >
              <WhatsAppIcon size={18} />
              <span>WhatsApp İletişim</span>
            </a>
          </div>
        </div>
      </section>

      <style>{`
        /* Hero Section */
        .hero-section {
          position: relative;
          min-height: 540px;
          border-radius: var(--radius-lg);
          overflow: hidden;
          margin: 1.25rem auto 3rem auto;
          display: flex;
          align-items: center;
          background: linear-gradient(90deg, rgba(20, 18, 16, 0.92) 0%, rgba(30, 26, 22, 0.65) 60%, rgba(0, 0, 0, 0.3) 100%), url("https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1800&q=80") center/cover no-repeat;
          color: #FFF;
          padding: 3.5rem 2.5rem;
          box-shadow: var(--shadow-lg);
          border: 1px solid rgba(212, 175, 55, 0.25);
        }
        .hero-content {
          max-width: 680px;
          position: relative;
          z-index: 2;
        }
        .hero-badges {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          margin-bottom: 1.25rem;
        }
        .hero-badge-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: linear-gradient(135deg, var(--accent-wood), var(--accent-amber));
          color: #FFF;
          padding: 0.35rem 0.9rem;
          border-radius: var(--radius-full);
          font-size: 0.82rem;
          font-weight: 800;
          letter-spacing: 0.5px;
        }
        .hero-badge-glass {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.25);
          color: #FCE0C8;
          padding: 0.35rem 0.9rem;
          border-radius: var(--radius-full);
          font-size: 0.82rem;
          font-weight: 700;
          backdrop-filter: blur(6px);
        }
        .hero-title {
          font-family: var(--font-serif);
          font-size: clamp(2.2rem, 4.5vw, 3.6rem);
          font-weight: 800;
          line-height: 1.15;
          margin-bottom: 1.25rem;
          color: #FFF;
          text-shadow: 0 2px 10px rgba(0,0,0,0.5);
        }
        .hero-desc {
          font-size: 1.1rem;
          color: #E5DED5;
          line-height: 1.6;
          margin-bottom: 2.25rem;
          max-width: 600px;
        }
        .hero-cta-row {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .hero-cta-primary {
          padding: 0.9rem 2.25rem;
          font-size: 1.05rem;
          border-radius: var(--radius-full);
          background: linear-gradient(135deg, var(--accent-wood) 0%, var(--accent-amber) 100%);
          box-shadow: 0 6px 20px rgba(140, 90, 60, 0.4);
        }
        .hero-cta-wa {
          padding: 0.9rem 1.85rem;
          font-size: 1.05rem;
          border-radius: var(--radius-full);
        }

        /* Features Grid */
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          background: var(--bg-card);
          padding: 1.85rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-subtle);
          box-shadow: var(--shadow-sm);
        }
        .feature-item {
          display: flex;
          gap: 1rem;
          align-items: center;
        }
        .feature-icon-box {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: var(--accent-amber-light);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent-wood);
          flex-shrink: 0;
        }
        .feature-title {
          font-size: 1rem;
          font-weight: 700;
        }
        .feature-desc {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        /* Categories Grid */
        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 1.5rem;
        }
        .category-banner-card {
          position: relative;
          height: 210px;
          border-radius: var(--radius-md);
          overflow: hidden;
          cursor: pointer;
          box-shadow: var(--shadow-sm);
          transition: all 0.3s ease;
        }
        .category-card-bg {
          position: absolute;
          inset: 0;
          transition: transform 0.5s ease;
        }
        .category-banner-card:hover .category-card-bg {
          transform: scale(1.08);
        }
        .category-card-content {
          position: relative;
          z-index: 2;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 1.35rem;
          color: #FFF;
        }
        .category-card-count {
          font-size: 0.78rem;
          opacity: 0.9;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 700;
          color: var(--accent-gold);
        }
        .category-card-name {
          font-size: 1.25rem;
          font-weight: 700;
          font-family: var(--font-serif);
          margin-top: 0.2rem;
        }

        /* Products Header */
        .products-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          text-align: left;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 2.5rem;
        }
        .products-header-btn {
          border-radius: var(--radius-full);
          padding: 0.6rem 1.35rem;
          font-size: 0.9rem;
        }

        /* CTA Banner */
        .cta-banner {
          background: linear-gradient(135deg, #2A241F 0%, #1A1815 100%);
          border-radius: var(--radius-lg);
          padding: 3rem 2.5rem;
          color: #FFF;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 2rem;
          box-shadow: var(--shadow-md);
          border: 1px solid rgba(212, 175, 55, 0.2);
        }
        .cta-banner-text {
          max-width: 600px;
        }
        .cta-banner-title {
          font-family: var(--font-serif);
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
          color: #FFF;
        }
        .cta-banner-desc {
          color: #C8BEB3;
          font-size: 1.05rem;
          line-height: 1.5;
        }
        .cta-banner-actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .cta-banner-btn {
          border-radius: var(--radius-full);
        }

        /* ========= MOBILE RESPONSIVE ========= */
        @media (max-width: 768px) {
          .hero-section {
            min-height: 420px;
            padding: 2.5rem 1.5rem;
            margin: 0.75rem auto 2rem auto;
            border-radius: var(--radius-md);
          }
          .hero-title {
            font-size: clamp(1.6rem, 6vw, 2.4rem);
          }
          .hero-desc {
            font-size: 0.95rem;
            margin-bottom: 1.5rem;
          }
          .hero-cta-primary,
          .hero-cta-wa {
            padding: 0.75rem 1.5rem;
            font-size: 0.92rem;
            width: 100%;
            justify-content: center;
          }
          .hero-cta-row {
            flex-direction: column;
            gap: 0.75rem;
          }
          .hero-badge-glass {
            font-size: 0.72rem;
            padding: 0.25rem 0.65rem;
          }
          .hero-badge-primary {
            font-size: 0.72rem;
            padding: 0.25rem 0.65rem;
          }
          .features-grid {
            grid-template-columns: 1fr;
            padding: 1.25rem;
            gap: 1rem;
          }
          .categories-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.85rem;
          }
          .category-banner-card {
            height: 160px;
          }
          .category-card-content {
            padding: 0.85rem;
          }
          .category-card-name {
            font-size: 1rem;
          }
          .category-card-count {
            font-size: 0.7rem;
          }
          .products-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
            margin-bottom: 1.5rem;
          }
          .cta-banner {
            padding: 2rem 1.25rem;
            border-radius: var(--radius-md);
            flex-direction: column;
            text-align: center;
            align-items: stretch;
          }
          .cta-banner-title {
            font-size: 1.5rem;
          }
          .cta-banner-desc {
            font-size: 0.92rem;
          }
          .cta-banner-actions {
            flex-direction: column;
          }
          .cta-banner-btn {
            width: 100%;
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .hero-section {
            min-height: 360px;
            padding: 1.75rem 1rem;
            margin: 0.5rem auto 1.5rem auto;
            border-radius: var(--radius-sm);
          }
          .hero-title {
            font-size: 1.5rem;
            margin-bottom: 0.85rem;
          }
          .hero-desc {
            font-size: 0.88rem;
            margin-bottom: 1.25rem;
          }
          .categories-grid {
            grid-template-columns: 1fr 1fr;
            gap: 0.65rem;
          }
          .category-banner-card {
            height: 130px;
          }
          .category-card-name {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
}
