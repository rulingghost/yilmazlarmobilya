import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, X, ArrowUpDown, ChevronDown, Check } from 'lucide-react';
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
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const categories = useMemo(() => {
    return ['Tümü', ...Array.from(new Set(products.map(p => p.category)))];
  }, [products]);

  // Calculate category counts
  const categoryCounts = useMemo(() => {
    const map = { 'Tümü': products.length };
    products.forEach(p => {
      map[p.category] = (map[p.category] || 0) + 1;
    });
    return map;
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

  const activeCategoryLabel = selectedCategory && selectedCategory !== 'Tümü' ? selectedCategory : 'Tüm Kategoriler';

  return (
    <div className="animate-fade-in container" style={{ paddingTop: '1.25rem' }}>
      {/* Header */}
      <div className="catalog-header">
        <h1 className="catalog-title">Tüm Ürün Kataloğu</h1>
        <p className="catalog-desc">
          İstikbal'in tüm kategorilerdeki güncel fiyatlı ve garantili mobilya modellerini inceleyin.
        </p>
      </div>

      {/* Desktop Search & Filter Controls */}
      <div className="catalog-controls desktop-controls-box">
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
                {cat} ({categoryCounts[cat] || 0})
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile-Dedicated Compact Filter Bar */}
      <div className="mobile-filter-bar">
        {/* Search input */}
        <div className="catalog-search-box" style={{ width: '100%', marginBottom: '0.5rem' }}>
          <input
            type="text"
            placeholder="Ürün adı veya model ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="catalog-search-input"
          />
          <Search size={15} className="catalog-search-icon" />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="catalog-search-clear">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter Trigger Button & Sort Dropdown */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="mobile-filter-btn"
          >
            <Filter size={14} />
            <span className="mobile-filter-btn-text">{activeCategoryLabel}</span>
          </button>

          <div style={{ position: 'relative' }}>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="mobile-sort-select"
            >
              <option value="default">Sırala: Önerilen</option>
              <option value="price-low">Fiyat: Düşükten Yükseğe</option>
              <option value="price-high">Fiyat: Yüksekten Düşüğe</option>
              <option value="newest">En Yeniler</option>
            </select>
          </div>
        </div>
      </div>

      {/* Count & Clear */}
      <div className="catalog-result-bar">
        <div className="catalog-result-count">
          Toplam <strong>{filteredProducts.length}</strong> ürün listeleniyor
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

      {/* Mobile Category Filter Bottom Drawer Modal */}
      {isMobileFilterOpen && (
        <div className="mobile-modal-backdrop" onClick={() => setIsMobileFilterOpen(false)}>
          <div className="mobile-modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.05rem' }}>
                <Filter size={18} style={{ color: 'var(--accent-wood)' }} />
                <span>Kategori Seçin</span>
              </div>
              <button onClick={() => setIsMobileFilterOpen(false)} style={{ padding: '0.4rem', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <div className="mobile-modal-list">
              {categories.map((cat) => {
                const isSelected = (!selectedCategory && cat === 'Tümü') || selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat === 'Tümü' ? null : cat);
                      setIsMobileFilterOpen(false);
                    }}
                    className={`mobile-category-row ${isSelected ? 'mobile-category-row-active' : ''}`}
                  >
                    <span>{cat}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="mobile-category-count">{categoryCounts[cat] || 0} ürün</span>
                      {isSelected && <Check size={16} style={{ color: 'var(--accent-wood)' }} />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-light)' }}>
              <button 
                onClick={() => setIsMobileFilterOpen(false)}
                className="btn-primary"
                style={{ width: '100%', borderRadius: 'var(--radius-full)' }}
              >
                Sonuçları Göster ({filteredProducts.length} Ürün)
              </button>
            </div>
          </div>
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

        /* Mobile Filter Bar & Drawer */
        .mobile-filter-bar {
          display: none;
        }
        .mobile-filter-btn {
          background: var(--bg-card);
          border: 1px solid var(--border-light);
          padding: 0.5rem 0.75rem;
          border-radius: var(--radius-sm);
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--text-main);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          width: 100%;
        }
        .mobile-filter-btn-text {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .mobile-sort-select {
          background: var(--bg-card);
          border: 1px solid var(--border-light);
          padding: 0.5rem 0.75rem;
          border-radius: var(--radius-sm);
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--text-main);
          width: 100%;
          outline: none;
        }
        .mobile-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(3px);
          z-index: 200;
          display: flex;
          align-items: flex-end;
          animation: fadeIn 0.2s ease forwards;
        }
        .mobile-modal-sheet {
          background: var(--bg-main);
          width: 100%;
          max-height: 80vh;
          border-top-left-radius: var(--radius-lg);
          border-top-right-radius: var(--radius-lg);
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          box-shadow: 0 -8px 30px rgba(0,0,0,0.2);
        }
        .mobile-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 0.85rem;
          border-bottom: 1px solid var(--border-light);
          margin-bottom: 0.75rem;
        }
        .mobile-modal-list {
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          max-height: 50vh;
        }
        .mobile-category-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 0.85rem;
          border-radius: var(--radius-sm);
          background: #FFF;
          border: 1px solid var(--border-subtle);
          font-size: 0.92rem;
          font-weight: 600;
          color: var(--text-main);
          text-align: left;
        }
        .mobile-category-row-active {
          border-color: var(--accent-wood);
          background: var(--accent-amber-light);
          color: var(--accent-wood);
          font-weight: 700;
        }
        .mobile-category-count {
          font-size: 0.78rem;
          color: var(--text-muted);
        }

        /* ========= RESPONSIVE SWITCH ========= */
        @media (max-width: 768px) {
          .desktop-controls-box {
            display: none !important;
          }
          .mobile-filter-bar {
            display: block !important;
            margin-bottom: 1rem;
          }
          .catalog-title {
            font-size: 1.35rem;
            margin-bottom: 0.2rem;
          }
          .catalog-desc {
            font-size: 0.82rem;
          }
          .catalog-header {
            margin-bottom: 0.75rem;
          }
          .catalog-result-bar {
            margin-bottom: 0.85rem;
          }
        }
      `}</style>
    </div>
  );
}
