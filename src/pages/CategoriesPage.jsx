import React from 'react';
import { ArrowRight, Layers } from 'lucide-react';

export function CategoriesPage({ products, setSelectedCategory, setActivePage }) {
  const categoryMap = {};
  products.forEach(p => {
    if (!categoryMap[p.category]) {
      categoryMap[p.category] = {
        name: p.category,
        count: 0,
        sampleImage: p.images[0],
        items: []
      };
    }
    categoryMap[p.category].count += 1;
    categoryMap[p.category].items.push(p);
  });

  const categories = Object.values(categoryMap);

  return (
    <div className="animate-fade-in container" style={{ paddingTop: '2rem' }}>
      <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <span className="section-tag">Kategori Rehberi</span>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', fontWeight: 700, margin: '0.5rem 0' }}>
          Tüm Mobilya Kategorileri
        </h1>
        <p className="section-desc">Evinizin tüm odaları için özel tasarlanmış İstikbal koleksiyon grupları.</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '2rem'
      }}>
        {categories.map((cat) => (
          <div
            key={cat.name}
            onClick={() => {
              setSelectedCategory(cat.name);
              setActivePage('products');
              window.scrollTo(0, 0);
            }}
            style={{
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-sm)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            className="product-card"
          >
            <div style={{ width: '100%', height: '220px', overflow: 'hidden', position: 'relative' }}>
              <img
                src={cat.sampleImage}
                alt={cat.name}
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'rgba(0,0,0,0.65)',
                backdropFilter: 'blur(4px)',
                color: '#FFF',
                padding: '0.3rem 0.8rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8rem',
                fontWeight: 700
              }}>
                {cat.count} Ürün
              </div>
            </div>

            <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {cat.name}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  {cat.items.map(i => i.name).slice(0, 2).join(', ')}...
                </p>
              </div>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'var(--accent-amber-light)',
                color: 'var(--accent-wood)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <ArrowRight size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
