import React from 'react';
import { Vendor } from '../../types';
import { Star, ShieldCheck, MapPin, Package, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface VendorCardProps {
  vendor: Vendor;
  onSelect: (vendorId: string) => void;
}

export const VendorCard: React.FC<VendorCardProps> = ({ vendor, onSelect }) => {
  const { isVendorSaved, toggleSaveVendor } = useAuth();
  const saved = isVendorSaved(vendor.id);

  return (
    <div 
      onClick={() => onSelect(vendor.id)}
      className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/90 dark:border-zinc-800 overflow-hidden hover:border-orange-500/50 dark:hover:border-orange-500/60 hover:shadow-lg dark:hover:shadow-orange-950/20 transition-all cursor-pointer flex flex-col justify-between group"
    >
      {/* Vendor Header Banner */}
      <div 
        className="h-20 w-full relative p-3 flex items-start justify-between"
        style={{ background: vendor.banner || 'linear-gradient(135deg, #18181b 0%, #ea580c 100%)' }}
      >
        <div className="flex items-center gap-1.5 text-xs text-white/90 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded border border-white/10">
          <MapPin className="w-3 h-3 text-orange-400" />
          <span className="font-medium text-[11px] truncate max-w-[150px]">{vendor.universityName}</span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleSaveVendor(vendor.id);
          }}
          className="text-xs text-white/90 hover:text-white bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded hover:bg-black/80 transition-colors border border-white/10"
        >
          {saved ? 'Saved' : 'Save'}
        </button>
      </div>

      {/* Body Info */}
      <div className="p-4 pt-0 relative flex-1 flex flex-col justify-between">
        {/* Floating Avatar */}
        <div className="-mt-7 mb-3 flex items-center justify-between">
          <div className="w-14 h-14 rounded-xl bg-white dark:bg-zinc-900 border-2 border-white dark:border-zinc-900 shadow-md flex items-center justify-center font-bold text-zinc-900 font-brand text-lg">
            <span className="w-full h-full rounded-lg bg-zinc-950 dark:bg-black text-orange-500 border border-zinc-800 flex items-center justify-center">
              {vendor.avatar}
            </span>
          </div>

          {vendor.verified && (
            <div className="flex items-center gap-1 text-[11px] font-semibold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 px-2 py-0.5 rounded-full border border-orange-200 dark:border-orange-800/60">
              <ShieldCheck className="w-3.5 h-3.5 text-orange-500" />
              <span>Verified Seller</span>
            </div>
          )}
        </div>

        <div>
          <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-base group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
            {vendor.name}
          </h3>

          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
            {vendor.bio}
          </p>

          <div className="mt-3 flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">{vendor.rating}</span>
              <span>({vendor.reviewCount})</span>
            </div>
            <span aria-hidden="true" className="text-zinc-300 dark:text-zinc-700">·</span>
            <div className="flex items-center gap-1">
              <Package className="w-3.5 h-3.5 text-zinc-400" />
              <span className="font-medium text-zinc-700 dark:text-zinc-300">{vendor.productCount} Items</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
          <span className="text-zinc-400 dark:text-zinc-500 text-[11px]">Replies {vendor.responseRate}</span>
          <span className="font-semibold text-orange-600 dark:text-orange-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
            View Store <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
};
