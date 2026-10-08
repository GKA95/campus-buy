import React from 'react';
import { ShieldCheck, Truck, Sparkles, HeartHandshake } from 'lucide-react';
import { UNIVERSITIES } from '../../data/mockData';
import { UniversityId } from '../../types';

interface FooterProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
  onSelectUniversity?: (id: UniversityId) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onSelectUniversity }) => {
  return (
    <footer className="bg-black text-zinc-400 border-t border-zinc-900 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Trust Badges */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-12 border-b border-zinc-900 text-zinc-300">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-white">Verified Campus Vendors</h4>
              <p className="text-xs text-zinc-400 mt-0.5">Every merchant is a verified student or local campus store.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Truck className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-white">Hostel Room Delivery</h4>
              <p className="text-xs text-zinc-400 mt-0.5">Quick handoffs to your hall porter lodge or room door.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-white">Student-First Pricing</h4>
              <p className="text-xs text-zinc-400 mt-0.5">Transparent prices in GH₵ without inflated retail markups.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <HeartHandshake className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-white">Safe Meetup Protocol</h4>
              <p className="text-xs text-zinc-400 mt-0.5">Inspect goods in public campus areas before paying.</p>
            </div>
          </div>
        </div>

        {/* Main Footer Columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 py-12 border-b border-zinc-900">
          {/* Brand Info */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
              <span className="text-xl font-bold text-white font-brand">CampusBuy</span>
            </div>
            <p className="text-sm text-zinc-400 max-w-sm leading-relaxed">
              Your Campus. Your Marketplace. Connecting Ghanaian university students with verified peer sellers, dorm essentials, and trusted campus services.
            </p>
            <div className="text-xs text-zinc-500">
              Operating across Kumasi, Accra, Cape Coast, Tamale, Winneba & Berekuso.
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h5 className="text-xs font-semibold text-white uppercase tracking-wider">Explore</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('products')} className="hover:text-orange-400 transition-colors">
                  All Products
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('vendors')} className="hover:text-orange-400 transition-colors">
                  Campus Vendors
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-orange-400 transition-colors">
                  Student Services
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('universities')} className="hover:text-orange-400 transition-colors">
                  Browse by Campus
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-orange-400 transition-colors">
                  Safety & How It Works
                </button>
              </li>
            </ul>
          </div>

          {/* Campuses */}
          <div className="space-y-3">
            <h5 className="text-xs font-semibold text-white uppercase tracking-wider">Universities</h5>
            <ul className="space-y-2 text-xs">
              {UNIVERSITIES.slice(0, 5).map(u => (
                <li key={u.id}>
                  <button 
                    onClick={() => {
                      if (onSelectUniversity) onSelectUniversity(u.id);
                      onNavigate('products');
                    }}
                    className="hover:text-orange-400 transition-colors text-left"
                  >
                    {u.shortName}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Vendors & Dokan */}
          <div className="space-y-3">
            <h5 className="text-xs font-semibold text-white uppercase tracking-wider">For Vendors</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('vendor-dashboard')} className="hover:text-orange-400 transition-colors">
                  Vendor Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('auth')} className="hover:text-orange-400 transition-colors">
                  Open a Campus Store
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-orange-400 transition-colors">
                  Seller Guidelines
                </button>
              </li>
              <li>
                <span className="text-[11px] text-zinc-500">WooCommerce / Dokan API Ready</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal / Editorial */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© 2026 CampusBuy Ghana. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate('about')} className="hover:text-zinc-400">Campus Safety Guide</button>
            <span>·</span>
            <button onClick={() => onNavigate('about')} className="hover:text-zinc-400">Terms of Service</button>
            <span>·</span>
            <button onClick={() => onNavigate('about')} className="hover:text-zinc-400">Privacy Policy</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
