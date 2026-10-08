import React, { useState } from 'react';
import { Vendor, Product } from '../types';
import { ProductCard } from '../components/common/ProductCard';
import { Modal } from '../components/common/Modal';
import { useAuth } from '../context/AuthContext';
import { REVIEWS } from '../data/mockData';
import { 
  Star, 
  MapPin, 
  Phone, 
  MessageCircle, 
  ShieldCheck, 
  ArrowLeft, 
  Clock, 
  Package, 
  Heart,
  Share2
} from 'lucide-react';

interface VendorStorePageProps {
  vendor: Vendor;
  vendorProducts: Product[];
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
}

export const VendorStorePage: React.FC<VendorStorePageProps> = ({
  vendor,
  vendorProducts,
  onBack,
  onSelectProduct
}) => {
  const { isVendorSaved, toggleSaveVendor } = useAuth();
  const [activeTab, setActiveTab] = useState<'products' | 'reviews' | 'about'>('products');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const saved = isVendorSaved(vendor.id);

  // Categories present in this vendor's catalog
  const vendorCategories = ['All', ...Array.from(new Set(vendorProducts.map(p => p.category)))];

  const displayedProducts = selectedCategory === 'All'
    ? vendorProducts
    : vendorProducts.filter(p => p.category === selectedCategory);

  const handleShare = () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(window.location.href).catch(() => {});
      }
    } catch {
      // Ignore if clipboard access is blocked in sandbox iframe
    }
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Vendors</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-1 text-xs text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 rounded-lg shadow-2xs"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{copiedLink ? 'Link Copied!' : 'Share Store'}</span>
        </button>
      </div>

      {/* Storefront Header & Hero Banner */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
        {/* Banner with gradient/artwork */}
        <div 
          className="h-36 sm:h-48 w-full relative p-6 flex items-start justify-end"
          style={{ background: vendor.banner || 'linear-gradient(135deg, #09090b 0%, #ea580c 100%)' }}
        >
          <span className="text-[11px] font-bold text-white/90 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-md border border-white/10">
            Dokan Merchant Verified
          </span>
        </div>

        {/* Store Profile Info */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-16 mb-4">
            
            {/* Avatar & Title */}
            <div className="flex items-end gap-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-black text-orange-500 border-4 border-white dark:border-zinc-900 shadow-lg flex items-center justify-center font-bold text-2xl font-brand shrink-0">
                {vendor.avatar}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white font-brand">
                    {vendor.name}
                  </h1>
                  {vendor.verified && (
                    <span title="Verified Campus Seller">
                      <ShieldCheck className="w-5 h-5 text-orange-500 shrink-0" />
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  <span className="font-semibold text-orange-600 dark:text-orange-400">{vendor.universityName}</span>
                  <span>·</span>
                  <span>{vendor.category}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleSaveVendor(vendor.id)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-colors ${
                  saved 
                    ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900 text-rose-600' 
                    : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${saved ? 'fill-rose-500' : ''}`} />
                <span>{saved ? 'Saved' : 'Save Store'}</span>
              </button>

              <button
                onClick={() => setContactModalOpen(true)}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-black rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Contact Vendor</span>
              </button>
            </div>
          </div>

          {/* Description & Metadata Stats */}
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 max-w-2xl leading-relaxed mt-2">
            {vendor.bio}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800 text-xs">
            <div>
              <span className="text-zinc-400 dark:text-zinc-500 block text-[11px]">Rating</span>
              <div className="flex items-center gap-1 font-bold text-zinc-900 dark:text-white mt-0.5">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{vendor.rating} ({vendor.reviewCount} reviews)</span>
              </div>
            </div>
            <div>
              <span className="text-zinc-400 dark:text-zinc-500 block text-[11px]">Campus Location</span>
              <div className="flex items-center gap-1 font-medium text-zinc-800 dark:text-zinc-200 mt-0.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                <span className="truncate">{vendor.location}</span>
              </div>
            </div>
            <div>
              <span className="text-zinc-400 dark:text-zinc-500 block text-[11px]">Response Speed</span>
              <div className="flex items-center gap-1 font-medium text-zinc-800 dark:text-zinc-200 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span>{vendor.responseRate}</span>
              </div>
            </div>
            <div>
              <span className="text-zinc-400 dark:text-zinc-500 block text-[11px]">Store Catalog</span>
              <div className="flex items-center gap-1 font-medium text-zinc-800 dark:text-zinc-200 mt-0.5">
                <Package className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span>{vendorProducts.length} Items Listed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="space-y-6">
        <div className="flex items-center gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-2">
          <button
            onClick={() => setActiveTab('products')}
            className={`text-sm font-bold pb-2 transition-colors relative ${
              activeTab === 'products' ? 'text-orange-600 dark:text-orange-400' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            Store Products ({vendorProducts.length})
            {activeTab === 'products' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"></span>}
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`text-sm font-bold pb-2 transition-colors relative ${
              activeTab === 'reviews' ? 'text-orange-600 dark:text-orange-400' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            Buyer Reviews ({vendor.reviewCount})
            {activeTab === 'reviews' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"></span>}
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`text-sm font-bold pb-2 transition-colors relative ${
              activeTab === 'about' ? 'text-orange-600 dark:text-orange-400' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            Delivery Halls & Policies
            {activeTab === 'about' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"></span>}
          </button>
        </div>

        {/* Tab 1: Products */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-zinc-400 dark:text-zinc-500 mr-1">Filter Store:</span>
              {vendorCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                    selectedCategory === cat
                      ? 'bg-zinc-950 dark:bg-orange-500 text-white dark:text-black font-semibold'
                      : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {displayedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayedProducts.map(p => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onSelect={onSelectProduct}
                  />
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                No products found in this category.
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Reviews */}
        {activeTab === 'reviews' && (
          <div className="space-y-4 max-w-3xl">
            {REVIEWS.map(r => (
              <div key={r.id} className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-zinc-900 dark:text-white text-xs sm:text-sm">{r.userName}</span>
                    <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block">{r.userUniversity}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-zinc-900 dark:text-white">{r.rating}.0</span>
                    <span className="text-zinc-400 text-[10px]">· {r.date}</span>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">{r.comment}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Delivery Halls & Policies */}
        {activeTab === 'about' && (
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-6 max-w-3xl text-xs sm:text-sm">
            <div>
              <h4 className="font-bold text-zinc-900 dark:text-white text-base mb-2">Halls & Hostels Covered</h4>
              <p className="text-zinc-600 dark:text-zinc-400 mb-3">
                This vendor directly provides room and porter lodge delivery to the following campus residences:
              </p>
              <div className="flex flex-wrap gap-2">
                {vendor.deliveryHalls.map((hall, idx) => (
                  <span key={idx} className="bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800/60 px-3 py-1 rounded-md text-xs font-medium">
                    {hall}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <h4 className="font-bold text-zinc-900 dark:text-white text-base mb-2">Payment & Inspection Protocol</h4>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Cash on delivery or Mobile Money (MTN MoMo, Telecel Cash) upon personal meetup inspection. Returns are accepted within 24 hours if the condition is non-functional or unauthentic.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Contact Vendor Modal */}
      <Modal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        title={`Contact ${vendor.name}`}
      >
        <div className="space-y-4 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
          <p>
            Connect directly with <strong>{vendor.name}</strong> for real-time order inquiries, sizing questions, or bulk hostel delivery requests.
          </p>

          <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 space-y-1">
            <span className="text-zinc-400 dark:text-zinc-500 text-[11px] block">Location:</span>
            <span className="font-medium text-zinc-900 dark:text-white">{vendor.location}</span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <a
              href={vendor.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 text-xs transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
            <a
              href={`tel:${vendor.phone}`}
              className="py-3 px-4 bg-zinc-900 dark:bg-zinc-800 hover:bg-zinc-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 text-xs transition-colors border border-zinc-700"
            >
              <Phone className="w-4 h-4" />
              <span>Direct Call</span>
            </a>
          </div>
        </div>
      </Modal>

    </div>
  );
};
