import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import initialSliders from '../../data/sliders.json';

export function HeroSlider({ setActivePage, setSelectedCategory }) {
  const [slides, setSlides] = useState(initialSliders || []);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(null);

  // Fetch updated sliders.json from public if available
  useEffect(() => {
    fetch('/data/sliders.json')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setSlides(data);
        }
      })
      .catch(() => {});
  }, []);

  // Auto-play interval
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
  };

  const handleSlideClick = (slide) => {
    if (slide.category && setSelectedCategory) {
      setSelectedCategory(slide.category);
      if (setActivePage) {
        setActivePage('products');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (setActivePage) {
      setActivePage('products');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (!touchStartX.current) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 45) nextSlide();
    else if (diff < -45) prevSlide();
    touchStartX.current = null;
  };

  if (!slides || slides.length === 0) return null;

  return (
    <div 
      className="hero-slider-container"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Visual Banners Carousel - Direct from İstikbal (No text overlay) */}
      <div className="hero-slider-track">
        {slides.map((slide, idx) => {
          const isActive = idx === currentSlide;
          return (
            <div
              key={slide.id || idx}
              className={`hero-slide-item ${isActive ? 'active' : ''}`}
              onClick={() => handleSlideClick(slide)}
              role="button"
              tabIndex={0}
              title={slide.alt || 'İstikbal Kampanyaları'}
            >
              <picture>
                {slide.mobile && (
                  <source media="(max-width: 768px)" srcSet={slide.mobile} />
                )}
                <img
                  src={slide.image}
                  alt={slide.alt || 'İstikbal Kampanyası'}
                  className="hero-slide-img"
                  loading={idx === 0 ? 'eager' : 'lazy'}
                />
              </picture>
            </div>
          );
        })}
      </div>

      {/* Navigation Arrow Left */}
      <button 
        type="button"
        onClick={(e) => { e.stopPropagation(); prevSlide(); }} 
        className="hero-slider-btn hero-slider-btn-prev"
        aria-label="Önceki Kampanya"
      >
        <ChevronLeft size={26} />
      </button>

      {/* Navigation Arrow Right */}
      <button 
        type="button"
        onClick={(e) => { e.stopPropagation(); nextSlide(); }} 
        className="hero-slider-btn hero-slider-btn-next"
        aria-label="Sonraki Kampanya"
      >
        <ChevronRight size={26} />
      </button>

      {/* Pagination Dots */}
      <div className="hero-slider-dots">
        {slides.map((slide, idx) => (
          <button
            key={slide.id || idx}
            type="button"
            onClick={(e) => { e.stopPropagation(); setCurrentSlide(idx); }}
            className={`hero-slider-dot ${idx === currentSlide ? 'active' : ''}`}
            aria-label={`Slayt ${idx + 1}`}
          />
        ))}
      </div>

      <style>{`
        .hero-slider-container {
          position: relative;
          width: 100%;
          border-radius: var(--radius-lg, 16px);
          overflow: hidden;
          margin-bottom: 3rem;
          box-shadow: var(--shadow-md, 0 8px 24px rgba(0, 0, 0, 0.08));
          border: 1px solid var(--border-subtle, #EFECE6);
          background: #F8F6F2;
          user-select: none;
        }

        .hero-slider-track {
          position: relative;
          width: 100%;
          /* 1920 / 700 banner ratio ~ 36.45% */
          aspect-ratio: 1920 / 700;
          overflow: hidden;
        }

        .hero-slide-item {
          position: absolute;
          inset: 0;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hero-slide-item.active {
          opacity: 1;
          pointer-events: auto;
          z-index: 2;
        }

        .hero-slide-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.4s ease;
        }

        .hero-slide-item:hover .hero-slide-img {
          transform: scale(1.012);
        }

        .hero-slider-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(0, 0, 0, 0.08);
          color: #2C2420;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
          transition: all 0.2s ease;
        }

        .hero-slider-btn:hover {
          background: #FFFFFF;
          color: var(--accent-amber, #D97706);
          transform: translateY(-50%) scale(1.1);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.22);
        }

        .hero-slider-btn-prev {
          left: 1.25rem;
        }

        .hero-slider-btn-next {
          right: 1.25rem;
        }

        .hero-slider-dots {
          position: absolute;
          bottom: 1.25rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
          display: flex;
          gap: 0.6rem;
          background: rgba(0, 0, 0, 0.25);
          backdrop-filter: blur(6px);
          padding: 0.4rem 0.8rem;
          border-radius: 9999px;
        }

        .hero-slider-dot {
          width: 10px;
          height: 10px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.55);
          border: none;
          cursor: pointer;
          transition: all 0.25s ease;
          padding: 0;
        }

        .hero-slider-dot:hover {
          background: #FFFFFF;
        }

        .hero-slider-dot.active {
          width: 26px;
          background: #FFFFFF;
          box-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
        }

        @media (max-width: 768px) {
          .hero-slider-container {
            border-radius: var(--radius-md, 12px);
            margin-bottom: 2rem;
          }

          .hero-slider-track {
            /* Keep responsive aspect ratio on mobile */
            aspect-ratio: 16 / 9;
          }

          .hero-slider-btn {
            width: 36px;
            height: 36px;
            background: rgba(255, 255, 255, 0.75);
          }

          .hero-slider-btn-prev {
            left: 0.5rem;
          }

          .hero-slider-btn-next {
            right: 0.5rem;
          }

          .hero-slider-dots {
            bottom: 0.6rem;
            padding: 0.3rem 0.6rem;
            gap: 0.45rem;
          }

          .hero-slider-dot {
            width: 8px;
            height: 8px;
          }

          .hero-slider-dot.active {
            width: 18px;
          }
        }
      `}</style>
    </div>
  );
}
