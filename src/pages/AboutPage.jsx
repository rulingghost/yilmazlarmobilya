import React from 'react';
import { Award, HeartHandshake } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

export function AboutPage() {
  return (
    <div className="animate-fade-in container" style={{ paddingTop: '2rem' }}>
      <div className="about-header">
        <span className="section-tag">Kurumsal Profil</span>
        <h1 className="about-title">Yılmazlar Mobilya Hakkında</h1>
        <p className="about-subtitle">
          Yılların getirdiği tecrübe, müşteri memnuniyeti odaklı hizmet anlayışı ve Türkiye'nin lider markası İstikbal'in güvencesiyle yaşam alanlarınıza şıklık katıyoruz.
        </p>
      </div>

      <div className="about-grid">
        <div className="about-image-wrapper">
          <img 
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80" 
            alt="Yılmazlar Mobilya Mağaza" 
            className="about-image"
          />
        </div>

        <div>
          <h2 className="about-content-title">
            Kalite, Zarafet ve Güvenli Alışveriş Hizmeti
          </h2>
          <p className="about-text">
            Yılmazlar Mobilya olarak, evinizin en özel köşelerini tasarlarken hem ergonomiyi hem estetiği ön planda tutuyoruz. İstikbal'in yenilikçi ürün gamını yakından takip ederek, en güncel modelleri avantajlı koşullarla sizlere sunuyoruz.
          </p>
          <p className="about-text" style={{ marginBottom: '2rem' }}>
            Web sitemiz üzerinden sunduğumuz ürün tanıtım kataloğu sayesinde; koltuk takımlarından yemek odalarına, yatak ve bazalardan sehpaya kadar tüm koleksiyonlarımızın detaylarına hızlıca ulaşabilir, satış ekibimizle anında iletişime geçebilirsiniz.
          </p>

          <div className="about-features">
            <div className="about-feature-card">
              <Award size={28} style={{ color: 'var(--accent-wood)', marginBottom: '0.5rem' }} />
              <h4 className="about-feature-title">Orijinal Kalite</h4>
              <p className="about-feature-desc">Sadece fabrika garantili ürünler</p>
            </div>
            <div className="about-feature-card">
              <HeartHandshake size={28} style={{ color: 'var(--accent-wood)', marginBottom: '0.5rem' }} />
              <h4 className="about-feature-title">Müşteri Odaklı</h4>
              <p className="about-feature-desc">Satış öncesi ve sonrası tam destek</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .about-header {
          max-width: 800px;
          margin: 0 auto 3.5rem auto;
          text-align: center;
        }
        .about-title {
          font-family: var(--font-serif);
          font-size: 2.75rem;
          font-weight: 700;
          margin: 0.5rem 0 1.25rem 0;
        }
        .about-subtitle {
          font-size: 1.15rem;
          color: var(--text-muted);
          line-height: 1.7;
        }
        .about-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: center;
          margin-bottom: 4rem;
        }
        .about-image-wrapper {
          border-radius: var(--radius-md);
          overflow: hidden;
          box-shadow: var(--shadow-md);
        }
        .about-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .about-content-title {
          font-family: var(--font-serif);
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 1.25rem;
        }
        .about-text {
          color: var(--text-muted);
          line-height: 1.7;
          margin-bottom: 1.25rem;
        }
        .about-features {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }
        .about-feature-card {
          background: var(--bg-card);
          padding: 1.25rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-subtle);
        }
        .about-feature-title {
          font-weight: 700;
          font-size: 1rem;
        }
        .about-feature-desc {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        /* ========= MOBILE RESPONSIVE ========= */
        @media (max-width: 768px) {
          .about-title {
            font-size: 2rem;
          }
          .about-subtitle {
            font-size: 1rem;
          }
          .about-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .about-content-title {
            font-size: 1.5rem;
          }
          .about-header {
            margin-bottom: 2.5rem;
          }
        }
        @media (max-width: 480px) {
          .about-title {
            font-size: 1.6rem;
          }
          .about-features {
            grid-template-columns: 1fr;
          }
          .about-feature-card {
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}
