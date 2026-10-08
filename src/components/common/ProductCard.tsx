import React from 'react';
import { Product } from '../../types';
import { ProductImage } from './ProductImage';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { Star, ShoppingBag, Heart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onVendorClick?: (vendorId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onVendorClick
}) => {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useAuth();
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleVendor = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onVendorClick) onVendorClick(product.vendorId);
  };

  return (
    <div
      onClick={() => onSelect(product)}
      className="group relative bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/90 dark:border-zinc-800 overflow-hidden hover:border-orange-500/50 dark:hover:border-orange-500/60 hover:shadow-lg dark:hover:shadow-orange-950/20 transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      {/* Product Image Box */}
      <div className="relative w-full aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-950">
        <ProductImage
          category={product.category}
          title={product.name}
          src={product.image}
        />

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:text-rose-500 hover:scale-105 transition-all shadow-sm"
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Condition Text Watermark */}
        {product.condition !== 'Brand New' && (
          <div className="absolute bottom-2.5 left-2.5 z-20 px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide bg-black/80 backdrop-blur-sm text-white border border-white/10">
            {product.condition}
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Zero-Pill Unboxed Metadata */}
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 mb-1.5">
            <span className="font-semibold text-orange-600 dark:text-orange-400 uppercase text-[11px] tracking-wider">
              {product.universityName}
            </span>
            <span aria-hidden="true" className="text-zinc-300 dark:text-zinc-700">·</span>
            <span className="text-zinc-500 dark:text-zinc-400">{product.category}</span>
          </div>

          {/* Product Title */}
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
            {product.name}
          </h3>

          {/* Vendor Attribution */}
          <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Sold by{' '}
            <button
              onClick={handleVendor}
              className="text-zinc-700 dark:text-zinc-300 font-medium hover:underline hover:text-orange-600 dark:hover:text-orange-400 text-left inline"
            >
              {product.vendorName}
            </button>
          </div>
        </div>

        {/* Bottom Metrics & Actions */}
        <div className="pt-3 mt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div>
            {/* Price in GH₵ */}
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-bold text-zinc-950 dark:text-white font-mono tabular-nums">
                GH₵ {product.price.toLocaleString()}
              </span>
              {product.compareAtPrice && (
                <span className="text-xs text-zinc-400 dark:text-zinc-500 line-through font-mono tabular-nums">
                  GH₵ {product.compareAtPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-zinc-700 dark:text-zinc-200">{product.rating}</span>
              <span className="text-zinc-400 dark:text-zinc-500">({product.reviewCount})</span>
            </div>
          </div>

          {/* Quick Add To Cart Button */}
          <button
            onClick={handleAddToCart}
            className="p-2 sm:px-3 sm:py-2 text-xs font-bold text-white bg-zinc-900 hover:bg-orange-600 dark:bg-orange-500 dark:hover:bg-orange-600 dark:text-black rounded-lg transition-colors flex items-center gap-1.5 shadow-sm active:scale-95"
            title="Add to Cart"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
