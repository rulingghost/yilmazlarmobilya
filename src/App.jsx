import React, { useState } from 'react';
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

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setActivePage('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToProducts = () => {
    setSelectedProduct(null);
    setActivePage('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar 
        activePage={activePage} 
        setActivePage={(page) => {
          setActivePage(page);
          if (page !== 'detail') setSelectedProduct(null);
        }} 
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
            setActivePage={setActivePage}
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
            setActivePage={setActivePage}
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
        setActivePage={(page) => {
          setActivePage(page);
          if (page !== 'detail') setSelectedProduct(null);
        }}
        lastUpdateInfo={lastUpdateInfo}
      />
    </div>
  );
}
