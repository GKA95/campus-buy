import React, { useState, useMemo } from 'react';
import { Product, ProductCategory, UniversityId } from '../types';
import { UNIVERSITIES } from '../data/mockData';
import { ProductCard } from '../components/common/ProductCard';
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface ProductsPageProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onSelectVendor: (vendorId: string) => void;
  initialCategory?: ProductCategory | 'All';
  initialSearch?: string;
  initialUniversityId?: UniversityId | 'all';
}

const CATEGORIES: (ProductCategory | 'All')[] = [
  'All',
  'Electronics',
  'Fashion',
  'Food',
  'Books',
  'Beauty',
  'Accessories',
  'School Supplies',
  'Services'
];

export const ProductsPage: React.FC<ProductsPageProps> = ({
  products,
  onSelectProduct,
  onSelectVendor,
  initialCategory = 'All',
  initialSearch = '',
  initialUniversityId = 'all'
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All'>(initialCategory);
  const [selectedUniversity, setSelectedUniversity] = useState<UniversityId | 'all'>(initialUniversityId);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [maxPrice, setMaxPrice] = useState<number>(4000);
  const [conditionFilter, setConditionFilter] = useState<string>('All');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    return products.filter((p: Product) => {
      // Category
      if (selectedCategory !== 'All' && p.category !== selectedCategory) {
        return false;
      }
      // University
      if (selectedUniversity !== 'all' && p.universityId !== selectedUniversity) {
        return false;
      }
      // Price
      if (p.price > maxPrice) {
        return false;
      }
      // Condition
      if (conditionFilter !== 'All' && p.condition !== conditionFilter) {
        return false;
      }
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesVendor = p.vendorName.toLowerCase().includes(q);
        const matchesTags = p.tags.some((t: string) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesVendor && !matchesTags) {
          return false;
        }
      }
      return true;
    }).sort((a: Product, b: Product) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [products, selectedCategory, selectedUniversity, maxPrice, conditionFilter, searchQuery, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedUniversity('all');
    setSearchQuery('');
    setMaxPrice(4000);
    setConditionFilter('All');
    setSortBy('featured');
  };

  const hasActiveFilters = 
    selectedCategory !== 'All' || 
    selectedUniversity !== 'all' || 
    searchQuery !== '' || 
    maxPrice < 4000 || 
    conditionFilter !== 'All';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white font-brand">
          Campus Marketplace Products
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Explore items available for immediate pickup or delivery across Ghanaian university dorms and hostels.
        </p>

        {/* Search bar inside Products view */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, brands, models, or campus vendors..."
              className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-semibold text-zinc-700 dark:text-zinc-300"
          >
            <SlidersHorizontal className="w-4 h-4 text-orange-500" />
            <span>Filters {hasActiveFilters && '(Active)'}</span>
          </button>
        </div>
      </div>

      {/* Main Layout: Filters Sidebar + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Filters Sidebar */}
        <aside className={`lg:block ${mobileFilterOpen ? 'block' : 'hidden'} space-y-6`}>
          <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-6 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="font-bold text-zinc-900 dark:text-white text-sm flex items-center gap-1.5 font-brand">
                <SlidersHorizontal className="w-4 h-4 text-orange-500" />
                <span>Filter Products</span>
              </h3>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-orange-600 dark:text-orange-400 hover:text-orange-500 flex items-center gap-1 font-medium"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* University Filter */}
            <div>
              <label className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider block mb-2">
                University Campus
              </label>
              <select
                value={selectedUniversity}
                onChange={(e) => setSelectedUniversity(e.target.value as UniversityId | 'all')}
                className="w-full text-xs font-medium rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-zinc-800 dark:text-white focus:outline-none focus:border-orange-500"
              >
                <option value="all">All Ghanaian Campuses</option>
                {UNIVERSITIES.map(u => (
                  <option key={u.id} value={u.id}>{u.shortName} ({u.location.split(',')[0]})</option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider block mb-2">
                Category
              </label>
              <div className="space-y-1">
                {CATEGORIES.map(cat => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                        isSelected
                          ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 font-bold border border-orange-200 dark:border-orange-800/60'
                          : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                      }`}
                    >
                      <span>{cat}</span>
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Range Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-2">
                <span>Max Price:</span>
                <span className="font-mono text-orange-600 dark:text-orange-400 font-bold">GH₵ {maxPrice.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="30"
                max="4000"
                step="20"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-orange-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-400 dark:text-zinc-500 mt-1 font-mono">
                <span>GH₵ 30</span>
                <span>GH₵ 4,000</span>
              </div>
            </div>

            {/* Condition Filter */}
            <div>
              <label className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider block mb-2">
                Item Condition
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {['All', 'Brand New', 'Gently Used', 'Refurbished', 'Handmade'].map(cond => (
                  <button
                    key={cond}
                    onClick={() => setConditionFilter(cond)}
                    className={`px-2 py-1.5 text-[11px] rounded-lg border text-center transition-colors truncate ${
                      conditionFilter === cond
                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 font-semibold'
                        : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                    }`}
                  >
                    {cond}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Products Grid Content */}
        <main className="lg:col-span-3 space-y-6">
          
          {/* Top Result Bar & Sort dropdown */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-zinc-900 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs">
            <div className="text-zinc-600 dark:text-zinc-300">
              Showing <span className="font-bold text-zinc-900 dark:text-white font-mono tabular-nums">{filteredProducts.length}</span> products
              {selectedUniversity !== 'all' && (
                <span> for <strong className="text-orange-500">{UNIVERSITIES.find(u => u.id === selectedUniversity)?.shortName}</strong></span>
              )}
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className="text-zinc-500 dark:text-zinc-400 text-xs whitespace-nowrap">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs font-medium rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 px-2.5 py-1.5 text-zinc-800 dark:text-white focus:outline-none"
              >
                <option value="featured">Featured / Best Picks</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product: Product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={onSelectProduct}
                  onVendorClick={onSelectVendor}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 mx-auto flex items-center justify-center text-zinc-400">
                <Sparkles className="w-7 h-7 text-orange-400" />
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white font-brand">No products found</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
                No items match your selected filters. Try clearing your search query or expanding the price range.
              </p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </main>
      </div>

    </div>
  );
};
