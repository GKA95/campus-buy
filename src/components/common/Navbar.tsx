import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { UNIVERSITIES } from '../../data/mockData';
import { UniversityId } from '../../types';
import { 
  Search, 
  ShoppingBag, 
  User, 
  Menu, 
  X, 
  Store, 
  MapPin, 
  ChevronDown,
  Sun,
  Moon
} from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string, params?: Record<string, string>) => void;
  onOpenSearch?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, onOpenSearch }) => {
  const { user, currentUniversityId, setCurrentUniversityId, toggleRole } = useAuth();
  const { itemCount } = useCart();
  const { theme, toggleTheme, isDark } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [campusDropdownOpen, setCampusDropdownOpen] = useState(false);

  const activeUniversity = UNIVERSITIES.find(u => u.id === currentUniversityId);

  const handleNavClick = (page: string, params?: Record<string, string>) => {
    onNavigate(page, params);
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'products', label: 'Products' },
    { id: 'vendors', label: 'Vendors' },
    { id: 'universities', label: 'Universities' },
    { id: 'services', label: 'Services' },
    { id: 'about', label: 'About' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 transition-colors">
      {/* Top Bar One-Row Three-Zone Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => handleNavClick('home')} 
            className="text-xl font-bold tracking-tight text-zinc-950 dark:text-white font-brand hover:opacity-90 transition-opacity flex items-center gap-1.5 focus:outline-none"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block shadow-xs shadow-orange-500/50"></span>
            <span>CampusBuy</span>
          </button>

          {/* Quick Campus Filter Pill in Header */}
          <div className="relative hidden lg:block">
            <button
              onClick={() => setCampusDropdownOpen(!campusDropdownOpen)}
              className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white px-2.5 py-1 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors whitespace-nowrap"
            >
              <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
              <span className="font-medium max-w-[130px] truncate">
                {activeUniversity ? activeUniversity.shortName : 'All Universities'}
              </span>
              <ChevronDown className="w-3 h-3 text-zinc-400" />
            </button>

            {campusDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setCampusDropdownOpen(false)} 
                />
                <div className="absolute left-0 mt-1 w-64 bg-white dark:bg-zinc-900 rounded-lg shadow-xl border border-zinc-200 dark:border-zinc-800 py-1.5 z-50 text-xs">
                  <div className="px-3 py-1 font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider text-[10px]">
                    Filter by Campus
                  </div>
                  <button
                    onClick={() => {
                      setCurrentUniversityId('all');
                      setCampusDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800 ${currentUniversityId === 'all' ? 'text-orange-600 dark:text-orange-400 font-semibold bg-orange-50/60 dark:bg-orange-950/30' : 'text-zinc-700 dark:text-zinc-300'}`}
                  >
                    <span>All Campuses (Ghana)</span>
                    {currentUniversityId === 'all' && <span className="text-[10px] text-orange-500 font-bold">ACTIVE</span>}
                  </button>
                  <div className="my-1 border-t border-zinc-100 dark:border-zinc-800"></div>
                  {UNIVERSITIES.map(u => (
                    <button
                      key={u.id}
                      onClick={() => {
                        setCurrentUniversityId(u.id);
                        setCampusDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800 ${currentUniversityId === u.id ? 'text-orange-600 dark:text-orange-400 font-semibold bg-orange-50/60 dark:bg-orange-950/30' : 'text-zinc-700 dark:text-zinc-300'}`}
                    >
                      <span className="truncate">{u.shortName}</span>
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-500 ml-2">{u.location.split(',')[0]}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-zinc-600 dark:text-zinc-300">
          {navLinks.map(link => {
            const isActive = currentPage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`transition-colors whitespace-nowrap py-1 relative hover:text-zinc-950 dark:hover:text-white ${
                  isActive ? 'text-orange-600 dark:text-orange-400 font-semibold' : 'text-zinc-600 dark:text-zinc-400'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary actions + theme toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Light / Dark Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            className="p-2 text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-colors focus:outline-none"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-amber-400 hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-5 h-5 text-zinc-700 hover:-rotate-12 transition-transform" />
            )}
          </button>

          {/* Search Trigger */}
          <button
            onClick={() => {
              if (onOpenSearch) onOpenSearch();
              else handleNavClick('products');
            }}
            className="p-2 text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-colors flex items-center gap-1.5"
            title="Search CampusBuy"
          >
            <Search className="w-5 h-5" />
            <span className="hidden xl:inline text-xs text-zinc-500 dark:text-zinc-400 font-normal">Search products...</span>
          </button>

          {/* Cart Icon with Tabular Badge */}
          <button
            onClick={() => handleNavClick('cart')}
            className="relative p-2 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-colors focus:outline-none"
            title="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-orange-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center font-mono tabular-nums shadow-sm">
                {itemCount}
              </span>
            )}
          </button>

          {/* Role/Dashboard / Login CTA */}
          {user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleNavClick(user.role === 'vendor' ? 'vendor-dashboard' : 'student-dashboard')}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-lg transition-colors whitespace-nowrap"
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-5 h-5 rounded-full object-cover ring-1 ring-orange-500/50"
                  />
                ) : (
                  <span className="w-5 h-5 rounded-full bg-orange-600 text-white text-[10px] flex items-center justify-center font-bold">
                    {user.avatarInitial}
                  </span>
                )}
                <span className="max-w-[90px] truncate">{user.name.split(' ')[0]}</span>
                <span className="text-[10px] text-orange-600 dark:text-orange-400 uppercase font-bold tracking-wider">
                  ({user.role})
                </span>
              </button>

              {/* Demo Mode Role Switcher */}
              <button
                onClick={toggleRole}
                className="hidden lg:flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white border border-zinc-300 dark:border-zinc-800 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors whitespace-nowrap"
                title="Switch between Student & Vendor demo view"
              >
                <Store className="w-3.5 h-3.5 text-zinc-500" />
                <span>Switch to {user.role === 'student' ? 'Vendor' : 'Student'}</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleNavClick('auth')}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-500 rounded-lg transition-colors shadow-sm whitespace-nowrap"
            >
              <User className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 pt-3 pb-6 space-y-3 shadow-lg">
          {/* Theme switcher on mobile */}
          <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
              {isDark ? <Moon className="w-4 h-4 text-orange-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
              <span>Theme Mode: {isDark ? 'Dark (Black & Orange)' : 'Light'}</span>
            </span>
            <button
              onClick={toggleTheme}
              className="text-xs font-bold text-orange-600 dark:text-orange-400 px-2 py-1 rounded bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/60"
            >
              Toggle
            </button>
          </div>

          {/* University selector on mobile */}
          <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
            <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-2 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-orange-500" />
              <span>Active Campus:</span>
            </div>
            <select
              value={currentUniversityId}
              onChange={(e) => setCurrentUniversityId(e.target.value as UniversityId | 'all')}
              className="w-full text-xs font-medium bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded px-2.5 py-1.5 text-zinc-800 dark:text-white"
            >
              <option value="all">All Universities (Ghana)</option>
              {UNIVERSITIES.map(u => (
                <option key={u.id} value={u.id}>{u.shortName} - {u.location}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  currentPage === link.id
                    ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 font-semibold'
                    : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
            {user ? (
              <>
                <button
                  onClick={() => handleNavClick(user.role === 'vendor' ? 'vendor-dashboard' : 'student-dashboard')}
                  className="w-full text-left px-3 py-2 text-sm font-medium text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-900 rounded-md"
                >
                  My {user.role === 'vendor' ? 'Vendor' : 'Student'} Dashboard
                </button>
                <button
                  onClick={toggleRole}
                  className="w-full text-left px-3 py-2 text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                >
                  Switch View: Currently {user.role.toUpperCase()} (Click to toggle)
                </button>
              </>
            ) : (
              <button
                onClick={() => handleNavClick('auth')}
                className="w-full py-2 text-sm font-semibold text-white bg-orange-600 rounded-md text-center"
              >
                Sign In / Register
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
