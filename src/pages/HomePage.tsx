import React, { useState } from 'react';
import { Product, Vendor, CampusService, UniversityId, ProductCategory } from '../types';
import { UNIVERSITIES } from '../data/mockData';
import { ProductCard } from '../components/common/ProductCard';
import { VendorCard } from '../components/common/VendorCard';
import { ServiceCard } from '../components/common/ServiceCard';
import { 
  Search, 
  ArrowRight, 
  Store, 
  Sparkles, 
  Laptop, 
  Shirt, 
  UtensilsCrossed, 
  BookOpen, 
  Watch, 
  GraduationCap, 
  Wrench,
  ChevronRight
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
  featuredProducts: Product[];
  popularVendors: Vendor[];
  campusServices: CampusService[];
  onSelectProduct: (product: Product) => void;
  onSelectVendor: (vendorId: string) => void;
  onRequestService: (service: CampusService) => void;
  currentUniversityId: UniversityId | 'all';
  onSelectUniversity: (id: UniversityId | 'all') => void;
}

const CATEGORIES_LIST: { name: ProductCategory; icon: React.ElementType; desc: string }[] = [
  { name: 'Electronics', icon: Laptop, desc: 'Laptops, chargers & audio' },
  { name: 'Fashion', icon: Shirt, desc: 'Hoodies, thrift & streetwear' },
  { name: 'Food', icon: UtensilsCrossed, desc: 'Jollof, snacks & drinks' },
  { name: 'Books', icon: BookOpen, desc: 'Course packs & textbooks' },
  { name: 'Beauty', icon: Sparkles, desc: 'Shea butter, scents & grooming' },
  { name: 'Accessories', icon: Watch, desc: 'Watches, bags & flasks' },
  { name: 'School Supplies', icon: GraduationCap, desc: 'Calculators, lamps & pads' },
  { name: 'Services', icon: Wrench, desc: 'Printing, repairs & laundry' },
];

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  featuredProducts,
  popularVendors,
  campusServices,
  onSelectProduct,
  onSelectVendor,
  onRequestService,
  currentUniversityId,
  onSelectUniversity
}) => {
  const [searchInput, setSearchInput] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onNavigate('products', { search: searchInput.trim() });
    } else {
      onNavigate('products');
    }
  };

  const activeUniversity = UNIVERSITIES.find(u => u.id === currentUniversityId);

  return (
    <div className="space-y-16 sm:space-y-24">
      
      {/* 1. HERO SECTION (Black & Orange) */}
      <section className="relative overflow-hidden bg-black text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-4 shadow-2xl border border-zinc-800">
        {/* Glowing Orange Orbs */}
        <div className="absolute inset-0 opacity-25 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-orange-600 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-amber-600 blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-16 sm:py-24 text-center">
          {/* Subtle Campus Context Marker */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-950/60 border border-orange-500/40 text-orange-400 text-xs font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
            <span>Ghana's Dedicated University Marketplace</span>
            {activeUniversity && (
              <>
                <span className="text-orange-500">·</span>
                <span className="text-white font-semibold">{activeUniversity.shortName}</span>
              </>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-brand text-white leading-tight sm:leading-none max-w-4xl mx-auto">
            Everything You Need, <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500">
              Right on Campus.
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            Discover verified student vendors, dorm essentials, tech accessories, and trusted campus services delivered straight to your hall room or faculty.
          </p>

          {/* Hero Search Bar */}
          <form onSubmit={handleSearchSubmit} className="mt-8 max-w-2xl mx-auto">
            <div className="relative flex items-center bg-white dark:bg-zinc-900 rounded-2xl p-1.5 shadow-2xl border border-zinc-200 dark:border-zinc-800">
              <Search className="w-5 h-5 text-zinc-400 ml-3.5 shrink-0" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search calculators, power banks, hoodies, jollof, printing..."
                className="w-full py-3 px-3 text-zinc-900 dark:text-white bg-transparent text-sm focus:outline-none placeholder-zinc-400"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-black font-bold text-xs sm:text-sm rounded-xl transition-colors shrink-0 shadow-sm"
              >
                Search Market
              </button>
            </div>
            <div className="flex items-center justify-center gap-2 mt-3 text-xs text-zinc-400">
              <span>Popular:</span>
              <button type="button" onClick={() => onNavigate('products', { search: 'power bank' })} className="hover:text-orange-400 underline decoration-zinc-700">Power banks</button>
              <span>·</span>
              <button type="button" onClick={() => onNavigate('products', { search: 'calculator' })} className="hover:text-orange-400 underline decoration-zinc-700">Casio fx-991</button>
              <span>·</span>
              <button type="button" onClick={() => onNavigate('products', { search: 'jollof' })} className="hover:text-orange-400 underline decoration-zinc-700">Jollof</button>
              <span>·</span>
              <button type="button" onClick={() => onNavigate('products', { search: 'hoodie' })} className="hover:text-orange-400 underline decoration-zinc-700">Kente Hoodies</button>
            </div>
          </form>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('products')}
              className="px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-bold text-sm transition-all shadow-md flex items-center gap-2 group"
            >
              <span>Shop All Products</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={() => onNavigate('auth', { mode: 'vendor' })}
              className="px-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700 font-semibold text-sm transition-all flex items-center gap-2"
            >
              <Store className="w-4 h-4 text-orange-400" />
              <span>Become a Vendor</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. UNIVERSITY SELECTOR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white font-brand">
              Select Your University
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Filter products, vendors, and delivery to your specific campus and halls.
            </p>
          </div>
          <button
            onClick={() => onNavigate('universities')}
            className="text-xs sm:text-sm font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-500 flex items-center gap-1 group self-start sm:self-auto"
          >
            <span>View All Campuses</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          <button
            onClick={() => onSelectUniversity('all')}
            className={`p-3.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${
              currentUniversityId === 'all'
                ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/40 text-orange-950 dark:text-orange-300 font-bold shadow-xs'
                : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-700 dark:text-zinc-300'
            }`}
          >
            <span className="w-9 h-9 rounded-lg bg-black text-orange-400 border border-zinc-800 flex items-center justify-center font-bold text-xs mb-1.5 font-brand">
              ALL
            </span>
            <span className="text-xs font-semibold truncate w-full">All Campuses</span>
            <span className="text-[10px] text-zinc-400">Ghana Wide</span>
          </button>

          {UNIVERSITIES.map(u => {
            const isSelected = currentUniversityId === u.id;
            return (
              <button
                key={u.id}
                onClick={() => onSelectUniversity(u.id)}
                className={`p-3.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${
                  isSelected
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/40 text-orange-950 dark:text-orange-300 font-bold shadow-xs'
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-700 dark:text-zinc-300'
                }`}
              >
                <span className="w-9 h-9 rounded-lg bg-black text-orange-400 border border-zinc-800 flex items-center justify-center font-bold text-xs mb-1.5 font-brand">
                  {u.iconInitials}
                </span>
                <span className="text-xs font-semibold truncate w-full">{u.shortName}</span>
                <span className="text-[10px] text-zinc-400 truncate w-full">{u.location.split(',')[0]}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. POPULAR CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white font-brand">
              Popular Categories
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Quickly browse university student essentials.
            </p>
          </div>
          <button
            onClick={() => onNavigate('products')}
            className="text-xs sm:text-sm font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-500 flex items-center gap-1 group"
          >
            <span>All Categories</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {CATEGORIES_LIST.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.name}
                onClick={() => {
                  if (cat.name === 'Services') {
                    onNavigate('services');
                  } else {
                    onNavigate('products', { category: cat.name });
                  }
                }}
                className="group p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/90 dark:border-zinc-800 hover:border-orange-500/50 hover:shadow-xs transition-all text-center flex flex-col items-center justify-center"
              >
                <div className="w-12 h-12 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 flex items-center justify-center mb-2.5 group-hover:bg-orange-50 dark:group-hover:bg-orange-950/40 group-hover:border-orange-300 transition-colors">
                  <Icon className="w-5 h-5 text-zinc-700 dark:text-zinc-300 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors" />
                </div>
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1">{cat.name}</span>
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5 line-clamp-1">{cat.desc}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-1">
              Top Student Picks
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white font-brand">
              Featured Campus Products
            </h2>
          </div>
          <button
            onClick={() => onNavigate('products')}
            className="text-xs sm:text-sm font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-500 flex items-center gap-1 group"
          >
            <span>Browse All ({featuredProducts.length}+)</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.slice(0, 4).map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
              onVendorClick={onSelectVendor}
            />
          ))}
        </div>
      </section>

      {/* 5. POPULAR VENDORS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-1">
              Verified Student Merchants
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white font-brand">
              Popular Campus Vendors
            </h2>
          </div>
          <button
            onClick={() => onNavigate('vendors')}
            className="text-xs sm:text-sm font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-500 flex items-center gap-1 group"
          >
            <span>View All Vendors</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularVendors.slice(0, 3).map(vendor => (
            <VendorCard
              key={vendor.id}
              vendor={vendor}
              onSelect={onSelectVendor}
            />
          ))}
        </div>
      </section>

      {/* 6. CAMPUS SERVICES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-1">
              Study & Life Support
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white font-brand">
              Campus Services
            </h2>
          </div>
          <button
            onClick={() => onNavigate('services')}
            className="text-xs sm:text-sm font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-500 flex items-center gap-1 group"
          >
            <span>Explore All Services</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {campusServices.slice(0, 3).map(service => (
            <ServiceCard
              key={service.id}
              service={service}
              onRequestBooking={onRequestService}
            />
          ))}
        </div>
      </section>

      {/* 7. HOW CAMPUSBUY WORKS */}
      <section className="bg-zinc-100 dark:bg-zinc-950 py-16 border-y border-zinc-200 dark:border-zinc-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white font-brand">
              How CampusBuy Works
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
              Designed around Ghanaian university routines for simple, secure student trading.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200/90 dark:border-zinc-800 shadow-xs relative">
              <span className="text-3xl font-bold text-orange-500 font-mono tabular-nums mb-3 block">01</span>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">Select Your University</h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
                Filter stores and services near your halls — whether you are at KNUST Ayeduase, Legon Pentagon, or UCC Casford.
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200/90 dark:border-zinc-800 shadow-xs relative">
              <span className="text-3xl font-bold text-orange-500 font-mono tabular-nums mb-3 block">02</span>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">Order or Message Vendor</h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
                Add products to cart or contact verified student vendors directly via WhatsApp and direct call for custom requests.
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200/90 dark:border-zinc-800 shadow-xs relative">
              <span className="text-3xl font-bold text-orange-500 font-mono tabular-nums mb-3 block">03</span>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">Room Delivery & Safe Pay</h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
                Meet up at your hall porter lodge or room door. Inspect your items, then pay conveniently with Mobile Money (MTN/Telecel) or cash.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. CALL TO ACTION FOR VENDORS (Black & Orange) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-black via-zinc-950 to-orange-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border border-orange-900/40">
          <div className="max-w-xl space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-950/80 border border-orange-500/40 text-orange-400 text-xs font-medium">
              <Store className="w-3.5 h-3.5" />
              <span>Dokan Multivendor Ready</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-brand leading-tight">
              Are you a student seller or campus business?
            </h2>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Open your free online storefront on CampusBuy. Reach thousands of students across Ghanaian universities with dedicated order tracking, hostel delivery management, and real reviews.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => onNavigate('auth', { mode: 'vendor' })}
              className="px-6 py-3.5 bg-orange-500 hover:bg-orange-400 text-black rounded-xl font-bold text-sm transition-all shadow-md"
            >
              Start Selling Today
            </button>
            <button
              onClick={() => onNavigate('about')}
              className="px-5 py-3.5 bg-zinc-900/80 hover:bg-zinc-800 text-white rounded-xl font-semibold text-xs transition-all border border-zinc-700"
            >
              Learn Vendor Benefits
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
