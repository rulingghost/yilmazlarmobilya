import React, { useState } from 'react';
import { 
  Phone, 
  Search, 
  Menu, 
  X, 
  ChevronRight,
  MapPin,
  Clock,
  Tag,
  Award
} from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { siteConfig } from '../config/siteConfig';

export function Navbar({ activePage, setActivePage, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Ana Sayfa' },
    { id: 'products', label: 'Tüm Ürünler' },
    { id: 'categories', label: 'Kategoriler' },
    { id: 'new', label: 'Yeni Koleksiyon' },
    { id: 'about', label: 'Hakkımızda' },
    { id: 'contact', label: 'İletişim & Konum' }
  ];

  const handleNavClick = (pageId) => {
    setActivePage(pageId);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (activePage !== 'products') {
      setActivePage('products');
    }
  };

  return (
    <header className="glass-header">
      {/* Top Special Campaign & Info Ribbon */}
      <div className="top-ribbon">
        <div className="container top-ribbon-inner">
          <div className="ribbon-left">
            <Tag size={13} className="ribbon-icon-gold" />
            <span>{siteConfig.campaignBanner}</span>
          </div>

          <div className="ribbon-right desktop-only">
            <span className="ribbon-badge">
              <Award size={12} /> İstikbal Yetkili Bayi
            </span>
            <span className="ribbon-separator">|</span>
            <span className="ribbon-info">
              <MapPin size={12} className="ribbon-icon-amber" />
              {siteConfig.address}
            </span>
            <span className="ribbon-separator">|</span>
            <span className="ribbon-info">
              <Clock size={12} className="ribbon-icon-amber" />
              {siteConfig.workingHours.weekdays}
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container navbar-main">
        
        {/* Brand Official Image Logo */}
        <a 
          href="#home" 
          onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}
          className="navbar-brand"
        >
          <img 
            src={siteConfig.logoUrl} 
            alt={siteConfig.name}
            className="navbar-logo"
          />
        </a>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`nav-link ${activePage === item.id ? 'nav-link-active' : ''}`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Desktop Search & Quick Contact CTA */}
        <div className="navbar-actions desktop-only">
          <form onSubmit={handleSearchSubmit} className="navbar-search">
            <input
              type="text"
              placeholder="Model / ürün ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => { if (activePage !== 'products') setActivePage('products'); }}
              className="navbar-search-input"
            />
            <Search size={14} className="navbar-search-icon" />
          </form>

          <a 
            href={`tel:${siteConfig.phoneRaw}`}
            className="btn-phone navbar-btn"
          >
            <Phone size={14} />
            <span>{siteConfig.phoneDisplay}</span>
          </a>

          <a 
            href={siteConfig.getGeneralWhatsAppLink()}
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-whatsapp navbar-btn"
          >
            <WhatsAppIcon size={15} />
            <span>WhatsApp</span>
          </a>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button 
          className="mobile-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Menü"
        >
          {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-drawer animate-fade-in">
          <form onSubmit={handleSearchSubmit} className="mobile-search-form">
            <input
              type="text"
              placeholder="Ürün adı veya model ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => { if (activePage !== 'products') setActivePage('products'); }}
              className="mobile-search-input"
            />
            <Search size={18} className="mobile-search-icon" />
          </form>

          <div className="mobile-nav-list">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`mobile-nav-item ${activePage === item.id ? 'mobile-nav-item-active' : ''}`}
              >
                <span>{item.label}</span>
                <ChevronRight size={18} className="mobile-nav-arrow" />
              </button>
            ))}
          </div>

          <div className="mobile-cta-row">
            <a href={`tel:${siteConfig.phoneRaw}`} className="btn-phone mobile-cta-btn">
              <Phone size={16} /> Telefon Et
            </a>
            <a 
              href={siteConfig.getGeneralWhatsAppLink()} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-whatsapp mobile-cta-btn"
            >
              <WhatsAppIcon size={18} /> WhatsApp
            </a>
          </div>

          {/* Mobile-only info strip */}
          <div className="mobile-info-strip">
            <div className="mobile-info-item">
              <MapPin size={14} className="ribbon-icon-amber" />
              <span>{siteConfig.address}</span>
            </div>
            <div className="mobile-info-item">
              <Clock size={14} className="ribbon-icon-amber" />
              <span>{siteConfig.workingHours.weekdays}</span>
            </div>
          </div>
        </div>
      )}

      <style>{`
        /* Top Ribbon */
        .top-ribbon {
          background: linear-gradient(90deg, #1A1815 0%, #8C5A3C 50%, #1A1815 100%);
          color: #FFF;
          font-size: 0.78rem;
          padding: 0.35rem 0;
          font-weight: 600;
          letter-spacing: 0.3px;
          border-bottom: 1px solid rgba(212, 175, 55, 0.2);
        }
        .top-ribbon-inner {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .ribbon-left {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          min-width: 0;
        }
        .ribbon-right {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          opacity: 0.95;
          font-size: 0.76rem;
          white-space: nowrap;
        }
        .ribbon-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: rgba(212, 175, 55, 0.15);
          padding: 0.15rem 0.6rem;
          border-radius: 4px;
          border: 1px solid rgba(212, 175, 55, 0.3);
          color: #FCE0C8;
        }
        .ribbon-separator { opacity: 0.4; }
        .ribbon-info {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }
        .ribbon-icon-gold { color: var(--accent-gold); }
        .ribbon-icon-amber { color: var(--accent-amber); }

        /* Navbar Main Row */
        .navbar-main {
          padding: 0.65rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }
        .navbar-brand {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }
        .navbar-logo {
          height: 38px;
          width: auto;
          max-height: 44px;
          object-fit: contain;
          display: block;
        }

        /* Desktop Navigation */
        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        .nav-link {
          padding: 0.45rem 0.75rem;
          font-size: 0.88rem;
          font-weight: 500;
          color: var(--text-main);
          background: transparent;
          border-radius: var(--radius-sm);
          transition: all 0.2s ease;
          border: 1px solid transparent;
          white-space: nowrap;
        }
        .nav-link-active {
          font-weight: 700;
          color: var(--accent-wood);
          background: var(--accent-amber-light);
          border-color: rgba(140, 90, 60, 0.2);
        }

        /* Navbar Actions */
        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          flex-shrink: 0;
        }
        .navbar-btn {
          padding: 0.45rem 0.85rem;
          font-size: 0.82rem;
          border-radius: var(--radius-full);
          white-space: nowrap;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
        }
        .navbar-search {
          position: relative;
        }
        .navbar-search-input {
          padding: 0.45rem 0.85rem 0.45rem 2rem;
          font-size: 0.82rem;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-light);
          background-color: #FFF;
          width: 150px;
          outline: none;
          transition: all 0.2s ease;
          box-shadow: inset 0 1px 3px rgba(0,0,0,0.02);
        }
        .navbar-search-icon {
          position: absolute;
          left: 0.65rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-light);
        }

        /* Mobile Toggle */
        .mobile-toggle {
          display: none;
          padding: 0.5rem;
          color: var(--text-main);
        }

        /* Mobile Drawer */
        .mobile-drawer {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: #FAF7F2;
          border-bottom: 1px solid var(--border-light);
          padding: 1.25rem;
          box-shadow: 0 12px 30px rgba(0,0,0,0.12);
          z-index: 101;
          max-height: calc(100vh - 100px);
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }
        .mobile-search-form {
          margin-bottom: 1rem;
          position: relative;
        }
        .mobile-search-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-light);
          background-color: #FFF;
          font-size: 0.95rem;
        }
        .mobile-search-icon {
          position: absolute;
          left: 0.85rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-light);
        }
        .mobile-nav-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .mobile-nav-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.85rem 1rem;
          font-size: 1rem;
          font-weight: 500;
          color: var(--text-main);
          background-color: #FFF;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-subtle);
        }
        .mobile-nav-item-active {
          font-weight: 700;
          color: var(--accent-wood);
          background-color: var(--accent-amber-light);
        }
        .mobile-nav-arrow {
          color: var(--text-light);
        }
        .mobile-cta-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
          margin-top: 1.25rem;
        }
        .mobile-cta-btn {
          font-size: 0.88rem;
          padding: 0.65rem;
        }
        .mobile-info-strip {
          display: none;
          flex-direction: column;
          gap: 0.5rem;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border-subtle);
          font-size: 0.82rem;
          color: var(--text-muted);
        }
        .mobile-info-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        /* Desktop-only helper */
        .desktop-only {
          display: flex;
        }

        /* ========= RESPONSIVE ========= */
        @media (max-width: 1100px) {
          .desktop-nav, .desktop-only { display: none !important; }
          .mobile-toggle { display: block !important; }
          .mobile-info-strip { display: flex !important; }
        }
        @media (min-width: 1101px) {
          .mobile-toggle { display: none !important; }
        }
        @media (max-width: 640px) {
          .navbar-main {
            padding: 0.5rem 0.85rem;
          }
          .navbar-logo {
            height: 32px;
            max-height: 36px;
          }
          .top-ribbon {
            font-size: 0.7rem;
            padding: 0.25rem 0;
          }
          .ribbon-left {
            font-size: 0.7rem;
          }
          .mobile-drawer {
            padding: 1rem 0.85rem;
          }
        }
      `}</style>
    </header>
  );
}
