import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';

/**
 * Image component with automatic fallback to "Görsel bulunamadı" vector placeholder
 * if the image fails to load or URL is broken.
 */
export function ImageWithFallback({ src, alt, className = '', ...props }) {
  const [hasError, setHasError] = useState(!src);

  if (hasError || !src) {
    return (
      <div className={`fallback-image-wrapper ${className}`} title="Görsel bulunamadı">
        <ImageOff className="fallback-image-icon" />
        <span className="fallback-image-text">Görsel Bulunamadı</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || 'Ürün görseli'}
      loading="lazy"
      onError={() => setHasError(true)}
      className={className}
      {...props}
    />
  );
}
