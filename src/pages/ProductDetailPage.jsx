import React, { useState } from 'react';
import { 
  Phone, 
  ChevronLeft, 
  Sparkles
} from 'lucide-react';
import { WhatsAppIcon } from '../components/WhatsAppIcon';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { ProductCard } from '../components/ProductCard';
import { siteConfig } from '../config/siteConfig';

export function ProductDetailPage({ product, allProducts, onSelectProduct, onBack }) {
  const images = product.images && product.images.length > 0 ? product.images : [null];
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const currentImage = images[activeImageIndex] || images[0];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      maximumFractionDigits: 0
    }).format(price);
  };

  const similarProducts = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const whatsappUrl = siteConfig.getWhatsAppLink(product.name);

  return (
    <div className="animate-fade-in container" style={{ paddingTop: '1.5rem' }}>
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="detail-back-btn"
      >
        <ChevronLeft size={18} />
        <span>Tüm Ürünlere Dön</span>
      </button>

      {/* Main Product Layout */}
      <div className="detail-grid">
        {/* Left: Gallery */}
        <div>
          <div className="detail-main-image">
            <ImageWithFallback
              src={currentImage}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {images.length > 1 && (
              <span className="detail-image-counter">
                {activeImageIndex + 1} / {images.length} Fotoğraf
              </span>
            )}
          </div>

          {images.length > 1 && (
            <div>
              <div className="detail-thumb-label">
                Tüm Fotoğraf Galerisi ({images.length} Görsel):
              </div>
              <div className="detail-thumb-row">
                {images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`detail-thumb ${activeImageIndex === idx ? 'detail-thumb-active' : ''}`}
                  >
                    <ImageWithFallback
                      src={imgUrl}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Details */}
        <div className="detail-info">
          {/* Category Tag */}
          <div className="detail-tags">
            <span className="section-tag" style={{ margin: 0 }}>
              {product.category}
            </span>
            {product.isNew && (
              <span className="detail-new-badge">
                Yeni Sezon
              </span>
            )}
          </div>

          <h1 className="detail-title">{product.name}</h1>

          {/* Price */}
          <div className="detail-price-box">
            <div>
              <div className="detail-price-label">Güncel İstikbal Fiyatı</div>
              <div className="detail-price-value">{formatPrice(product.price)}</div>
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <div className="detail-price-old">{formatPrice(product.originalPrice)}</div>
            )}
          </div>

          {product.shortDescription && (
            <p className="detail-desc">{product.shortDescription}</p>
          )}

          {/* CTA Buttons */}
          <div className="detail-cta-grid">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp detail-cta-btn"
            >
              <WhatsAppIcon size={22} />
              <span>WhatsApp'tan Sor</span>
            </a>
            <a
              href={`tel:${siteConfig.phoneRaw}`}
              className="btn-phone detail-cta-btn"
            >
              <Phone size={22} />
              <span>Telefonla Bilgi Al</span>
            </a>
          </div>

          {/* Specs */}
          {product.details && Object.keys(product.details).length > 0 && (
            <div className="detail-specs-card">
              <h3 className="detail-specs-title">
                <Sparkles size={18} style={{ color: 'var(--accent-wood)' }} />
                Ürün Detayları & Teknik Özellikler
              </h3>
              <div className="detail-specs-list">
                {Object.entries(product.details).map(([key, val]) => (
                  <div key={key} className={`detail-spec-row ${key === 'Öne Çıkan Özellikler' ? 'detail-spec-column' : ''}`}>
                    <span className="detail-spec-key">{key}:</span>
                    <span className="detail-spec-val">
                      {Array.isArray(val) ? val.join(', ') : val}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <section className="detail-similar-section">
          <div className="section-header" style={{ textAlign: 'left', marginBottom: '2rem' }}>
            <span className="section-tag">Kombin Önerileri</span>
            <h2 className="section-title">Benzer Ürünler</h2>
          </div>
          <div className="grid-3">
            {similarProducts.map((simProd) => (
              <ProductCard
                key={simProd.id}
                product={simProd}
                onSelectProduct={(p) => {
                  onSelectProduct(p);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            ))}
          </div>
        </section>
      )}

      <style>{`
        .detail-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-muted);
          margin-bottom: 1.75rem;
          padding: 0.4rem 0.8rem;
          border-radius: var(--radius-sm);
          background-color: var(--bg-card);
          border: 1px solid var(--border-subtle);
        }
        .detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          margin-bottom: 4rem;
        }
        .detail-main-image {
          width: 100%;
          aspect-ratio: 4 / 3;
          border-radius: var(--radius-md);
          overflow: hidden;
          background-color: #F7F3ED;
          border: 1px solid var(--border-subtle);
          box-shadow: var(--shadow-sm);
          margin-bottom: 1.25rem;
          position: relative;
        }
        .detail-image-counter {
          position: absolute;
          bottom: 12px;
          right: 12px;
          background: rgba(0,0,0,0.65);
          color: #FFF;
          backdrop-filter: blur(4px);
          padding: 0.3rem 0.75rem;
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          font-weight: 600;
        }
        .detail-thumb-label {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-muted);
          margin-bottom: 0.5rem;
        }
        .detail-thumb-row {
          display: flex;
          gap: 0.75rem;
          overflow-x: auto;
          padding-bottom: 0.75rem;
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
        }
        .detail-thumb {
          width: 85px;
          height: 65px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          border: 1px solid var(--border-light);
          opacity: 0.6;
          transition: all 0.2s ease;
          flex-shrink: 0;
          cursor: pointer;
        }
        .detail-thumb-active {
          border: 2.5px solid var(--accent-wood);
          opacity: 1;
        }
        .detail-info {
          display: flex;
          flex-direction: column;
        }
        .detail-tags {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.5rem;
        }
        .detail-new-badge {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--accent-wood);
          background-color: var(--accent-amber-light);
          padding: 0.2rem 0.6rem;
          border-radius: var(--radius-full);
        }
        .detail-title {
          font-family: var(--font-serif);
          font-size: clamp(1.75rem, 3vw, 2.5rem);
          font-weight: 700;
          color: var(--text-main);
          line-height: 1.2;
          margin-bottom: 1rem;
        }
        .detail-price-box {
          background: var(--accent-amber-light);
          padding: 1.25rem;
          border-radius: var(--radius-md);
          display: flex;
          align-items: baseline;
          gap: 1rem;
          margin-bottom: 1.5rem;
          border: 1px solid rgba(140, 90, 60, 0.15);
        }
        .detail-price-label {
          font-size: 0.8rem;
          color: var(--accent-wood);
          font-weight: 700;
          text-transform: uppercase;
        }
        .detail-price-value {
          font-size: 2.25rem;
          font-weight: 800;
          color: var(--text-main);
          line-height: 1;
        }
        .detail-price-old {
          font-size: 1.1rem;
          color: var(--text-light);
          text-decoration: line-through;
        }
        .detail-desc {
          font-size: 1.05rem;
          color: var(--text-muted);
          line-height: 1.6;
          margin-bottom: 2rem;
        }
        .detail-cta-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 2.5rem;
        }
        .detail-cta-btn {
          padding: 1rem;
        }
        .detail-specs-card {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 1.5rem;
          box-shadow: var(--shadow-sm);
        }
        .detail-specs-title {
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: 1rem;
          border-bottom: 1px solid var(--border-subtle);
          padding-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .detail-specs-list {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }
        .detail-spec-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.92rem;
          gap: 0.5rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px dashed var(--border-subtle);
        }
        .detail-spec-column {
          flex-direction: column;
        }
        .detail-spec-key {
          color: var(--text-muted);
          font-weight: 600;
        }
        .detail-spec-val {
          color: var(--text-main);
          font-weight: 700;
          text-align: right;
        }
        .detail-spec-column .detail-spec-val {
          text-align: left;
        }
        .detail-similar-section {
          margin-top: 4rem;
          padding-top: 3rem;
          border-top: 1px solid var(--border-light);
        }

        /* ========= MOBILE RESPONSIVE ========= */
        @media (max-width: 768px) {
          .detail-grid {
            grid-template-columns: 1fr;
            gap: 1.75rem;
          }
          .detail-title {
            font-size: 1.5rem;
          }
          .detail-price-value {
            font-size: 1.75rem;
          }
          .detail-price-box {
            padding: 1rem;
          }
          .detail-desc {
            font-size: 0.95rem;
            margin-bottom: 1.25rem;
          }
          .detail-cta-grid {
            grid-template-columns: 1fr;
            gap: 0.75rem;
            margin-bottom: 1.75rem;
          }
          .detail-cta-btn {
            padding: 0.85rem;
          }
          .detail-specs-card {
            padding: 1rem;
          }
          .detail-specs-title {
            font-size: 1rem;
          }
          .detail-spec-row {
            font-size: 0.85rem;
            flex-direction: column;
            gap: 0.2rem;
          }
          .detail-spec-val {
            text-align: left;
          }
          .detail-similar-section {
            margin-top: 2.5rem;
            padding-top: 2rem;
          }
          .detail-back-btn {
            font-size: 0.88rem;
            margin-bottom: 1rem;
          }
          .detail-thumb {
            width: 70px;
            height: 52px;
          }
        }
      `}</style>
    </div>
  );
}
