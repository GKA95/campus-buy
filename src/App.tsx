import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { api } from './services/api';
import { Product, Vendor, CampusService, UniversityId, ProductCategory } from './types';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { Modal } from './components/common/Modal';
import { ErrorBoundary } from './components/common/ErrorBoundary';

// Pages
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { VendorsPage } from './pages/VendorsPage';
import { VendorStorePage } from './pages/VendorStorePage';
import { UniversitiesPage } from './pages/UniversitiesPage';
import { ServicesPage } from './pages/ServicesPage';
import { AboutPage } from './pages/AboutPage';
import { CartPage } from './pages/CartPage';
import { AuthPage } from './pages/AuthPage';
import { StudentDashboardPage } from './pages/StudentDashboardPage';
import { VendorDashboardPage } from './pages/VendorDashboardPage';

import { Search, CheckCircle2, X } from 'lucide-react';

const MainContent: React.FC = () => {
  const { currentUniversityId, setCurrentUniversityId, user } = useAuth();
  const { toastMessage, dismissToast } = useCart();

  // Navigation State
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [pageParams, setPageParams] = useState<Record<string, string>>({});
  
  // Selected Data for Details views
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [selectedVendorProducts, setSelectedVendorProducts] = useState<Product[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  // Global Datasets loaded from API abstraction
  const [products, setProducts] = useState<Product[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [services, setServices] = useState<CampusService[]>([]);
  const [loading, setLoading] = useState(true);

  // Global Quick Search Dialog
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');

  // Initial Load from API service
  useEffect(() => {
    async function loadData() {
      try {
        const [prodList, vendList, srvList] = await Promise.all([
          api.getProducts(),
          api.getVendors(),
          api.getServices()
        ]);
        setProducts(prodList);
        setVendors(vendList);
        setServices(srvList);
      } catch (err) {
        console.error('Failed to load initial marketplace data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Sync related products when selected product changes
  useEffect(() => {
    if (selectedProduct) {
      api.getRelatedProducts(selectedProduct.id, selectedProduct.category).then(setRelatedProducts);
    }
  }, [selectedProduct]);

  // Sync vendor products when selected vendor changes
  useEffect(() => {
    if (selectedVendor) {
      api.getProducts({ vendorId: selectedVendor.id }).then(setSelectedVendorProducts);
    }
  }, [selectedVendor]);

  // Navigation Handler
  const handleNavigate = (page: string, params: Record<string, string> = {}) => {
    setCurrentPage(page);
    setPageParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    handleNavigate('product-detail');
  };

  const handleSelectVendor = async (vendorId: string) => {
    const v = await api.getVendorById(vendorId);
    if (v) {
      setSelectedVendor(v);
      handleNavigate('vendor-store');
    }
  };

  const handleGlobalSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (globalSearchTerm.trim()) {
      setIsSearchModalOpen(false);
      handleNavigate('products', { search: globalSearchTerm.trim() });
      setGlobalSearchTerm('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-black text-zinc-950 dark:text-zinc-100 transition-colors">
      
      {/* Top Banner (Black with Orange highlight) */}
      <div className="bg-zinc-950 text-zinc-300 dark:bg-black dark:text-zinc-400 text-xs py-1.5 px-4 text-center border-b border-zinc-800 flex items-center justify-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0"></span>
        <span>CampusBuy Ghana: Verified university marketplace for KNUST, UG, UCC, UPSA, UDS, UEW & Ashesi.</span>
      </div>

      {/* Main Navigation Bar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenSearch={() => setIsSearchModalOpen(true)}
      />

      {/* Cart Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-zinc-950 dark:bg-zinc-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-zinc-800 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-orange-500 shrink-0" />
          <span className="text-xs sm:text-sm font-medium">{toastMessage}</span>
          <button
            onClick={dismissToast}
            className="text-zinc-400 hover:text-white ml-2 p-1 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Routed Page Content */}
      <div className="flex-1">
        {loading ? (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping"></span>
              <span>Loading CampusBuy marketplace...</span>
            </div>
          </div>
        ) : (
          <>
            {currentPage === 'home' && (
              <HomePage
                onNavigate={handleNavigate}
                featuredProducts={products.filter(p => p.featured)}
                popularVendors={vendors}
                campusServices={services}
                onSelectProduct={handleSelectProduct}
                onSelectVendor={handleSelectVendor}
                onRequestService={(service) => {
                  handleNavigate('services');
                }}
                currentUniversityId={currentUniversityId}
                onSelectUniversity={(id) => setCurrentUniversityId(id)}
              />
            )}

            {currentPage === 'products' && (
              <ProductsPage
                products={products}
                onSelectProduct={handleSelectProduct}
                onSelectVendor={handleSelectVendor}
                initialCategory={(pageParams.category as ProductCategory) || 'All'}
                initialSearch={pageParams.search || ''}
                initialUniversityId={currentUniversityId}
              />
            )}

            {currentPage === 'product-detail' && (
              selectedProduct ? (
                <ProductDetailPage
                  product={selectedProduct}
                  relatedProducts={relatedProducts}
                  onBack={() => handleNavigate('products')}
                  onSelectProduct={handleSelectProduct}
                  onSelectVendor={handleSelectVendor}
                  onProceedToCheckout={() => handleNavigate('cart', { checkout: 'true' })}
                />
              ) : (
                <div className="max-w-md mx-auto py-24 px-4 text-center space-y-4">
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">No product selected.</p>
                  <button
                    onClick={() => handleNavigate('products')}
                    className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold rounded-xl transition-colors"
                  >
                    Browse Campus Products
                  </button>
                </div>
              )
            )}

            {currentPage === 'vendors' && (
              <VendorsPage
                vendors={vendors}
                onSelectVendor={handleSelectVendor}
                initialUniversityId={currentUniversityId}
              />
            )}

            {currentPage === 'vendor-store' && (
              selectedVendor ? (
                <VendorStorePage
                  vendor={selectedVendor}
                  vendorProducts={selectedVendorProducts}
                  onBack={() => handleNavigate('vendors')}
                  onSelectProduct={handleSelectProduct}
                />
              ) : (
                <div className="max-w-md mx-auto py-24 px-4 text-center space-y-4">
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">No vendor selected.</p>
                  <button
                    onClick={() => handleNavigate('vendors')}
                    className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold rounded-xl transition-colors"
                  >
                    Explore Campus Vendors
                  </button>
                </div>
              )
            )}

            {currentPage === 'universities' && (
              <UniversitiesPage
                currentUniversityId={currentUniversityId}
                onSelectUniversity={(id) => setCurrentUniversityId(id)}
                onExploreCampus={(id) => {
                  setCurrentUniversityId(id);
                  handleNavigate('products');
                }}
              />
            )}

            {currentPage === 'services' && (
              <ServicesPage
                services={services}
                initialUniversityId={currentUniversityId}
              />
            )}

            {currentPage === 'about' && (
              <AboutPage
                onNavigate={handleNavigate}
              />
            )}

            {currentPage === 'cart' && (
              <CartPage
                onNavigate={handleNavigate}
                onSelectProduct={handleSelectProduct}
                checkoutOpenInitially={pageParams.checkout === 'true'}
              />
            )}

            {currentPage === 'auth' && (
              <AuthPage
                initialMode={(pageParams.mode as any) || 'login'}
                onNavigate={handleNavigate}
              />
            )}

            {currentPage === 'student-dashboard' && (
              <StudentDashboardPage
                onNavigate={handleNavigate}
                onSelectProduct={handleSelectProduct}
                onSelectVendor={handleSelectVendor}
              />
            )}

            {currentPage === 'vendor-dashboard' && (
              <VendorDashboardPage
                onNavigate={handleNavigate}
                onSelectProduct={handleSelectProduct}
              />
            )}
          </>
        )}
      </div>

      {/* Global Quick Search Modal */}
      <Modal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        title="Search CampusBuy"
      >
        <form onSubmit={handleGlobalSearchSubmit} className="space-y-4">
          <div className="relative">
            <Search className="w-5 h-5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              autoFocus
              value={globalSearchTerm}
              onChange={(e) => setGlobalSearchTerm(e.target.value)}
              placeholder="Search products, campus stores, course materials..."
              className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsSearchModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-500 rounded-lg shadow-xs"
            >
              Search
            </button>
          </div>
        </form>
      </Modal>

      {/* Site Footer */}
      <Footer
        onNavigate={handleNavigate}
        onSelectUniversity={(id) => setCurrentUniversityId(id)}
      />

    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <MainContent />
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
