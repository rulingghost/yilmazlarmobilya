import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, X, ArrowUpDown, ChevronDown } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';

export function ProductsPage({ 
  products, 
  onSelectProduct, 
  searchQuery, 
  setSearchQuery, 
  selectedCategory, 
  setSelectedCategory 
}) {
  const [sortOrder, setSortOrder] = useState('default');
  const [visibleCount, setVisibleCount] = useState(24);

  const categories = useMemo(() => {
    return ['Tümü', ...Array.from(new Set(products.map(p => p.category)))];
  }, [products]);

  useEffect(() => {
    setVisibleCount(24);
  }, [selectedCategory, searchQuery, sortOrder]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = !selectedCategory || selectedCategory === 'Tümü' || product.category === selectedCategory;
      const matchesSearch = !searchQuery || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.shortDescription && product.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (sortOrder === 'price-low') return a.price - b.price;
      if (sortOrder === 'price-high') return b.price - a.price;
      if (sortOrder === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      return 0;
    });
  }, [products, selectedCategory, searchQuery, sortOrder]);

  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

  return (
    <div className="animate-fade-in container" style={{ paddingTop: '1.25rem' }}>
      {/* Header */}
      <div className="catalog-header">
        <h1 className="catalog-title">Tüm Ürün Kataloğu</h1>
        <p className="catalog-desc">
          İstikbal'in tüm kategorilerdeki güncel fiyatlı ve garantili mobilya modellerini inceleyin.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="catalog-controls">
        <div className="catalog-controls-top">
          {/* Search Box */}
          <div className="catalog-search-box">
            <input
              type="text"
              placeholder="Ürün adı veya model ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="catalog-search-input"
            />
            <Search size={16} className="catalog-search-icon" />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="catalog-search-clear">
                <X size={15} />
              </button>
            )}
          </div>

          {/* Sort */}
          <div className="catalog-sort">
            <ArrowUpDown size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="catalog-sort-select"
            >
              <option value="default">Önerilen Sıralama</option>
              <option value="price-low">Fiyat: Düşükten Yükseğe</option>
              <option value="price-high">Fiyat: Yüksekten Düşüğe</option>
              <option value="newest">En Yeniler</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="catalog-pills">
          <span className="catalog-pills-label">
            <Filter size={13} /> Kategoriler:
          </span>
          {categories.map((cat) => {
            const isSelected = (!selectedCategory && cat === 'Tümü') || selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat === 'Tümü' ? null : cat)}
                className={`catalog-pill ${isSelected ? 'catalog-pill-active' : ''}`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Count & Clear */}
      <div className="catalog-result-bar">
        <div className="catalog-result-count">
          Toplam <strong>{filteredProducts.length}</strong> güncel İstikbal ürünü listeleniyor
        </div>
        {(selectedCategory || searchQuery) && (
          <button onClick={() => { setSelectedCategory(null); setSearchQuery(''); }} className="catalog-clear-btn">
            <X size={14} /> Temizle
          </button>
        )}
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <>
          <div className="grid-3">
            {displayedProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onSelectProduct={onSelectProduct} 
              />
            ))}
          </div>

          {visibleCount < filteredProducts.length && (
            <div style={{ textAlign: 'center', marginTop: '2.5rem', marginBottom: '2rem' }}>
              <button
                onClick={() => setVisibleCount(prev => prev + 24)}
                className="btn-outline catalog-load-more"
              >
                <span>Daha Fazla Göster ({filteredProducts.length - visibleCount} kaldı)</span>
                <ChevronDown size={16} />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="catalog-empty">
          <h3 className="catalog-empty-title">Aradığınız kriterlere uygun ürün bulunamadı.</h3>
          <p className="catalog-empty-desc">Arama terimini değiştirmeyi veya filtreleri kaldırmayı deneyebilirsiniz.</p>
          <button 
            onClick={() => { setSelectedCategory(null); setSearchQuery(''); }} 
            className="btn-primary"
          >
            Tüm Ürünleri Göster
          </button>
        </div>
      )}

      <style>{`
        .catalog-header {
          margin-bottom: 1.5rem;
        }
        .catalog-title {
          font-family: var(--font-serif);
          font-size: 2.1rem;
          font-weight: 700;
          margin-bottom: 0.35rem;
        }
        .catalog-desc {
          color: var(--text-muted);
          font-size: 0.95rem;
        }
        .catalog-controls {
          background: var(--bg-card);
          padding: 1rem 1.15rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-subtle);
          box-shadow: var(--shadow-sm);
          margin-bottom: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }
        .catalog-controls-top {
          display: flex;
          gap: 0.85rem;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
        }
        .catalog-search-box {
          position: relative;
          flex: 1;
          min-width: 220px;
        }
        .catalog-search-input {
          width: 100%;
          padding: 0.6rem 1rem 0.6rem 2.25rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-light);
          background-color: var(--bg-main);
          font-size: 0.9rem;
          outline: none;
        }
        .catalog-search-icon {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-light);
        }
        .catalog-search-clear {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-light);
        }
        .catalog-sort {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .catalog-sort-select {
          padding: 0.6rem 0.85rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-light);
          background-color: var(--bg-main);
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-main);
          cursor: pointer;
        }
        .catalog-pills {
          display: flex;
          gap: 0.4rem;
          flex-wrap: wrap;
          align-items: center;
        }
        .catalog-pills-label {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-muted);
          margin-right: 0.35rem;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
        }
        .catalog-pill {
          padding: 0.35rem 0.85rem;
          font-size: 0.82rem;
          font-weight: 500;
          border-radius: var(--radius-full);
          background-color: var(--bg-main);
          color: var(--text-main);
          border: 1px solid var(--border-light);
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .catalog-pill-active {
          font-weight: 700;
          background-color: var(--accent-wood);
          color: #FFF;
          border-color: var(--accent-wood);
        }
        .catalog-result-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .catalog-result-count {
          font-size: 0.88rem;
          color: var(--text-muted);
        }
        .catalog-clear-btn {
          font-size: 0.82rem;
          color: var(--accent-wood);
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 0.2rem;
        }
        .catalog-load-more {
          border-radius: var(--radius-full);
          padding: 0.75rem 1.75rem;
          font-size: 0.9rem;
        }
        .catalog-empty {
          text-align: center;
          padding: 3rem 1.5rem;
          background: var(--bg-card);
          border-radius: var(--radius-md);
          border: 1px dashed var(--border-light);
        }
        .catalog-empty-title {
          font-size: 1.15rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .catalog-empty-desc {
          color: var(--text-muted);
          margin-bottom: 1.25rem;
          font-size: 0.9rem;
        }

        /* ========= MOBILE RESPONSIVE COMPACT CONTROLS ========= */
        @media (max-width: 640px) {
          .catalog-header {
            margin-bottom: 0.85rem;
          }
          .catalog-title {
            font-size: 1.35rem;
            margin-bottom: 0.2rem;
          }
          .catalog-desc {
            font-size: 0.82rem;
          }
          .catalog-controls {
            padding: 0.75rem;
            gap: 0.6rem;
            margin-bottom: 0.85rem;
          }
          .catalog-controls-top {
            flex-direction: column;
            gap: 0.5rem;
          }
          .catalog-search-box {
            min-width: 100%;
          }
          .catalog-search-input {
            padding: 0.5rem 0.75rem 0.5rem 2.1rem;
            font-size: 0.85rem;
          }
          .catalog-sort {
            width: 100%;
          }
          .catalog-sort-select {
            width: 100%;
            padding: 0.45rem 0.75rem;
            font-size: 0.82rem;
          }
          .catalog-pills {
            overflow-x: auto;
            flex-wrap: nowrap;
            -webkit-overflow-scrolling: touch;
            padding-bottom: 0.35rem;
            gap: 0.35rem;
          }
          .catalog-pill {
            flex-shrink: 0;
            font-size: 0.76rem;
            padding: 0.28rem 0.7rem;
          }
          .catalog-pills-label {
            flex-shrink: 0;
            font-size: 0.75rem;
          }
          .catalog-result-bar {
            margin-bottom: 0.85rem;
          }
          .catalog-result-count {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
}
