import React from 'react';
import { 
  Phone, 
  MapPin, 
  Clock, 
  ExternalLink 
} from 'lucide-react';
import { WhatsAppIcon } from '../components/WhatsAppIcon';
import { siteConfig } from '../config/siteConfig';

export function ContactPage() {
  return (
    <div className="animate-fade-in container" style={{ paddingTop: '2rem' }}>
      <div className="contact-header">
        <span className="section-tag">İletişim & Konum</span>
        <h1 className="contact-title">Bizimle İletişime Geçin</h1>
        <p className="section-desc">
          Sorularınız, ürün bilgi talepleri ve fiyat öğrenmek için haftanın 7 günü hizmetinizdeyiz.
        </p>
      </div>

      <div className="contact-grid">
        {/* Left Column: Info Cards */}
        <div className="contact-cards">
          {/* Phone Card */}
          <div className="contact-card">
            <div className="contact-card-icon contact-icon-phone">
              <Phone size={26} />
            </div>
            <div className="contact-card-body">
              <div className="contact-card-label">Müşteri Hizmetleri & Telefon</div>
              <a href={`tel:${siteConfig.phoneRaw}`} className="contact-card-value">
                {siteConfig.phoneDisplay}
              </a>
            </div>
          </div>

          {/* WhatsApp Card */}
          <div className="contact-card">
            <div className="contact-card-icon contact-icon-wa">
              <WhatsAppIcon size={28} />
            </div>
            <div className="contact-card-body">
              <div className="contact-card-label">WhatsApp İletişim Hattı</div>
              <a href={siteConfig.getGeneralWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="contact-card-value-wa">
                <span>{siteConfig.whatsappDisplay}</span>
              </a>
            </div>
          </div>

          {/* Address Card */}
          <div className="contact-card">
            <div className="contact-card-icon contact-icon-address">
              <MapPin size={26} />
            </div>
            <div className="contact-card-body">
              <div className="contact-card-label">Mağaza Adresi</div>
              <p className="contact-card-address">{siteConfig.address}</p>
              <a 
                href={siteConfig.googleMapsDirectUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="contact-maps-link"
              >
                <span>Google Haritalar'da Aç</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>

          {/* Working Hours Card */}
          <div className="contact-card">
            <div className="contact-card-icon contact-icon-address">
              <Clock size={26} />
            </div>
            <div className="contact-card-body">
              <div className="contact-card-label">Çalışma Saatleri</div>
              <div className="contact-card-hours-main">{siteConfig.workingHours.weekdays}</div>
              <div className="contact-card-hours-sub">{siteConfig.workingHours.sunday}</div>
            </div>
          </div>
        </div>

        {/* Right Column: Map */}
        <div className="contact-map-wrapper">
          <iframe 
            title="Yılmazlar Mobilya Konum Haritası"
            src={siteConfig.googleMapsEmbedUrl} 
            width="100%" 
            height="100%" 
            style={{ border: 0, minHeight: '350px' }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

      <style>{`
        .contact-header {
          text-align: center;
          margin-bottom: 3rem;
        }
        .contact-title {
          font-family: var(--font-serif);
          font-size: 2.75rem;
          font-weight: 700;
          margin: 0.5rem 0 1rem 0;
        }
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          margin-bottom: 4rem;
        }
        .contact-cards {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .contact-card {
          background: var(--bg-card);
          padding: 1.5rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-subtle);
          box-shadow: var(--shadow-sm);
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }
        .contact-card-icon {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .contact-icon-phone {
          background: rgba(2, 132, 199, 0.1);
          color: var(--phone-color);
        }
        .contact-icon-wa {
          background: rgba(37, 211, 102, 0.1);
          color: var(--whatsapp-color);
        }
        .contact-icon-address {
          background: var(--accent-amber-light);
          color: var(--accent-wood);
        }
        .contact-card-body {
          flex: 1;
          min-width: 0;
        }
        .contact-card-label {
          font-size: 0.85rem;
          color: var(--text-muted);
          font-weight: 600;
        }
        .contact-card-value {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--text-main);
        }
        .contact-card-value-wa {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--whatsapp-color);
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }
        .contact-card-address {
          font-weight: 700;
          color: var(--text-main);
          font-size: 1.05rem;
          line-height: 1.5;
          margin-bottom: 0.75rem;
        }
        .contact-maps-link {
          font-size: 0.88rem;
          color: var(--accent-wood);
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
        }
        .contact-card-hours-main {
          font-weight: 700;
          color: var(--text-main);
        }
        .contact-card-hours-sub {
          font-size: 0.9rem;
          color: var(--text-muted);
        }
        .contact-map-wrapper {
          border-radius: var(--radius-md);
          overflow: hidden;
          border: 1px solid var(--border-subtle);
          box-shadow: var(--shadow-md);
          min-height: 400px;
          background: #EAE6E1;
        }

        /* ========= MOBILE RESPONSIVE ========= */
        @media (max-width: 768px) {
          .contact-title {
            font-size: 2rem;
          }
          .contact-header {
            margin-bottom: 2rem;
          }
          .contact-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .contact-card {
            padding: 1.15rem;
            gap: 1rem;
          }
          .contact-card-icon {
            width: 48px;
            height: 48px;
          }
          .contact-card-value,
          .contact-card-value-wa {
            font-size: 1.05rem;
          }
          .contact-card-address {
            font-size: 0.95rem;
          }
          .contact-map-wrapper {
            min-height: 280px;
          }
        }
        @media (max-width: 480px) {
          .contact-title {
            font-size: 1.6rem;
          }
          .contact-card {
            flex-direction: column;
            text-align: center;
            padding: 1.25rem 1rem;
          }
          .contact-card-address {
            text-align: center;
          }
          .contact-maps-link {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
