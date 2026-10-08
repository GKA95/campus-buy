import React, { useState } from 'react';
import { ProductCategory } from '../../types';
import { 
  Laptop, 
  Shirt, 
  UtensilsCrossed, 
  BookOpen, 
  Sparkles, 
  Watch, 
  GraduationCap, 
  Wrench,
  Package
} from 'lucide-react';

interface ProductImageProps {
  category: ProductCategory;
  title: string;
  className?: string;
  src?: string;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'wide';
}

const categoryThemes: Record<ProductCategory, { bg: string; icon: React.ElementType; accent: string; label: string }> = {
  Electronics: {
    bg: 'from-black via-zinc-900 to-black',
    icon: Laptop,
    accent: 'text-orange-400',
    label: 'Tech & Gadgets'
  },
  Fashion: {
    bg: 'from-zinc-950 via-stone-900 to-black',
    icon: Shirt,
    accent: 'text-orange-400',
    label: 'Campus Wear'
  },
  Food: {
    bg: 'from-neutral-950 via-orange-950/40 to-black',
    icon: UtensilsCrossed,
    accent: 'text-orange-500',
    label: 'Meals & Snacks'
  },
  Books: {
    bg: 'from-zinc-950 via-neutral-900 to-black',
    icon: BookOpen,
    accent: 'text-amber-400',
    label: 'Academic Materials'
  },
  Beauty: {
    bg: 'from-neutral-950 via-zinc-900 to-black',
    icon: Sparkles,
    accent: 'text-orange-300',
    label: 'Grooming & Glow'
  },
  Accessories: {
    bg: 'from-black via-zinc-950 to-neutral-900',
    icon: Watch,
    accent: 'text-orange-400',
    label: 'Everyday Gear'
  },
  'School Supplies': {
    bg: 'from-zinc-950 via-stone-900 to-black',
    icon: GraduationCap,
    accent: 'text-orange-400',
    label: 'Stationery & Study'
  },
  Services: {
    bg: 'from-black via-zinc-900 to-black',
    icon: Wrench,
    accent: 'text-orange-500',
    label: 'Campus Services'
  }
};

export const ProductImage: React.FC<ProductImageProps> = ({
  category,
  title,
  className = '',
  src,
  aspectRatio = 'square'
}) => {
  const [imageError, setImageError] = useState(false);
  const theme = categoryThemes[category] || {
    bg: 'from-black to-zinc-900',
    icon: Package,
    accent: 'text-orange-500',
    label: 'Marketplace'
  };

  const IconComponent = theme.icon;

  const aspectClass = 
    aspectRatio === 'video' ? 'aspect-video' :
    aspectRatio === 'portrait' ? 'aspect-[3/4]' :
    aspectRatio === 'wide' ? 'aspect-[16/9]' :
    'aspect-square';

  if (src && !imageError) {
    return (
      <div className={`relative overflow-hidden bg-slate-100 ${aspectClass} ${className}`}>
        <img
          src={src}
          alt={title}
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
    );
  }

  // Resilient High-Fidelity Domain Graphic Fallback
  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br ${theme.bg} ${aspectClass} ${className} flex flex-col justify-between p-5 text-white select-none border border-white/5`}
    >
      {/* Subtle decorative mesh / background rings */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <circle cx="90" cy="10" r="40" stroke="currentColor" strokeWidth="0.5" fill="none" />
          <circle cx="10" cy="90" r="50" stroke="currentColor" strokeWidth="0.5" fill="none" />
          <line x1="0" y1="0" x2="100" y2="100" stroke="currentColor" strokeWidth="0.25" />
        </svg>
      </div>

      {/* Top Header Tag */}
      <div className="relative z-10 flex items-center justify-between">
        <span className="text-[11px] font-medium tracking-wider uppercase text-white/70">
          {theme.label}
        </span>
        <span className="text-[10px] text-white/40 tracking-wider">CAMPUSBUY</span>
      </div>

      {/* Center Icon & Artwork */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto py-2">
        <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center shadow-lg transform transition-transform duration-300 group-hover:scale-110">
          <IconComponent className={`w-7 h-7 ${theme.accent}`} />
        </div>
      </div>

      {/* Bottom Title snippet */}
      <div className="relative z-10 pt-2 border-t border-white/10">
        <p className="text-xs font-medium text-white/90 line-clamp-1 truncate">
          {title}
        </p>
      </div>
    </div>
  );
};
