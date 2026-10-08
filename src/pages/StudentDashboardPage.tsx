import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { PRODUCTS, VENDORS, MOCK_ORDERS } from '../data/mockData';
import { ProductCard } from '../components/common/ProductCard';
import { VendorCard } from '../components/common/VendorCard';
import { 
  User, 
  Package, 
  Heart, 
  Store, 
  Settings, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Truck, 
  LogOut,
  ChevronRight
} from 'lucide-react';

interface StudentDashboardPageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
  onSelectProduct: (product: any) => void;
  onSelectVendor: (vendorId: string) => void;
}

export const StudentDashboardPage: React.FC<StudentDashboardPageProps> = ({
  onNavigate,
  onSelectProduct,
  onSelectVendor
}) => {
  const { user, logout, toggleRole } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'wishlist' | 'saved-vendors' | 'settings'>('orders');

  // Local settings form state
  const [phone, setPhone] = useState(user?.phone || '+233 55 123 4567');
  const [hall, setHall] = useState(user?.hallOrHostel || 'Unity Hall (Conti)');
  const [room, setRoom] = useState(user?.roomNumber || 'Block B, Room 214');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Products in wishlist
  const wishlistedProducts = PRODUCTS.filter(p => user?.wishlistProductIds.includes(p.id));
  
  // Saved vendors
  const savedVendors = VENDORS.filter(v => user?.savedVendors.includes(v.id));

  // Recently viewed
  const recentlyViewed = PRODUCTS.slice(0, 4);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Profile Banner */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xs transition-colors">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-orange-600 text-white font-brand font-bold text-2xl flex items-center justify-center shadow-md">
            {user?.avatarInitial || 'S'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white font-brand">
                {user?.name || 'Student Account'}
              </h1>
              <span className="text-[11px] font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/60 px-2.5 py-0.5 rounded-full uppercase">
                Student
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{user?.email}</p>
            <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400 mt-2">
              <span className="font-semibold text-orange-600 dark:text-orange-400 uppercase text-[11px]">{user?.universityId?.toUpperCase()}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-zinc-400" />
                <span>{user?.hallOrHostel} ({user?.roomNumber})</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={toggleRole}
            className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors"
          >
            Switch to Vendor View
          </button>
          <button
            onClick={() => {
              logout();
              onNavigate('home');
            }}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 transition-colors flex items-center gap-1"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Tabs Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Navigation Sidebar */}
        <aside className="space-y-1">
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'orders'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Package className="w-4 h-4" />
              <span>Orders & Deliveries</span>
            </span>
            <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10">
              {MOCK_ORDERS.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'wishlist'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Heart className="w-4 h-4" />
              <span>Wishlist</span>
            </span>
            <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10">
              {wishlistedProducts.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('saved-vendors')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'saved-vendors'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Store className="w-4 h-4" />
              <span>Saved Stores</span>
            </span>
            <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10">
              {savedVendors.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'profile'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Clock className="w-4 h-4" />
              <span>Recently Viewed</span>
            </span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'settings'
                ? 'bg-orange-600 text-white shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Settings className="w-4 h-4" />
              <span>Hostel & Delivery</span>
            </span>
          </button>
        </aside>

        {/* Tab Content Area */}
        <main className="md:col-span-3">
          
          {/* TAB 1: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
                <h2 className="text-base font-bold text-zinc-900 dark:text-white font-brand">Campus Orders History</h2>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">{MOCK_ORDERS.length} Orders recorded</span>
              </div>

              {MOCK_ORDERS.map(order => (
                <div key={order.id} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 space-y-4 shadow-xs transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3 text-xs">
                    <div>
                      <span className="font-bold text-zinc-900 dark:text-white font-mono text-sm">{order.id}</span>
                      <span className="text-zinc-400 ml-2">Placed {order.date}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        order.status === 'Delivered'
                          ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800/60'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-2">
                    {order.items.map((it, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-zinc-900 dark:text-white">{it.productName}</span>
                          <span className="text-zinc-500 dark:text-zinc-400 block text-[11px]">Vendor: {it.vendorName} · Qty: {it.quantity}</span>
                        </div>
                        <span className="font-mono font-bold text-zinc-900 dark:text-white tabular-nums">
                          GH₵ {(it.price * it.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Footer details */}
                  <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                    <div className="flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-orange-500" />
                      <span>Delivery: {order.deliveryHall} ({order.deliveryRoom})</span>
                    </div>
                    <div className="font-mono text-zinc-900 dark:text-white font-bold">
                      Paid: GH₵ {order.total.toLocaleString()} via {order.paymentMethod}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
                <h2 className="text-base font-bold text-zinc-900 dark:text-white font-brand">Saved Wishlist Items</h2>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">{wishlistedProducts.length} items</span>
              </div>

              {wishlistedProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlistedProducts.map(p => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onSelect={onSelectProduct}
                      onVendorClick={onSelectVendor}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                  You haven't saved any items yet. Click the heart icon on products to save them for later!
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SAVED VENDORS */}
          {activeTab === 'saved-vendors' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
                <h2 className="text-base font-bold text-zinc-900 dark:text-white font-brand">Favorite Campus Vendors</h2>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">{savedVendors.length} vendors</span>
              </div>

              {savedVendors.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {savedVendors.map(v => (
                    <VendorCard
                      key={v.id}
                      vendor={v}
                      onSelect={onSelectVendor}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                  No saved vendors yet. Bookmark merchants for easy access!
                </div>
              )}
            </div>
          )}

          {/* TAB 4: RECENTLY VIEWED */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
                <h2 className="text-base font-bold text-zinc-900 dark:text-white font-brand">Recently Viewed Products</h2>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">Pick up where you left off</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentlyViewed.map(p => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onSelect={onSelectProduct}
                    onVendorClick={onSelectVendor}
                  />
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: ACCOUNT SETTINGS */}
          {activeTab === 'settings' && (
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-6 shadow-xs max-w-2xl transition-colors">
              <h2 className="text-base font-bold text-zinc-900 dark:text-white font-brand pb-2 border-b border-zinc-100 dark:border-zinc-800">
                Hostel & Delivery Settings
              </h2>

              {savedSuccess && (
                <div className="p-3 bg-orange-50 dark:bg-orange-950/40 text-orange-800 dark:text-orange-300 rounded-xl text-xs flex items-center gap-2 border border-orange-200 dark:border-orange-800/60">
                  <CheckCircle2 className="w-4 h-4 text-orange-500" />
                  <span>Your campus hostel information has been saved!</span>
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Mobile Phone (MTN/Telecel)</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Hall / Hostel</label>
                    <input
                      type="text"
                      value={hall}
                      onChange={(e) => setHall(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-xs focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Room Number / Block</label>
                    <input
                      type="text"
                      value={room}
                      onChange={(e) => setRoom(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-xs focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

        </main>
      </div>

    </div>
  );
};
