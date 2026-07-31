import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { StickyContactBar } from './components/StickyContactBar';

// Pages
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { NewProductsPage } from './pages/NewProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';

// Import catalog data & metadata
import initialProductsData from '../data/products.json';
import lastUpdateData from '../data/last_update.json';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [products] = useState(initialProductsData || []);
  const [lastUpdateInfo] = useState(lastUpdateData || null);

  // Helper to parse current hash into state
  const syncStateFromHash = () => {
    const hash = window.location.hash.replace('#', '');
    
    if (!hash || hash === 'home') {
      setActivePage('home');
      setSelectedProduct(null);
    } else if (hash === 'products') {
      setActivePage('products');
      setSelectedProduct(null);
    } else if (hash === 'categories') {
      setActivePage('categories');
      setSelectedProduct(null);
    } else if (hash === 'new') {
      setActivePage('new');
      setSelectedProduct(null);
    } else if (hash === 'about') {
      setActivePage('about');
      setSelectedProduct(null);
    } else if (hash === 'contact') {
      setActivePage('contact');
      setSelectedProduct(null);
    } else if (hash.startsWith('product-')) {
      const prodId = hash.replace('product-', '');
      const foundProduct = products.find(p => String(p.id) === String(prodId));
      if (foundProduct) {
        setSelectedProduct(foundProduct);
        setActivePage('detail');
      } else {
        setActivePage('products');
        setSelectedProduct(null);
      }
    } else {
      setActivePage('home');
      setSelectedProduct(null);
    }
  };

  // Sync state on initial mount & back/forward popstate
  useEffect(() => {
    syncStateFromHash();

    const handleHashChange = () => {
      syncStateFromHash();
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, [products]);

  // Handle page navigation with hash update
  const navigateToPage = (pageId, product = null) => {
    if (pageId === 'detail' && product) {
      setSelectedProduct(product);
      setActivePage('detail');
      window.location.hash = `product-${product.id}`;
    } else {
      setSelectedProduct(null);
      setActivePage(pageId);
      window.location.hash = pageId === 'home' ? '' : pageId;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (product) => {
    navigateToPage('detail', product);
  };

  const handleBackToProducts = () => {
    navigateToPage('products');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar 
        activePage={activePage} 
        setActivePage={(page) => navigateToPage(page)} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <main className="main-content">
        {activePage === 'home' && (
          <HomePage 
            products={products} 
            onSelectProduct={handleSelectProduct}
            setActivePage={(page) => navigateToPage(page)}
            setSelectedCategory={setSelectedCategory}
          />
        )}

        {activePage === 'products' && (
          <ProductsPage 
            products={products}
            onSelectProduct={handleSelectProduct}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        )}

        {activePage === 'categories' && (
          <CategoriesPage 
            products={products}
            setSelectedCategory={setSelectedCategory}
            setActivePage={(page) => navigateToPage(page)}
          />
        )}

        {activePage === 'new' && (
          <NewProductsPage 
            products={products}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {activePage === 'detail' && selectedProduct && (
          <ProductDetailPage 
            product={selectedProduct}
            allProducts={products}
            onSelectProduct={handleSelectProduct}
            onBack={handleBackToProducts}
          />
        )}

        {activePage === 'about' && <AboutPage />}

        {activePage === 'contact' && <ContactPage />}
      </main>

      <StickyContactBar />

      <Footer 
        setActivePage={(page) => navigateToPage(page)}
        lastUpdateInfo={lastUpdateInfo}
      />
    </div>
  );
}
