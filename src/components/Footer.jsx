import React from 'react';
import { 
  Phone, 
  MapPin, 
  Clock, 
  Instagram, 
  Facebook, 
  RefreshCw, 
  ShieldCheck,
  Mail,
  Award,
  Code
} from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { siteConfig } from '../config/siteConfig';

export function Footer({ setActivePage, lastUpdateInfo }) {
  const formattedUpdateDate = lastUpdateInfo?.lastUpdate || '31.07.2026';

  return (
    <footer className="site-footer">
      <div className="container">
        
        {/* Brand Badges Bar */}
        <div className="footer-badges">
          {siteConfig.brandBadges.map((badge, idx) => (
            <div key={idx} className="footer-badge-item">
              <div className="footer-badge-icon">
                <Award size={20} />
              </div>
              <div>
                <div className="footer-badge-name">{badge.name}</div>
                <div className="footer-badge-sub">{badge.subtitle}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="footer-grid">
          {/* Brand Info */}
          <div>
            <div className="footer-brand">
              <div className="footer-logo-box">
                <img 
                  src={siteConfig.logoUrl} 
                  alt={siteConfig.name} 
                  className="footer-logo-img"
                />
              </div>
              <div className="footer-brand-tag">
                İstikbal Yetkili Bayi & Showroom
              </div>
            </div>

            <p className="footer-brand-desc">
              Türkiye'nin lider markası İstikbal'in en yeni koltuk, yemek, yatak odası ve tekstil koleksiyonlarını en uygun fiyat teklifleriyle sizlere sunuyoruz.
            </p>

            <div className="footer-update-badge">
              <RefreshCw size={14} style={{ color: 'var(--accent-amber)' }} />
              <span>Katalog Güncellemesi: <strong>{formattedUpdateDate}</strong></span>
            </div>
          </div>

          {/* Quick Page Links */}
          <div>
            <h4 className="footer-section-title">Hızlı Bağlantılar</h4>
            <ul className="footer-links">
              <li><button onClick={() => { setActivePage('home'); window.scrollTo(0,0); }}>Ana Sayfa</button></li>
              <li><button onClick={() => { setActivePage('products'); window.scrollTo(0,0); }}>Tüm Ürün Kataloğu</button></li>
              <li><button onClick={() => { setActivePage('categories'); window.scrollTo(0,0); }}>Kategoriler</button></li>
              <li><button onClick={() => { setActivePage('new'); window.scrollTo(0,0); }}>Yeni Koleksiyonlar</button></li>
              <li><button onClick={() => { setActivePage('about'); window.scrollTo(0,0); }}>Hakkımızda</button></li>
              <li><button onClick={() => { setActivePage('contact'); window.scrollTo(0,0); }}>İletişim & Harita</button></li>
            </ul>
          </div>

          {/* Communication & Address */}
          <div>
            <h4 className="footer-section-title">İletişim & Şubeler</h4>
            <div className="footer-contact-list">
              <div className="footer-contact-item">
                <MapPin size={18} style={{ color: 'var(--accent-amber)', flexShrink: 0, marginTop: '2px' }} />
                <span>{siteConfig.address}</span>
              </div>
              <div className="footer-contact-item">
                <Phone size={18} style={{ color: 'var(--accent-amber)', flexShrink: 0 }} />
                <a href={`tel:${siteConfig.phoneRaw}`} className="footer-contact-link-white">{siteConfig.phoneDisplay}</a>
              </div>
              {siteConfig.secondaryPhones.map((sp, idx) => (
                <div key={idx} className="footer-contact-sub">
                  <span>{sp.label}:</span>
                  <a href={`tel:${sp.raw}`} style={{ color: '#DDD' }}>{sp.display}</a>
                </div>
              ))}
              <div className="footer-contact-item">
                <WhatsAppIcon size={18} style={{ color: 'var(--whatsapp-color)', flexShrink: 0 }} />
                <a href={siteConfig.getGeneralWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="footer-contact-link-white">WhatsApp İletişim Hatları</a>
              </div>
              <div className="footer-contact-item">
                <Mail size={18} style={{ color: 'var(--accent-amber)', flexShrink: 0 }} />
                <a href={`mailto:${siteConfig.email}`} className="footer-contact-link-white">{siteConfig.email}</a>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="footer-section-title">Sosyal Medya</h4>
            <p className="footer-social-desc">
              Bizi sosyal medyadan takip edebilir, güncel serilerimizi inceleyebilirsiniz.
            </p>
            <div className="footer-social-icons">
              <a href={siteConfig.instagram} target="_blank" rel="noopener noreferrer" className="footer-social-btn" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href={siteConfig.facebook} target="_blank" rel="noopener noreferrer" className="footer-social-btn" aria-label="Facebook">
                <Facebook size={20} />
              </a>
            </div>

            <div className="footer-disclaimer">
              <ShieldCheck size={26} style={{ color: 'var(--accent-amber)', flexShrink: 0 }} />
              <div>
                <strong>Tanıtım ve Bilgi Kataloğudur.</strong> Online sipariş ve WhatsApp destek hattımız üzerinden bilgi alabilirsiniz.
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-bottom">
          <div>© {new Date().getFullYear()} <strong>{siteConfig.name}</strong>. Tüm hakları saklıdır.</div>
          <div className="footer-dev-credit">
            <Code size={15} style={{ color: 'var(--accent-amber)' }} />
            <span>Site Tasarım & Geliştirme: <strong>{siteConfig.developerCredit}</strong></span>
          </div>
        </div>
      </div>

      <style>{`
        .site-footer {
          background-color: var(--bg-dark);
          color: #E5DED5;
          padding-top: 4rem;
          padding-bottom: 2rem;
          margin-top: 4rem;
          border-top: 2px solid var(--accent-wood);
        }

        /* Badges */
        .footer-badges {
          display: flex;
          justify-content: space-around;
          align-items: center;
          flex-wrap: wrap;
          gap: 1.5rem;
          padding-bottom: 2.5rem;
          margin-bottom: 3rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .footer-badge-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          opacity: 0.9;
        }
        .footer-badge-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(212, 175, 55, 0.15);
          border: 1px solid var(--accent-gold);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent-gold);
        }
        .footer-badge-name {
          color: #FFF;
          font-weight: 700;
          font-size: 0.95rem;
        }
        .footer-badge-sub {
          color: #A89E94;
          font-size: 0.78rem;
        }

        /* Grid */
        .footer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 2.5rem;
          padding-bottom: 3rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        /* Brand */
        .footer-brand {
          margin-bottom: 1.25rem;
        }
        .footer-logo-box {
          background: #FFF;
          padding: 0.6rem 1rem;
          border-radius: 8px;
          display: inline-block;
          margin-bottom: 0.6rem;
        }
        .footer-logo-img {
          height: 36px;
          width: auto;
          display: block;
        }
        .footer-brand-tag {
          font-size: 0.8rem;
          color: var(--accent-amber);
          font-weight: 600;
        }
        .footer-brand-desc {
          color: #A89E94;
          font-size: 0.9rem;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }
        .footer-update-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          padding: 0.45rem 0.85rem;
          border-radius: var(--radius-full);
          font-size: 0.78rem;
          color: #D4C5B9;
        }

        /* Section Titles */
        .footer-section-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #FFF;
          margin-bottom: 1.25rem;
        }

        /* Links */
        .footer-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          font-size: 0.92rem;
        }
        .footer-links button {
          color: #A89E94;
          transition: color 0.2s;
          text-align: left;
        }
        .footer-links button:hover {
          color: #FFF;
        }

        /* Contact List */
        .footer-contact-list {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          font-size: 0.88rem;
          color: #A89E94;
        }
        .footer-contact-item {
          display: flex;
          gap: 0.6rem;
          align-items: center;
        }
        .footer-contact-link-white {
          color: #FFF;
          font-weight: 700;
        }
        .footer-contact-sub {
          display: flex;
          gap: 0.6rem;
          align-items: center;
          font-size: 0.82rem;
          padding-left: 1.5rem;
        }

        /* Social */
        .footer-social-desc {
          color: #A89E94;
          font-size: 0.88rem;
          margin-bottom: 1.25rem;
        }
        .footer-social-icons {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }
        .footer-social-btn {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFF;
          transition: all 0.2s;
          border: 1px solid rgba(255,255,255,0.15);
        }
        .footer-social-btn:hover {
          background: rgba(255,255,255,0.15);
        }
        .footer-disclaimer {
          background: rgba(140, 90, 60, 0.15);
          border: 1px solid rgba(140, 90, 60, 0.3);
          border-radius: var(--radius-sm);
          padding: 0.85rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.78rem;
          color: #D8CCC0;
        }

        /* Bottom Bar */
        .footer-bottom {
          padding-top: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
          font-size: 0.85rem;
          color: #8A8075;
        }
        .footer-dev-credit {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #A89E94;
          font-size: 0.82rem;
        }

        /* ========= MOBILE RESPONSIVE ========= */
        @media (max-width: 768px) {
          .site-footer {
            padding-top: 2.5rem;
            margin-top: 2.5rem;
          }
          .footer-badges {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
            padding-bottom: 1.5rem;
            margin-bottom: 2rem;
          }
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
            padding-bottom: 2rem;
          }
          .footer-bottom {
            flex-direction: column;
            text-align: center;
            gap: 0.5rem;
          }
          .footer-dev-credit {
            justify-content: center;
          }
        }
        @media (max-width: 480px) {
          .footer-section-title {
            font-size: 1rem;
          }
          .footer-badge-name {
            font-size: 0.85rem;
          }
          .footer-badge-icon {
            width: 35px;
            height: 35px;
          }
          .footer-disclaimer {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
}
