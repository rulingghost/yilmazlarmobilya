import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  Tag, 
  ChevronLeft, 
  ChevronRight, 
  Phone, 
  MapPin, 
  Clock, 
  Heart, 
  Moon, 
  ShieldCheck 
} from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { siteConfig } from '../config/siteConfig';

export function HeroSlider({ products, setActivePage, setSelectedCategory }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(null);

  // Dynamically compute the lowest wedding package price from current products
  const weddingPackages = (products || []).filter(p => 
    p.name.toLowerCase().includes('düğün paketi') || 
    (p.category && p.category.toLowerCase().includes('düğün'))
  );
  const validWeddingPrices = weddingPackages.map(p => p.price).filter(pr => pr && pr > 20000);
  const minWeddingPrice = validWeddingPrices.length > 0 
    ? Math.min(...validWeddingPrices) 
    : 141372;
  const dynamicWeddingText = `3'lü Düğün Paketi ${minWeddingPrice.toLocaleString('tr-TR')} TL'den Başlayan Fiyatlarla!`;

  const slides = [
    {
      id: 'living',
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1920&q=85',
      badgePrimary: { text: 'İstikbal Yetkili Bayi', icon: <Sparkles size={14} /> },
      badgeGlass: { text: dynamicWeddingText, icon: <Tag size={14} style={{ color: 'var(--accent-gold)' }} /> },
      title: 'İstikbal Kalitesi ve Yılmazlar Güvencesi Evinizde',
      description: 'Oturma gruplarından yatak odalarına, yemek masalarından halı ve ev tekstiline kadar yüzlerce güncel İstikbal modelini inceleyin. Mağaza fiyatları ve özel indirimler için temsilcimizle WhatsApp\'tan görüşün.',
      primaryBtn: {
        text: `Kataloğu İncele (${(products || []).length} Ürün)`,
        action: () => { setActivePage('products'); window.scrollTo(0, 0); }
      },
      secondaryBtn: {
        text: 'WhatsApp Bilgi Al',
        href: siteConfig.getGeneralWhatsAppLink(),
        isWhatsApp: true
      }
    },
    {
      id: 'wedding',
      image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1920&q=85',
      badgePrimary: { text: '2026 Düğün Sezonu', icon: <Heart size={14} /> },
      badgeGlass: { text: dynamicWeddingText, icon: <Tag size={14} style={{ color: 'var(--accent-gold)' }} /> },
      title: "Evinizin Her Köşesi İçin 3'lü Düğün Paketleri",
      description: 'Salon, yatak odası ve yemek odası bir arada! Yılmazlar Mobilya Ankara Siteler mağazamıza özel taksit imkanları ve peşin alım indirimleriyle yuvanızı kurun.',
      primaryBtn: {
        text: 'Düğün Paketlerini Gör',
        action: () => { 
          if (setSelectedCategory) setSelectedCategory('Düğün Paketi');
          setActivePage('products'); 
          window.scrollTo(0, 0); 
        }
      },
      secondaryBtn: {
        text: 'Paket Fiyatı Sor',
        href: `https://wa.me/${siteConfig.whatsappRaw}?text=${encodeURIComponent("Merhaba, 3'lü Düğün Paketleri ve kampanya fiyat teklifi hakkında bilgi almak istiyorum.")}`,
        isWhatsApp: true
      }
    },
    {
      id: 'sleep',
      image: 'https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=1920&q=85',
      badgePrimary: { text: 'Konforlu & Sağlıklı Uyku', icon: <Moon size={14} /> },
      badgeGlass: { text: '10 Yıl Yay Garantisi & Ortopedik Konfor', icon: <ShieldCheck size={14} style={{ color: 'var(--accent-gold)' }} /> },
      title: 'İstikbal Yatak, Baza & Başlık Koleksiyonu',
      description: 'Cooler, Stress Free, Synergy ve ortopedik serilerde tüm ebat seçenekleri (90x190\'dan 200x200\'e). Vücudunuza en uygun yatağı ve modern baza setlerini keşfedin.',
      primaryBtn: {
        text: 'Yatak & Baza Modelleri',
        action: () => { 
          if (setSelectedCategory) setSelectedCategory('Baza & Yatak');
          setActivePage('products'); 
          window.scrollTo(0, 0); 
        }
      },
      secondaryBtn: {
        text: 'Ebat ve Fiyat Danışın',
        href: `https://wa.me/${siteConfig.whatsappRaw}?text=${encodeURIComponent("Merhaba, İstikbal yatak ve baza ebat seçenekleri ve fiyatları hakkında bilgi almak istiyorum.")}`,
        isWhatsApp: true
      }
    },
    {
      id: 'showroom',
      image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1920&q=85',
      badgePrimary: { text: 'Siteler / Ankara Showroom', icon: <MapPin size={14} /> },
      badgeGlass: { text: siteConfig.workingHours.display, icon: <Clock size={14} style={{ color: 'var(--accent-gold)' }} /> },
      title: "Ankara'nın Kalbi Siteler Showroomumuza Bekliyoruz",
      description: 'Demirhendek Caddesi No:158 adresindeki geniş showroomumuzda en yeni modelleri bizzat deneyimleyin, kumaş kartelalarını inceleyin ve uzman ekibimizden destek alın.',
      primaryBtn: {
        text: 'Haritada Yol Tarifi Al',
        action: () => { window.open(siteConfig.googleMapsDirectUrl, '_blank'); }
      },
      secondaryBtn: {
        text: 'Mağazayı Arayın',
        href: `tel:${siteConfig.phoneRaw}`,
        isPhone: true
      }
    }
  ];

  // Auto-slide advance
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (!touchStartX.current) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) nextSlide();
    else if (diff < -50) prevSlide();
    touchStartX.current = null;
  };

  const active = slides[currentSlide];

  return (
    <div 
      className="hero-slider-wrapper"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Slides */}
      {slides.map((s, idx) => (
        <div
          key={s.id}
          className={`hero-slide-bg ${idx === currentSlide ? 'active' : ''}`}
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(20, 18, 16, 0.94) 0%, rgba(30, 26, 22, 0.72) 60%, rgba(0, 0, 0, 0.45) 100%), url("${s.image}")`
          }}
        />
      ))}

      {/* Slide Content */}
      <div className="hero-slider-content-layer">
        <div className="hero-slider-inner animate-fade-in" key={active.id}>
          
          <div className="hero-badges">
            <span className="hero-badge-primary">
              {active.badgePrimary.icon} {active.badgePrimary.text}
            </span>
            <span className="hero-badge-glass">
              {active.badgeGlass.icon} {active.badgeGlass.text}
            </span>
          </div>

          <h1 className="hero-title">{active.title}</h1>
          <p className="hero-desc">{active.description}</p>

          <div className="hero-cta-row">
            {active.primaryBtn.action ? (
              <button 
                onClick={active.primaryBtn.action} 
                className="btn-primary hero-cta-primary"
              >
                <span>{active.primaryBtn.text}</span>
                <ArrowRight size={18} />
              </button>
            ) : null}

            {active.secondaryBtn.isWhatsApp ? (
              <a 
                href={active.secondaryBtn.href} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-whatsapp hero-cta-wa"
              >
                <WhatsAppIcon size={20} />
                <span>{active.secondaryBtn.text}</span>
              </a>
            ) : active.secondaryBtn.isPhone ? (
              <a 
                href={active.secondaryBtn.href} 
                className="btn-secondary hero-cta-phone"
              >
                <Phone size={18} />
                <span>{active.secondaryBtn.text}</span>
              </a>
            ) : null}
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={prevSlide} 
        className="hero-nav-arrow hero-nav-prev"
        aria-label="Önceki Slayt"
      >
        <ChevronLeft size={24} />
      </button>

      <button 
        onClick={nextSlide} 
        className="hero-nav-arrow hero-nav-next"
        aria-label="Sonraki Slayt"
      >
        <ChevronRight size={24} />
      </button>

      {/* Pagination Dots */}
      <div className="hero-dots-container">
        {slides.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => setCurrentSlide(idx)}
            className={`hero-dot ${idx === currentSlide ? 'active' : ''}`}
            aria-label={`Slayt ${idx + 1}`}
          />
        ))}
      </div>

      <style>{`
        .hero-slider-wrapper {
          position: relative;
          min-height: 480px;
          border-radius: var(--radius-lg, 16px);
          overflow: hidden;
          margin-bottom: 3.5rem;
          box-shadow: var(--shadow-lg, 0 10px 25px rgba(0,0,0,0.15));
          border: 1px solid rgba(212, 175, 55, 0.25);
          display: flex;
          align-items: center;
        }
        .hero-slide-bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          opacity: 0;
          transform: scale(1.04);
          transition: opacity 0.8s ease-in-out, transform 4s ease-out;
          z-index: 1;
        }
        .hero-slide-bg.active {
          opacity: 1;
          transform: scale(1);
        }
        .hero-slider-content-layer {
          position: relative;
          z-index: 3;
          width: 100%;
          padding: 3.5rem 3rem;
        }
        .hero-slider-inner {
          max-width: 680px;
        }
        .hero-badges {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          margin-bottom: 1.25rem;
        }
        .hero-badge-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: linear-gradient(135deg, var(--accent-wood, #8C5A3C), var(--accent-amber, #D97706));
          color: #FFF;
          padding: 0.35rem 0.9rem;
          border-radius: 9999px;
          font-size: 0.82rem;
          font-weight: 800;
          letter-spacing: 0.5px;
        }
        .hero-badge-glass {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.25);
          color: #FCE0C8;
          padding: 0.35rem 0.9rem;
          border-radius: 9999px;
          font-size: 0.82rem;
          font-weight: 700;
          backdrop-filter: blur(6px);
        }
        .hero-title {
          font-family: var(--font-serif, Georgia, serif);
          font-size: clamp(2rem, 4vw, 3.4rem);
          font-weight: 800;
          line-height: 1.18;
          margin-bottom: 1.15rem;
          color: #FFF;
          text-shadow: 0 2px 10px rgba(0,0,0,0.5);
        }
        .hero-desc {
          font-size: 1.05rem;
          color: #E5DED5;
          line-height: 1.6;
          margin-bottom: 2rem;
          max-width: 600px;
        }
        .hero-cta-row {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .hero-cta-primary {
          padding: 0.85rem 2rem;
          font-size: 1rem;
          border-radius: 9999px;
          background: linear-gradient(135deg, var(--accent-wood, #8C5A3C) 0%, var(--accent-amber, #D97706) 100%);
          box-shadow: 0 6px 20px rgba(140, 90, 60, 0.4);
          color: #FFF;
          font-weight: 700;
          border: none;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s ease;
        }
        .hero-cta-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(140, 90, 60, 0.55);
        }
        .hero-cta-wa {
          padding: 0.85rem 1.75rem;
          font-size: 1rem;
          border-radius: 9999px;
        }
        .hero-cta-phone {
          padding: 0.85rem 1.75rem;
          font-size: 1rem;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.15);
          color: #FFF;
          border: 1px solid rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(4px);
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .hero-cta-phone:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: translateY(-2px);
        }
        .hero-nav-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(15, 23, 42, 0.5);
          backdrop-filter: blur(4px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #FFF;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .hero-nav-arrow:hover {
          background: var(--accent-amber, #D97706);
          border-color: var(--accent-amber, #D97706);
          color: #1A1A1A;
          transform: translateY(-50%) scale(1.08);
        }
        .hero-nav-prev {
          left: 1.25rem;
        }
        .hero-nav-next {
          right: 1.25rem;
        }
        .hero-dots-container {
          position: absolute;
          bottom: 1.25rem;
          right: 2rem;
          z-index: 10;
          display: flex;
          gap: 0.5rem;
        }
        .hero-dot {
          width: 10px;
          height: 10px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.35);
          border: none;
          cursor: pointer;
          transition: all 0.25s ease;
          padding: 0;
        }
        .hero-dot.active {
          width: 28px;
          background: var(--accent-amber, #D97706);
          box-shadow: 0 0 10px rgba(217, 119, 6, 0.6);
        }
        @media (max-width: 768px) {
          .hero-slider-wrapper {
            min-height: auto;
            border-radius: var(--radius-md, 12px);
            margin-bottom: 2rem;
          }
          .hero-slider-content-layer {
            padding: 2.25rem 1.25rem 3.5rem 1.25rem;
          }
          .hero-title {
            font-size: 1.75rem;
          }
          .hero-desc {
            font-size: 0.95rem;
            margin-bottom: 1.5rem;
          }
          .hero-nav-arrow {
            display: none;
          }
          .hero-dots-container {
            bottom: 0.85rem;
            right: 50%;
            transform: translateX(50%);
          }
        }
      `}</style>
    </div>
  );
}
