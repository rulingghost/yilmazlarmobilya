import React, { useState, useRef, useMemo } from 'react';
import { 
  Phone, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  CreditCard, 
  Ruler, 
  Layers, 
  ShieldCheck, 
  Truck, 
  PackageCheck,
  Plus,
  Minus,
  CheckCircle2,
  HelpCircle,
  Tag,
  Info
} from 'lucide-react';
import { WhatsAppIcon } from '../components/WhatsAppIcon';
import { ImageWithFallback } from '../components/ImageWithFallback';
import { ProductCard } from '../components/ProductCard';
import { siteConfig } from '../config/siteConfig';

export function ProductDetailPage({ product, allProducts, onSelectProduct, onBack }) {
  const images = product.images && product.images.length > 0 ? product.images : [null];
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Tab State: If bundle items exist, default to 'takim-icerigi', otherwise 'urun-bilgisi'
  const hasBundle = Boolean(product.bundleItems && product.bundleItems.length > 0);
  const [activeMainTab, setActiveMainTab] = useState(hasBundle ? 'takim-icerigi' : 'urun-bilgisi');

  // Mini-tab state per module (whether user is viewing 'specs' or 'dimensions')
  const [moduleSubTabs, setModuleSubTabs] = useState({});

  // Module quantities state for interactive customizer: { [moduleId]: currentQty }
  const [moduleQuantities, setModuleQuantities] = useState(() => {
    const initial = {};
    if (product.bundleItems) {
      product.bundleItems.forEach(item => {
        const q = item.quantity !== undefined ? item.quantity : (item.defaultQty || 0);
        initial[item.id] = q;
      });
    }
    return initial;
  });

  // Swipe handling for mobile gallery
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const currentImage = images[activeImageIndex] || images[0];

  const handleNextImage = () => {
    if (images.length <= 1) return;
    setActiveImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handlePrevImage = () => {
    if (images.length <= 1) return;
    setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (images.length <= 1) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 40) handleNextImage();
    else if (diff < -40) handlePrevImage();
  };

  const formatPrice = (price) => {
    if (!price && price !== 0) return '';
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Quantity Stepper Handler
  const handleQtyChange = (moduleId, delta) => {
    setModuleQuantities(prev => {
      const current = prev[moduleId] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [moduleId]: next };
    });
  };

  // Module Sub-tab Handler
  const toggleModuleSubTab = (moduleId, tab) => {
    setModuleSubTabs(prev => ({ ...prev, [moduleId]: tab }));
  };

  // Live Calculations
  const { calculatedTotal, totalItemsCount, selectedModules } = useMemo(() => {
    if (!product.bundleItems || product.bundleItems.length === 0) {
      return {
        calculatedTotal: product.price || 0,
        totalItemsCount: 1,
        selectedModules: []
      };
    }

    let total = 0;
    let count = 0;
    const selected = [];

    product.bundleItems.forEach(item => {
      const qty = moduleQuantities[item.id] !== undefined ? moduleQuantities[item.id] : (item.defaultQty || 0);
      if (qty > 0) {
        total += item.price * qty;
        count += qty;
        selected.push({ ...item, currentQty: qty, lineTotal: item.price * qty });
      }
    });

    return {
      calculatedTotal: total > 0 ? total : product.price,
      totalItemsCount: count,
      selectedModules: selected
    };
  }, [product, moduleQuantities]);

  // Dynamic WhatsApp Message with customized bundle breakdown
  const customWhatsAppUrl = useMemo(() => {
    let text = `Merhaba, Yılmazlar Mobilya web sitenizden *${product.name}* hakkında bilgi almak istiyorum.`;
    if (selectedModules.length > 0) {
      text += `\n\n*Seçilen Takım İçeriği:*`;
      selectedModules.forEach(item => {
        text += `\n• ${item.currentQty} Adet ${item.name} (${formatPrice(item.lineTotal)})`;
      });
      text += `\n\n*Toplam Takım Tutarı:* ${formatPrice(calculatedTotal)}`;
    } else {
      text += `\nFiyat: ${formatPrice(product.price)}`;
    }
    const rawPhone = (siteConfig.whatsappRaw || siteConfig.phoneRaw || '905469610131').replace(/[^0-9]/g, '');
    return `https://wa.me/${rawPhone}?text=${encodeURIComponent(text)}`;
  }, [product, selectedModules, calculatedTotal]);

  const similarProducts = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const sku = product.sku || product.details?.['Stok Kodu'] || null;
  const installmentPrice = product.installmentPrice || (product.originalPrice && product.originalPrice > product.price ? product.originalPrice : null);

  return (
    <div className="animate-fade-in container detail-page-container">
      {/* Back Button */}
      <button onClick={onBack} className="detail-back-btn">
        <ChevronLeft size={16} />
        <span>Tüm Ürünlere Dön</span>
      </button>

      {/* Main Product Hero / Gallery Section */}
      <div className="detail-hero-grid">
        {/* Left: Product Images Gallery */}
        <div className="detail-gallery-col">
          <div 
            className="detail-main-image"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <ImageWithFallback
              src={currentImage}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />

            {images.length > 1 && (
              <>
                <button onClick={handlePrevImage} className="detail-nav-arrow detail-arrow-left" aria-label="Önceki">
                  <ChevronLeft size={22} />
                </button>
                <button onClick={handleNextImage} className="detail-nav-arrow detail-arrow-right" aria-label="Sonraki">
                  <ChevronRight size={22} />
                </button>
                <span className="detail-image-counter">
                  {activeImageIndex + 1} / {images.length} Fotoğraf
                </span>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="detail-thumb-wrapper">
              <div className="detail-thumb-row">
                {images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`detail-thumb ${activeImageIndex === idx ? 'detail-thumb-active' : ''}`}
                  >
                    <ImageWithFallback
                      src={imgUrl}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Product Basic Overview */}
        <div className="detail-hero-info">
          <div className="detail-tags">
            <span className="section-tag" style={{ margin: 0 }}>
              {product.category}
            </span>
            {product.isNew && (
              <span className="detail-new-badge">Yeni Sezon</span>
            )}
            {sku && (
              <span className="detail-sku-badge">
                Stok Kodu: <strong>{sku}</strong>
              </span>
            )}
          </div>

          <h1 className="detail-title">{product.name}</h1>

          {/* Price Box */}
          <div className="detail-price-box">
            <div className="detail-price-main-row">
              <div>
                <div className="detail-price-label">
                  {hasBundle ? 'SEÇİLEN TAKIM TUTARI' : 'GÜNCEL İSTİKBAL FİYATI'}
                </div>
                <div className="detail-price-value">{formatPrice(calculatedTotal)}</div>
              </div>
              {product.originalPrice && product.originalPrice > calculatedTotal && (
                <div className="detail-price-old">{formatPrice(product.originalPrice)}</div>
              )}
            </div>

            <div className="detail-installment-box">
              <div className="installment-tag">
                <CreditCard size={15} />
                <span>Peşin Fiyatına World'e Özel 9 Taksit Uygulanmaktadır.</span>
              </div>
              {installmentPrice && installmentPrice > calculatedTotal && (
                <div className="installment-other">
                  Diğer Kartlara 9 Taksitli Fiyatı: <strong>{formatPrice(installmentPrice)}</strong>
                </div>
              )}
            </div>
          </div>

          {product.shortDescription && (
            <p className="detail-desc">{product.shortDescription}</p>
          )}

          {/* Quick CTA Grid */}
          <div className="detail-cta-grid">
            <a
              href={customWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp detail-cta-btn"
            >
              <WhatsAppIcon size={20} />
              <span>WhatsApp'tan Bilgi & Sipariş</span>
            </a>
            <a href={`tel:${siteConfig.phoneRaw}`} className="btn-phone detail-cta-btn">
              <Phone size={20} />
              <span>Telefonla Bilgi Al</span>
            </a>
          </div>

          {/* Trust Highlights */}
          <div className="detail-trust-grid">
            <div className="trust-item">
              <ShieldCheck size={18} className="trust-icon" />
              <div>
                <div className="trust-title">2 Yıl Orijinal Garanti</div>
                <div className="trust-desc">İstikbal Fabrika Garantili</div>
              </div>
            </div>
            <div className="trust-item">
              <Truck size={18} className="trust-icon" />
              <div>
                <div className="trust-title">Ücretsiz Teslimat & Montaj</div>
                <div className="trust-desc">Yılmazlar Mobilya Ekibince</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TOP NAVIGATION TABS (Matching İstikbal Screenshot 3) */}
      <div className="detail-tabs-nav-wrapper">
        <div className="detail-tabs-nav">
          {hasBundle && (
            <button
              onClick={() => setActiveMainTab('takim-icerigi')}
              className={`detail-tab-btn ${activeMainTab === 'takim-icerigi' ? 'active' : ''}`}
            >
              <PackageCheck size={16} />
              <span>Takım İçeriği</span>
              <span className="tab-count-bubble">{product.bundleItems.length}</span>
            </button>
          )}

          <button
            onClick={() => setActiveMainTab('urun-bilgisi')}
            className={`detail-tab-btn ${activeMainTab === 'urun-bilgisi' ? 'active' : ''}`}
          >
            <Info size={16} />
            <span>Ürün Bilgisi</span>
          </button>

          <button
            onClick={() => setActiveMainTab('kampanyalar')}
            className={`detail-tab-btn ${activeMainTab === 'kampanyalar' ? 'active' : ''}`}
          >
            <Tag size={16} />
            <span>Kampanyalar</span>
          </button>

          <button
            onClick={() => setActiveMainTab('teslimat')}
            className={`detail-tab-btn ${activeMainTab === 'teslimat' ? 'active' : ''}`}
          >
            <Truck size={16} />
            <span>Teslimat ve Kurulum</span>
          </button>

          <button
            onClick={() => setActiveMainTab('taksit')}
            className={`detail-tab-btn ${activeMainTab === 'taksit' ? 'active' : ''}`}
          >
            <CreditCard size={16} />
            <span>Taksit Seçenekleri</span>
          </button>

          <button
            onClick={() => setActiveMainTab('soru-cevap')}
            className={`detail-tab-btn ${activeMainTab === 'soru-cevap' ? 'active' : ''}`}
          >
            <HelpCircle size={16} />
            <span>Soru & Cevap</span>
          </button>
        </div>
      </div>

      {/* TAB CONTENT AREAS */}

      {/* 1. TAKIM İÇERİĞİ KİŞİSELLEŞTİRME & STICKY TAKIM ÖZETİ (Screenshot 3 ile Birebir Aynı) */}
      {activeMainTab === 'takim-icerigi' && hasBundle && (
        <div className="customizer-split-layout">
          {/* Left Column: All Set Modules with +/- controls */}
          <div className="customizer-modules-col">
            <div className="customizer-section-title">
              <h3>Takım Modülleri ve Parçaları</h3>
              <p>İstediğiniz parçayı ekleyip çıkarabilir, takımınızı zevkinize göre özelleştirebilirsiniz.</p>
            </div>

            <div className="module-cards-list">
              {product.bundleItems.map((item) => {
                const currentQty = moduleQuantities[item.id] !== undefined ? moduleQuantities[item.id] : (item.defaultQty || 0);
                const subTab = moduleSubTabs[item.id] || 'specs';
                const hasSpecs = item.specs && Object.keys(item.specs).length > 0;
                const hasDims = item.dimensions && Object.keys(item.dimensions).length > 0;

                return (
                  <div key={item.id} className={`module-card ${currentQty > 0 ? 'in-set' : 'not-in-set'}`}>
                    <div className="module-card-main">
                      {/* Module Image Preview */}
                      <div className="module-img-container">
                        <img 
                          src={item.image || (item.images && item.images[0]) || currentImage} 
                          alt={item.name} 
                          loading="lazy" 
                        />
                      </div>

                      {/* Module Details & Mini-tabs */}
                      <div className="module-info-container">
                        <div className="module-title-row">
                          <h4 className="module-title">{item.name}</h4>
                          {item.sku && <span className="module-sku">{item.sku}</span>}
                        </div>

                        {/* Mini Sub-Tabs: Ürün Özellikleri / Boyutlar */}
                        {(hasSpecs || hasDims) && (
                          <div className="module-subtabs-header">
                            {hasSpecs && (
                              <button
                                onClick={() => toggleModuleSubTab(item.id, 'specs')}
                                className={`module-subtab-link ${subTab === 'specs' ? 'active' : ''}`}
                              >
                                Ürün Özellikleri
                              </button>
                            )}
                            {hasDims && (
                              <button
                                onClick={() => toggleModuleSubTab(item.id, 'dims')}
                                className={`module-subtab-link ${subTab === 'dims' ? 'active' : ''}`}
                              >
                                Boyutlar
                              </button>
                            )}
                          </div>
                        )}

                        {/* Specs Content */}
                        {subTab === 'specs' && hasSpecs && (
                          <div className="module-props-grid">
                            {Object.entries(item.specs).slice(0, 6).map(([k, v]) => (
                              <div key={k} className="module-prop-item">
                                <span className="prop-k">{k}:</span>
                                <span className="prop-v">{v}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Dimensions Content */}
                        {subTab === 'dims' && hasDims && (
                          <div className="module-props-grid">
                            {Object.entries(item.dimensions).map(([k, v]) => (
                              <div key={k} className="module-prop-item">
                                <span className="prop-k">{k}:</span>
                                <span className="prop-v">{v}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Module Price & Stepper Button */}
                      <div className="module-action-col">
                        <div className="module-price-block">
                          <div className="module-price-val">{formatPrice(item.price)}</div>
                          {item.originalPrice && item.originalPrice > item.price && (
                            <div className="module-price-old">{formatPrice(item.originalPrice)}</div>
                          )}
                        </div>

                        <div className="quantity-stepper">
                          <button
                            onClick={() => handleQtyChange(item.id, -1)}
                            disabled={currentQty <= 0}
                            className="stepper-btn stepper-minus"
                            aria-label="Azalt"
                          >
                            <Minus size={15} />
                          </button>
                          <span className="stepper-qty">{currentQty}</span>
                          <button
                            onClick={() => handleQtyChange(item.id, 1)}
                            className="stepper-btn stepper-plus"
                            aria-label="Arttır"
                          >
                            <Plus size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Sticky "Takım Özeti" Box */}
          <div className="customizer-summary-col">
            <div className="sticky-summary-card">
              <div className="summary-header">
                <h3 className="summary-title">Takım Özeti</h3>
                <span className="summary-badge">{totalItemsCount} Adet Ürün</span>
              </div>

              {/* Set Snapshot */}
              <div className="summary-product-hero">
                <div className="summary-thumb">
                  <img src={currentImage} alt={product.name} />
                </div>
                <div>
                  <div className="summary-prod-name">{product.name}</div>
                  <div className="summary-prod-cat">{product.category}</div>
                </div>
              </div>

              {/* Selected Modules Breakdown */}
              <div className="summary-items-list">
                {selectedModules.length > 0 ? (
                  selectedModules.map(item => (
                    <div key={item.id} className="summary-line-item">
                      <div className="line-item-name">
                        <span>{item.name}</span>
                      </div>
                      <div className="line-item-qty">{item.currentQty} Adet</div>
                      <div className="line-item-price">{formatPrice(item.lineTotal)}</div>
                    </div>
                  ))
                ) : (
                  <div className="summary-empty-notice">
                    Henüz takım modülü seçilmedi. Soldaki listeden ürün ekleyebilirsiniz.
                  </div>
                )}
              </div>

              {/* Summary Total */}
              <div className="summary-total-box">
                <div className="summary-total-label">Toplam Tutar:</div>
                <div className="summary-total-val">{formatPrice(calculatedTotal)}</div>
              </div>

              {/* Action Buttons */}
              <div className="summary-cta-stack">
                <a
                  href={customWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp summary-cta-btn"
                >
                  <WhatsAppIcon size={20} />
                  <span>WhatsApp ile Sipariş Ver</span>
                </a>
                <a href={`tel:${siteConfig.phoneRaw}`} className="btn-phone summary-cta-btn">
                  <Phone size={18} />
                  <span>Müşteri Temsilcisini Ara</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. ÜRÜN BİLGİSİ TABI */}
      {activeMainTab === 'urun-bilgisi' && (
        <div className="tab-pane-content">
          <div className="specs-full-card">
            <h3 className="pane-title">
              <Sparkles size={18} className="pane-icon" />
              Teknik Özellikler & Detaylar
            </h3>
            <div className="specs-table-grid">
              {product.details && Object.entries(product.details)
                .filter(([key]) => {
                  const lk = key.toLowerCase();
                  return !lk.includes('öne çıkan') && !lk.includes('soru') && !lk.includes('yorum');
                })
                .map(([key, val]) => (
                  <div key={key} className="spec-table-row">
                    <span className="spec-table-key">{key}</span>
                    <span className="spec-table-colon">:</span>
                    <span className="spec-table-val">
                      {Array.isArray(val) ? val.join(', ') : val}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. KAMPANYALAR TABI */}
      {activeMainTab === 'kampanyalar' && (
        <div className="tab-pane-content">
          <div className="campaigns-card">
            <h3 className="pane-title">
              <Tag size={18} className="pane-icon" />
              Mevcut Kampanyalar ve İndirimler
            </h3>
            <div className="campaign-list">
              <div className="campaign-item">
                <CheckCircle2 size={20} className="campaign-icon" />
                <div>
                  <div className="campaign-name">Peşin Fiyatına World'e Özel 9 Taksit</div>
                  <div className="campaign-desc">Yapı Kredi Worldcard ile yapacağınız ödemelerde vade farksız 9 taksit imkanı.</div>
                </div>
              </div>
              <div className="campaign-item">
                <CheckCircle2 size={20} className="campaign-icon" />
                <div>
                  <div className="campaign-name">Ücretsiz Adrese Teslim & Montaj</div>
                  <div className="campaign-desc">Yılmazlar Mobilya uzman montaj ekibi tarafından adresinize kadar ücretsiz kurulum hizmeti.</div>
                </div>
              </div>
              <div className="campaign-item">
                <CheckCircle2 size={20} className="campaign-icon" />
                <div>
                  <div className="campaign-name">3'lü Düğün Paketi Özel Fiyatı</div>
                  <div className="campaign-desc">Koltuk, Yemek Odası ve Yatak Odası takımlarını birlikte alımlarda ekstra paket indirimi.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. TESLİMAT VE KURULUM TABI */}
      {activeMainTab === 'teslimat' && (
        <div className="tab-pane-content">
          <div className="delivery-card">
            <h3 className="pane-title">
              <Truck size={18} className="pane-icon" />
              Teslimat ve Montaj Bilgileri
            </h3>
            <div className="delivery-steps">
              <div className="delivery-step-item">
                <div className="step-num">1</div>
                <div>
                  <div className="step-title">Güvenli ve Hızlı Lojistik</div>
                  <div className="step-desc">Siparişiniz İstikbal fabrikasından direkt teslim alınır ve özel mobilya nakliye araçlarımızla korunarak taşınır.</div>
                </div>
              </div>
              <div className="delivery-step-item">
                <div className="step-num">2</div>
                <div>
                  <div className="step-title">Ücretsiz Profesyonel Montaj</div>
                  <div className="step-desc">Yılmazlar Mobilya'nın deneyimli montaj ustaları mobilyalarınızı evinize çıkarır ve dilediğiniz odaya ücretsiz kurar.</div>
                </div>
              </div>
              <div className="delivery-step-item">
                <div className="step-num">3</div>
                <div>
                  <div className="step-title">2 Yıl Resmî Garanti</div>
                  <div className="step-desc">Tüm ürünlerimiz 2 yıl İstikbal fabrika garantisi kapsamındadır.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. TAKSİT SEÇENEKLERİ TABI */}
      {activeMainTab === 'taksit' && (
        <div className="tab-pane-content">
          <div className="installment-card">
            <h3 className="pane-title">
              <CreditCard size={18} className="pane-icon" />
              Taksit ve Ödeme Seçenekleri
            </h3>
            <table className="installment-table">
              <thead>
                <tr>
                  <th>Kart Türü</th>
                  <th>Taksit Sayısı</th>
                  <th>Aylık Tutar</th>
                  <th>Toplam Tutar</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Worldcard (Yapı Kredi / Vakıfbank)</td>
                  <td>9 Taksit (Peşin Fiyatına)</td>
                  <td>{formatPrice(calculatedTotal / 9)}</td>
                  <td><strong>{formatPrice(calculatedTotal)}</strong></td>
                </tr>
                <tr>
                  <td>Bonus (Garanti / TEB)</td>
                  <td>9 Taksit</td>
                  <td>{formatPrice((calculatedTotal * 1.1) / 9)}</td>
                  <td>{formatPrice(calculatedTotal * 1.1)}</td>
                </tr>
                <tr>
                  <td>Maximum (İş Bankası)</td>
                  <td>9 Taksit</td>
                  <td>{formatPrice((calculatedTotal * 1.1) / 9)}</td>
                  <td>{formatPrice(calculatedTotal * 1.1)}</td>
                </tr>
                <tr>
                  <td>Diğer Banka Kartları</td>
                  <td>Tek Çekim</td>
                  <td>{formatPrice(calculatedTotal)}</td>
                  <td>{formatPrice(calculatedTotal)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. SORU & CEVAP TABI */}
      {activeMainTab === 'soru-cevap' && (
        <div className="tab-pane-content">
          <div className="faq-card">
            <h3 className="pane-title">
              <HelpCircle size={18} className="pane-icon" />
              Sıkça Sorulan Sorular
            </h3>
            <div className="faq-list">
              <div className="faq-item">
                <div className="faq-q">Soru: Kumaş rengi ve ayak alternatifleri değiştirilebilir mi?</div>
                <div className="faq-a">Cevap: Evet, İstikbal'in zengin kumaş ve renk kartelasından mağazamızda veya WhatsApp üzerinden dilediğiniz renk ve ayak alternatifini seçebilirsiniz.</div>
              </div>
              <div className="faq-item">
                <div className="faq-q">Soru: Takımdan istediğim parçayı çıkarabilir veya ekleyebilir miyim?</div>
                <div className="faq-a">Cevap: Evet! "Takım İçeriği" sekmesinden istediğiniz modülün adetini artırabilir veya azaltabilirsiniz. Fiyat otomatik olarak güncellenir.</div>
              </div>
              <div className="faq-item">
                <div className="faq-q">Soru: Teslimat ve montaj için ücret alıyor musunuz?</div>
                <div className="faq-a">Cevap: Hayır, Yılmazlar Mobilya olarak tüm Ankara ve çevre ilçelere teslimat ve montajı tamamen ücretsiz olarak yapmaktayız.</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <section className="detail-similar-section">
          <div className="section-header" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
            <span className="section-tag">Kombin Önerileri</span>
            <h2 className="section-title">Benzer Ürünler</h2>
          </div>
          <div className="grid-3">
            {similarProducts.map((simProd) => (
              <ProductCard
                key={simProd.id}
                product={simProd}
                onSelectProduct={(p) => {
                  onSelectProduct(p);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            ))}
          </div>
        </section>
      )}

      {/* STYLES */}
      <style>{`
        .detail-page-container {
          padding-top: 1.25rem;
          padding-bottom: 3.5rem;
          width: 100%;
          max-width: 100%;
          overflow-x: hidden;
        }
        .detail-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--text-muted);
          margin-bottom: 1.25rem;
          padding: 0.35rem 0.75rem;
          border-radius: var(--radius-sm);
          background-color: var(--bg-card);
          border: 1px solid var(--border-subtle);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .detail-back-btn:hover {
          color: var(--accent-wood);
          border-color: var(--accent-wood);
        }

        /* HERO LAYOUT */
        .detail-hero-grid {
          display: grid;
          grid-template-columns: 1.15fr 1fr;
          gap: 2.5rem;
          margin-bottom: 2.5rem;
          width: 100%;
        }
        .detail-gallery-col {
          min-width: 0;
          width: 100%;
        }
        .detail-main-image {
          width: 100%;
          aspect-ratio: 4 / 3;
          border-radius: var(--radius-md);
          overflow: hidden;
          background-color: #F7F3ED;
          border: 1px solid var(--border-subtle);
          box-shadow: var(--shadow-sm);
          margin-bottom: 1rem;
          position: relative;
          user-select: none;
        }
        .detail-nav-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.85);
          color: var(--text-main);
          box-shadow: 0 4px 12px rgba(0,0,0,0.18);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          z-index: 5;
          backdrop-filter: blur(4px);
          cursor: pointer;
        }
        .detail-nav-arrow:hover {
          background: #FFF;
          color: var(--accent-wood);
          transform: translateY(-50%) scale(1.1);
        }
        .detail-arrow-left { left: 12px; }
        .detail-arrow-right { right: 12px; }
        .detail-image-counter {
          position: absolute;
          bottom: 10px;
          right: 10px;
          background: rgba(0,0,0,0.65);
          color: #FFF;
          backdrop-filter: blur(4px);
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 600;
          z-index: 4;
        }
        .detail-thumb-row {
          display: flex;
          gap: 0.6rem;
          overflow-x: auto;
          padding-bottom: 0.5rem;
        }
        .detail-thumb {
          width: 75px;
          height: 56px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          border: 1px solid var(--border-light);
          opacity: 0.6;
          transition: all 0.2s ease;
          flex-shrink: 0;
          cursor: pointer;
        }
        .detail-thumb-active {
          border: 2.5px solid var(--accent-wood);
          opacity: 1;
        }

        .detail-hero-info {
          display: flex;
          flex-direction: column;
          gap: 1.15rem;
          min-width: 0;
        }
        .detail-tags {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 0.5rem;
        }
        .detail-new-badge {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--accent-wood);
          background-color: var(--accent-amber-light);
          padding: 0.2rem 0.55rem;
          border-radius: var(--radius-full);
        }
        .detail-sku-badge {
          font-size: 0.75rem;
          color: var(--text-muted);
          background: #F1EFE9;
          padding: 0.2rem 0.55rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-subtle);
        }
        .detail-title {
          font-family: var(--font-serif);
          font-size: clamp(1.75rem, 2.5vw, 2.35rem);
          font-weight: 700;
          color: var(--text-main);
          line-height: 1.2;
          margin: 0;
        }
        .detail-price-box {
          background: #FCFAF6;
          padding: 1.15rem 1.25rem;
          border-radius: var(--radius-md);
          border: 1px solid rgba(140, 90, 60, 0.2);
          box-shadow: 0 2px 8px rgba(0,0,0,0.03);
        }
        .detail-price-main-row {
          display: flex;
          align-items: baseline;
          gap: 1rem;
          margin-bottom: 0.75rem;
        }
        .detail-price-label {
          font-size: 0.75rem;
          color: var(--accent-wood);
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .detail-price-value {
          font-size: 2.1rem;
          font-weight: 800;
          color: #1A1A1A;
          line-height: 1.1;
        }
        .detail-price-old {
          font-size: 1.1rem;
          color: var(--text-light);
          text-decoration: line-through;
        }
        .detail-installment-box {
          padding-top: 0.65rem;
          border-top: 1px dashed var(--border-subtle);
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .installment-tag {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.85rem;
          font-weight: 700;
          color: #1E40AF;
        }
        .installment-other {
          font-size: 0.82rem;
          color: var(--text-muted);
        }
        .detail-desc {
          font-size: 0.95rem;
          color: var(--text-muted);
          line-height: 1.55;
          margin: 0;
        }
        .detail-cta-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }
        .detail-cta-btn {
          padding: 0.85rem;
        }
        .detail-trust-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }
        .trust-item {
          background: #FAF8F4;
          border: 1px solid var(--border-light);
          padding: 0.85rem;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }
        .trust-icon {
          color: var(--accent-wood);
          flex-shrink: 0;
        }
        .trust-title {
          font-size: 0.85rem;
          font-weight: 800;
          color: var(--text-main);
        }
        .trust-desc {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        /* TOP TABS NAVIGATION */
        .detail-tabs-nav-wrapper {
          border-bottom: 2px solid #E5E2DB;
          margin-bottom: 2rem;
          margin-top: 1rem;
          overflow-x: auto;
        }
        .detail-tabs-nav {
          display: flex;
          gap: 0.5rem;
          white-space: nowrap;
          min-width: max-content;
        }
        .detail-tab-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.85rem 1.25rem;
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-muted);
          background: none;
          border: none;
          border-bottom: 3px solid transparent;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
          top: 2px;
        }
        .detail-tab-btn:hover {
          color: var(--accent-wood);
        }
        .detail-tab-btn.active {
          color: #0F172A;
          border-bottom: 3px solid #1E3A8A;
          background: rgba(30, 58, 138, 0.04);
          border-radius: var(--radius-sm) var(--radius-sm) 0 0;
        }
        .tab-count-bubble {
          font-size: 0.72rem;
          background: #1E3A8A;
          color: #FFF;
          padding: 0.1rem 0.45rem;
          border-radius: var(--radius-full);
          font-weight: 800;
        }

        /* CUSTOMIZER SPLIT LAYOUT (Screenshot 3) */
        .customizer-split-layout {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 2rem;
          align-items: start;
        }
        .customizer-modules-col {
          min-width: 0;
        }
        .customizer-section-title {
          margin-bottom: 1.25rem;
        }
        .customizer-section-title h3 {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--text-main);
          margin-bottom: 0.25rem;
        }
        .customizer-section-title p {
          font-size: 0.88rem;
          color: var(--text-muted);
          margin: 0;
        }

        .module-cards-list {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .module-card {
          background: #FFF;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 1.25rem;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
          transition: all 0.2s ease;
        }
        .module-card.in-set {
          border-color: #CBD5E1;
          box-shadow: 0 4px 12px rgba(0,0,0,0.06);
        }
        .module-card.not-in-set {
          opacity: 0.8;
          background: #FAFAFA;
        }
        .module-card-main {
          display: grid;
          grid-template-columns: 130px 1fr 180px;
          gap: 1.5rem;
          align-items: center;
        }
        .module-img-container {
          width: 130px;
          height: 110px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          background: #F4F1EA;
          border: 1px solid var(--border-light);
          flex-shrink: 0;
        }
        .module-img-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .module-info-container {
          min-width: 0;
        }
        .module-title-row {
          margin-bottom: 0.5rem;
        }
        .module-title {
          font-size: 1.05rem;
          font-weight: 800;
          color: var(--text-main);
          margin: 0 0 0.2rem 0;
        }
        .module-sku {
          font-size: 0.72rem;
          color: var(--text-light);
          font-family: monospace;
          background: #F3F1ED;
          padding: 0.15rem 0.4rem;
          border-radius: 3px;
        }
        .module-subtabs-header {
          display: flex;
          gap: 0.75rem;
          border-bottom: 1px solid #E5E7EB;
          margin-bottom: 0.5rem;
          padding-bottom: 0.25rem;
        }
        .module-subtab-link {
          background: none;
          border: none;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-muted);
          cursor: pointer;
          padding: 0.2rem 0;
          border-bottom: 2px solid transparent;
        }
        .module-subtab-link.active {
          color: #1E3A8A;
          border-bottom-color: #1E3A8A;
        }
        .module-props-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.25rem 0.75rem;
          font-size: 0.78rem;
        }
        .module-prop-item {
          display: flex;
          gap: 0.35rem;
          color: var(--text-muted);
        }
        .prop-k {
          font-weight: 600;
          color: #64748B;
        }
        .prop-v {
          font-weight: 700;
          color: #1E293B;
        }

        .module-action-col {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.85rem;
        }
        .module-price-block {
          text-align: right;
        }
        .module-price-val {
          font-size: 1.35rem;
          font-weight: 900;
          color: #0F172A;
          line-height: 1;
        }
        .module-price-old {
          font-size: 0.85rem;
          color: #94A3B8;
          text-decoration: line-through;
          margin-top: 0.2rem;
        }

        /* STEPPER BUTTONS */
        .quantity-stepper {
          display: inline-flex;
          align-items: center;
          border: 1px solid #CBD5E1;
          border-radius: var(--radius-full);
          background: #FFF;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .stepper-btn {
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #F8FAFC;
          border: none;
          cursor: pointer;
          color: #1E293B;
          transition: all 0.15s ease;
        }
        .stepper-btn:hover:not(:disabled) {
          background: #E2E8F0;
          color: #0F172A;
        }
        .stepper-btn:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }
        .stepper-qty {
          width: 36px;
          text-align: center;
          font-weight: 800;
          font-size: 0.95rem;
          color: #0F172A;
        }

        /* RIGHT STICKY TAKIM ÖZETİ */
        .customizer-summary-col {
          position: sticky;
          top: 1.5rem;
        }
        .sticky-summary-card {
          background: #FFFFFF;
          border: 1px solid #CBD5E1;
          border-radius: var(--radius-md);
          padding: 1.25rem;
          box-shadow: 0 4px 16px rgba(0,0,0,0.07);
        }
        .summary-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #E2E8F0;
          padding-bottom: 0.75rem;
          margin-bottom: 0.85rem;
        }
        .summary-title {
          font-size: 1.1rem;
          font-weight: 800;
          color: #0F172A;
          margin: 0;
        }
        .summary-badge {
          font-size: 0.75rem;
          font-weight: 800;
          background: #EFF6FF;
          color: #1E40AF;
          padding: 0.2rem 0.6rem;
          border-radius: var(--radius-full);
        }
        .summary-product-hero {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid #F1F5F9;
          margin-bottom: 0.85rem;
        }
        .summary-thumb {
          width: 52px;
          height: 42px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          background: #F1EFE9;
          flex-shrink: 0;
        }
        .summary-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .summary-prod-name {
          font-size: 0.92rem;
          font-weight: 800;
          color: #1E293B;
          line-height: 1.2;
        }
        .summary-prod-cat {
          font-size: 0.75rem;
          color: #64748B;
        }
        .summary-items-list {
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
          max-height: 280px;
          overflow-y: auto;
          margin-bottom: 1rem;
          padding-right: 0.2rem;
        }
        .summary-line-item {
          display: grid;
          grid-template-columns: 1fr 60px 85px;
          gap: 0.35rem;
          font-size: 0.82rem;
          align-items: center;
          padding-bottom: 0.4rem;
          border-bottom: 1px dashed #E2E8F0;
        }
        .line-item-name {
          font-weight: 600;
          color: #334155;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .line-item-qty {
          text-align: center;
          color: #64748B;
          font-weight: 700;
          font-size: 0.75rem;
        }
        .line-item-price {
          text-align: right;
          font-weight: 800;
          color: #0F172A;
        }
        .summary-empty-notice {
          font-size: 0.82rem;
          color: #94A3B8;
          text-align: center;
          padding: 1.5rem 0.5rem;
        }
        .summary-total-box {
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: var(--radius-sm);
          padding: 0.85rem 1rem;
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin-bottom: 1rem;
        }
        .summary-total-label {
          font-size: 0.88rem;
          font-weight: 800;
          color: #475569;
        }
        .summary-total-val {
          font-size: 1.45rem;
          font-weight: 900;
          color: #1E3A8A;
        }
        .summary-cta-stack {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        .summary-cta-btn {
          width: 100%;
          padding: 0.85rem;
          font-size: 0.9rem;
        }

        /* OTHER TAB CONTENT PANES */
        .tab-pane-content {
          margin-bottom: 3rem;
        }
        .pane-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: #0F172A;
          margin: 0 0 1.25rem 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          border-bottom: 1px solid #E2E8F0;
          padding-bottom: 0.6rem;
        }
        .pane-icon {
          color: var(--accent-wood);
        }
        .specs-full-card, .campaigns-card, .delivery-card, .installment-card, .faq-card {
          background: #FFF;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 1.75rem;
          box-shadow: var(--shadow-sm);
        }
        .specs-table-grid {
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
        }
        .spec-table-row {
          display: grid;
          grid-template-columns: 240px 20px 1fr;
          font-size: 0.9rem;
          padding-bottom: 0.45rem;
          border-bottom: 1px dashed #E2E8F0;
        }
        .spec-table-key {
          font-weight: 700;
          color: #475569;
        }
        .spec-table-colon {
          color: #94A3B8;
        }
        .spec-table-val {
          font-weight: 600;
          color: #0F172A;
        }

        .campaign-list, .faq-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .campaign-item {
          display: flex;
          gap: 0.75rem;
          padding: 1rem;
          background: #F8FAFC;
          border-radius: var(--radius-sm);
          border: 1px solid #E2E8F0;
        }
        .campaign-icon {
          color: #10B981;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .campaign-name {
          font-weight: 800;
          font-size: 0.95rem;
          color: #0F172A;
          margin-bottom: 0.2rem;
        }
        .campaign-desc {
          font-size: 0.85rem;
          color: #64748B;
        }

        .delivery-steps {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 1.25rem;
        }
        .delivery-step-item {
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: var(--radius-sm);
          padding: 1.25rem;
          display: flex;
          gap: 0.75rem;
        }
        .step-num {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #1E3A8A;
          color: #FFF;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
          flex-shrink: 0;
        }
        .step-title {
          font-weight: 800;
          font-size: 0.95rem;
          color: #0F172A;
          margin-bottom: 0.25rem;
        }
        .step-desc {
          font-size: 0.85rem;
          color: #64748B;
          line-height: 1.45;
        }

        .installment-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        .installment-table th {
          background: #F8FAFC;
          padding: 0.75rem 1rem;
          font-size: 0.85rem;
          font-weight: 800;
          color: #475569;
          border-bottom: 1px solid #CBD5E1;
        }
        .installment-table td {
          padding: 0.85rem 1rem;
          font-size: 0.9rem;
          border-bottom: 1px solid #F1F5F9;
        }

        .faq-item {
          padding: 1rem;
          background: #F8FAFC;
          border-radius: var(--radius-sm);
          border: 1px solid #E2E8F0;
        }
        .faq-q {
          font-weight: 800;
          font-size: 0.95rem;
          color: #0F172A;
          margin-bottom: 0.35rem;
        }
        .faq-a {
          font-size: 0.88rem;
          color: #475569;
          line-height: 1.45;
        }

        .detail-similar-section {
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 1px solid var(--border-light);
        }

        /* ========= MOBILE RESPONSIVE ========= */
        @media (max-width: 960px) {
          .detail-hero-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          .customizer-split-layout {
            grid-template-columns: 1fr;
          }
          .customizer-summary-col {
            position: static;
            order: -1;
            margin-bottom: 1rem;
          }
          .delivery-steps {
            grid-template-columns: 1fr;
          }
          .spec-table-row {
            grid-template-columns: 140px 15px 1fr;
            font-size: 0.82rem;
          }
        }

        @media (max-width: 640px) {
          .module-card-main {
            grid-template-columns: 90px 1fr;
            gap: 0.85rem;
          }
          .module-img-container {
            width: 90px;
            height: 80px;
          }
          .module-action-col {
            grid-column: 1 / -1;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            border-top: 1px dashed #E2E8F0;
            padding-top: 0.75rem;
            margin-top: 0.35rem;
          }
          .module-props-grid {
            grid-template-columns: 1fr;
          }
          .detail-cta-grid {
            grid-template-columns: 1fr;
          }
          .detail-trust-grid {
            grid-template-columns: 1fr;
          }
          .detail-title {
            font-size: 1.4rem;
          }
          .detail-price-value {
            font-size: 1.7rem;
          }
        }
      `}</style>
    </div>
  );
}
