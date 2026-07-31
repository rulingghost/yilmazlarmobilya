import React from 'react';
import { ArrowRight, Camera, Percent } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';

export function ProductCard({ product, onSelectProduct }) {
  const mainImage = product.images && product.images.length > 0 ? product.images[0] : null;
  const imageCount = product.images ? product.images.length : 0;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      maximumFractionDigits: 0
    }).format(price);
  };

  const discountPercent = (product.originalPrice && product.originalPrice > product.price)
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="product-card">
      {/* Badges Container */}
      <div className="product-card-badges">
        <div>
          {discountPercent ? (
            <span className="badge-discount">
              <Percent size={11} /> %{discountPercent} İndirim
            </span>
          ) : product.isNew ? (
            <span className="product-badge-new">
              Yeni Sezon
            </span>
          ) : null}
        </div>

        {imageCount > 1 && (
          <span className="badge-camera">
            <Camera size={11} /> {imageCount}
          </span>
        )}
      </div>
      
      <div 
        className="product-card-img-holder"
        onClick={() => onSelectProduct(product)}
        style={{ cursor: 'pointer' }}
      >
        <ImageWithFallback
          src={mainImage}
          alt={product.name}
        />
      </div>

      <div className="product-card-body">
        <div className="product-card-category">
          {product.category}
        </div>

        <h3 
          className="product-card-title"
          onClick={() => onSelectProduct(product)}
          style={{ cursor: 'pointer' }}
        >
          {product.name}
        </h3>

        <div className="product-card-price-row">
          <div>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="product-card-old-price">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            <div className="product-card-price">
              {formatPrice(product.price)}
            </div>
          </div>

          <button 
            onClick={() => onSelectProduct(product)} 
            className="btn-inspect"
            title="Ürünü ve fotoğraflarını detaylı inceleyin"
          >
            <span>İncele</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      <style>{`
        .product-card-badges {
          position: absolute;
          top: 8px;
          left: 8px;
          right: 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          zIndex: 2;
          pointer-events: none;
        }
        .badge-discount {
          background: #E11D48;
          color: #FFF;
          font-size: 0.72rem;
          font-weight: 800;
          padding: 0.2rem 0.55rem;
          border-radius: var(--radius-full);
          box-shadow: 0 3px 8px rgba(225, 29, 72, 0.3);
          display: inline-flex;
          align-items: center;
          gap: 0.2rem;
        }
        .badge-camera {
          background: rgba(0,0,0,0.65);
          color: #FFF;
          backdrop-filter: blur(4px);
          font-size: 0.7rem;
          font-weight: 700;
          padding: 0.2rem 0.5rem;
          border-radius: var(--radius-full);
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
        }

        @media (max-width: 640px) {
          .product-card-badges {
            top: 6px;
            left: 6px;
            right: 6px;
          }
          .badge-discount {
            font-size: 0.62rem;
            padding: 0.15rem 0.4rem;
          }
          .badge-camera {
            font-size: 0.62rem;
            padding: 0.15rem 0.4rem;
          }
        }
      `}</style>
    </div>
  );
}
