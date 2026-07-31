import React from 'react';
import { ArrowRight, Camera, Tag, Percent } from 'lucide-react';
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
      <div style={{ position: 'absolute', top: '12px', left: '12px', right: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2, pointerEvents: 'none' }}>
        <div>
          {discountPercent ? (
            <span style={{
              background: '#E11D48',
              color: '#FFF',
              fontSize: '0.75rem',
              fontWeight: 800,
              padding: '0.25rem 0.65rem',
              borderRadius: 'var(--radius-full)',
              boxShadow: '0 4px 10px rgba(225, 29, 72, 0.3)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.2rem'
            }}>
              <Percent size={12} /> {discountPercent} İndirim
            </span>
          ) : product.isNew ? (
            <span className="product-badge-new">
              Yeni Sezon
            </span>
          ) : null}
        </div>

        {imageCount > 1 && (
          <span style={{
            background: 'rgba(0,0,0,0.65)',
            color: '#FFF',
            backdropFilter: 'blur(4px)',
            fontSize: '0.72rem',
            fontWeight: 700,
            padding: '0.25rem 0.6rem',
            borderRadius: 'var(--radius-full)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem'
          }}>
            <Camera size={12} /> {imageCount}
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
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
