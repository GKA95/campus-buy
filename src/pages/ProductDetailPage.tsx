import React, { useState } from 'react';
import { Product } from '../types';
import { ProductImage } from '../components/common/ProductImage';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { REVIEWS } from '../data/mockData';
import { ProductCard } from '../components/common/ProductCard';
import { 
  Star, 
  ShoppingBag, 
  Zap, 
  Heart, 
  Truck, 
  ShieldCheck, 
  ArrowLeft, 
  MapPin, 
  CheckCircle2, 
  Share2, 
  Plus, 
  Minus
} from 'lucide-react';

interface ProductDetailPageProps {
  product: Product;
  relatedProducts: Product[];
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
  onSelectVendor: (vendorId: string) => void;
  onProceedToCheckout: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  relatedProducts,
  onBack,
  onSelectProduct,
  onSelectVendor,
  onProceedToCheckout
}) => {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'reviews' | 'delivery'>('details');
  const [copiedShare, setCopiedShare] = useState(false);

  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    onProceedToCheckout();
  };

  const handleShare = () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(window.location.href).catch(() => {});
      }
    } catch {
      // Ignore if clipboard access is blocked in sandbox iframe
    }
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Back Button & Breadcrumbs */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="flex items-center gap-1 text-xs text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 rounded-lg shadow-2xs"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedShare ? 'Link Copied!' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Main PDP Grid: Gallery Left + Contiguous Purchase Module Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Gallery / Product Showcase (Cols 6) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-black border border-zinc-200 dark:border-zinc-800 shadow-sm aspect-square">
            <ProductImage
              category={product.category}
              title={product.name}
              src={product.image}
              aspectRatio="square"
            />
            {/* Wishlist button */}
            <button
              onClick={() => toggleWishlist(product.id)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/95 dark:bg-zinc-900/95 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:text-rose-500 shadow-md transition-all"
            >
              <Heart className={`w-5 h-5 ${wishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
          </div>

          {/* Quick Trust Badges below image */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-white dark:bg-zinc-900 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <Truck className="w-4 h-4 text-orange-500 mx-auto mb-1" />
              <span className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200 block">Hostel Delivery</span>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400">{product.deliveryTime}</span>
            </div>
            <div className="bg-white dark:bg-zinc-900 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <ShieldCheck className="w-4 h-4 text-orange-500 mx-auto mb-1" />
              <span className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200 block">Verified Student</span>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400">Peer meetup safe</span>
            </div>
            <div className="bg-white dark:bg-zinc-900 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <CheckCircle2 className="w-4 h-4 text-orange-500 mx-auto mb-1" />
              <span className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200 block">Item Condition</span>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400">{product.condition}</span>
            </div>
          </div>
        </div>

        {/* Purchase Module (Cols 6) */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Zero-Pill Unboxed Metadata */}
            <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              <span className="font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">{product.universityName}</span>
              <span aria-hidden="true">·</span>
              <span>{product.category}</span>
              <span aria-hidden="true">·</span>
              <span className="text-zinc-600 dark:text-zinc-300">{product.condition}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white font-brand leading-snug">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-xs">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-bold text-zinc-900 dark:text-white">{product.rating}</span>
                <span className="text-zinc-500 dark:text-zinc-400">({product.reviewCount} student reviews)</span>
              </div>
              <span className="text-zinc-300 dark:text-zinc-700">·</span>
              <div className="text-xs text-orange-600 dark:text-orange-400 font-semibold">
                {product.stock > 0 ? `${product.stock} units available in stock` : 'Out of stock'}
              </div>
            </div>

            {/* Price Box */}
            <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 flex items-baseline justify-between">
              <div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">Student Price</div>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl sm:text-3xl font-extrabold text-zinc-950 dark:text-white font-mono tabular-nums">
                    GH₵ {product.price.toLocaleString()}
                  </span>
                  {product.compareAtPrice && (
                    <span className="text-sm text-zinc-400 dark:text-zinc-500 line-through font-mono tabular-nums">
                      GH₵ {product.compareAtPrice.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              {product.compareAtPrice && (
                <div className="text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-950/60 px-2.5 py-1 rounded-md">
                  Save GH₵ {(product.compareAtPrice - product.price).toLocaleString()}
                </div>
              )}
            </div>

            {/* Description Excerpt */}
            <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              {product.description}
            </p>

            {/* Key Features */}
            {product.features && product.features.length > 0 && (
              <div className="space-y-1.5 pt-2">
                <span className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider block">Key Specifications:</span>
                <ul className="space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
                  {product.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-orange-500 font-bold">✓</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Vendor Card Snippet */}
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-zinc-950 dark:bg-black text-orange-400 border border-zinc-800 font-bold flex items-center justify-center text-sm font-brand">
                  {product.vendorName.charAt(0)}
                </div>
                <div>
                  <span className="text-[11px] text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">Campus Vendor</span>
                  <button
                    onClick={() => onSelectVendor(product.vendorId)}
                    className="font-bold text-zinc-900 dark:text-white hover:text-orange-500 text-xs sm:text-sm text-left hover:underline"
                  >
                    {product.vendorName}
                  </button>
                  <div className="flex items-center gap-1 text-[11px] text-zinc-500 dark:text-zinc-400">
                    <MapPin className="w-3 h-3 text-orange-500" />
                    <span>{product.universityName} Campus</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onSelectVendor(product.vendorId)}
                className="px-3 py-1.5 text-xs font-semibold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 hover:bg-orange-100 rounded-lg border border-orange-200 dark:border-orange-800/60 transition-colors"
              >
                Visit Store
              </button>
            </div>
          </div>

          {/* Stepper & Actions */}
          <div className="space-y-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-zinc-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center font-bold text-sm font-mono tabular-nums text-zinc-900 dark:text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                  disabled={quantity >= product.stock}
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                Total: <strong className="text-zinc-900 dark:text-white font-mono">GH₵ {(product.price * quantity).toLocaleString()}</strong>
              </div>
            </div>

            {/* CTAs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                className="py-3 px-5 rounded-xl border-2 border-zinc-900 dark:border-zinc-700 hover:bg-zinc-900 hover:text-white dark:hover:bg-zinc-800 font-bold text-xs sm:text-sm text-zinc-900 dark:text-white transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>
              <button
                onClick={handleBuyNow}
                className="py-3 px-5 rounded-xl bg-orange-500 hover:bg-orange-600 font-bold text-xs sm:text-sm text-black transition-all shadow-md flex items-center justify-center gap-2 active:scale-95"
              >
                <Zap className="w-4 h-4 fill-black" />
                <span>Buy Now (Express)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Specifications / Student Reviews / Campus Delivery */}
      <div className="border-t border-zinc-200 dark:border-zinc-800 pt-8">
        <div className="flex items-center gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <button
            onClick={() => setActiveTab('details')}
            className={`text-sm font-bold pb-2 transition-colors relative ${
              activeTab === 'details' ? 'text-orange-600 dark:text-orange-400' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            Full Product Description
            {activeTab === 'details' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"></span>}
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`text-sm font-bold pb-2 transition-colors relative ${
              activeTab === 'reviews' ? 'text-orange-600 dark:text-orange-400' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            Verified Reviews ({product.reviewCount})
            {activeTab === 'reviews' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"></span>}
          </button>
          <button
            onClick={() => setActiveTab('delivery')}
            className={`text-sm font-bold pb-2 transition-colors relative ${
              activeTab === 'delivery' ? 'text-orange-600 dark:text-orange-400' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            Hostel Delivery & Meetup
            {activeTab === 'delivery' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"></span>}
          </button>
        </div>

        <div className="py-6">
          {activeTab === 'details' && (
            <div className="space-y-4 max-w-3xl text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
              <p>{product.description}</p>
              <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                <h4 className="font-bold text-zinc-900 dark:text-white mb-2">Campus Security & Inspection Guarantee</h4>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  CampusBuy protects buyers by recommending in-person inspection at your hostel porter lodge or prominent faculty locations before final payment. If the item differs from the description, you have zero obligation to proceed.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-4 max-w-3xl">
              {REVIEWS.map(r => (
                <div key={r.id} className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-zinc-900 dark:text-white text-xs sm:text-sm block">{r.userName}</span>
                      <span className="text-[11px] text-zinc-500 dark:text-zinc-400">{r.userUniversity}</span>
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

          {activeTab === 'delivery' && (
            <div className="space-y-3 max-w-3xl text-sm text-zinc-700 dark:text-zinc-300">
              <h4 className="font-bold text-zinc-900 dark:text-white">Hostel Room & Hall Delivery Process:</h4>
              <ul className="space-y-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 list-disc list-inside">
                <li>Estimated delivery speed: <strong>{product.deliveryTime}</strong></li>
                <li>Flat delivery rate: <strong>GH₵ 5.00</strong> to any designated on-campus hostel, hall of residence, or faculty porter lodge.</li>
                <li>Payment options supported: Cash on Meetup or Mobile Money (MTN MoMo, Telecel Cash).</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-zinc-200 dark:border-zinc-800 pt-10 space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white font-brand">
            Related Campus Items
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(rel => (
              <ProductCard
                key={rel.id}
                product={rel}
                onSelect={onSelectProduct}
                onVendorClick={onSelectVendor}
              />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
