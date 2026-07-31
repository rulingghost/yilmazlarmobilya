import React from 'react';
import { Sparkles } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';

export function NewProductsPage({ products, onSelectProduct }) {
  const newProducts = products.filter(p => p.isNew);

  return (
    <div className="animate-fade-in container" style={{ paddingTop: '2rem' }}>
      <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <span className="section-tag">Yeni Sezon</span>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', fontWeight: 700, margin: '0.5rem 0' }}>
          Yeni Gelen Ürünler
        </h1>
        <p className="section-desc">İstikbal’in en son kataloğuna eklenen yeni koleksiyon modelleri.</p>
      </div>

      {newProducts.length > 0 ? (
        <div className="grid-3">
          {newProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onSelectProduct={onSelectProduct} 
            />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <p>Tüm ürünler ana katalog sayfasından incelenebilir.</p>
        </div>
      )}
    </div>
  );
}
