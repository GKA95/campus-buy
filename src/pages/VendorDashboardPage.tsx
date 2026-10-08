import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Product, ProductCategory } from '../types';
import { PRODUCTS, VENDORS, REVIEWS } from '../data/mockData';
import { Modal } from '../components/common/Modal';
import { 
  Store, 
  Package, 
  TrendingUp, 
  ShoppingBag, 
  Star, 
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Settings, 
  User, 
  Truck,
  ArrowUpRight
} from 'lucide-react';

interface VendorDashboardPageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
  onSelectProduct: (product: any) => void;
}

export const VendorDashboardPage: React.FC<VendorDashboardPageProps> = ({
  onNavigate,
  onSelectProduct
}) => {
  const { user, toggleRole } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'sales' | 'profile' | 'reviews' | 'settings'>('overview');

  // Vendor's managed products
  const [vendorProducts, setVendorProducts] = useState<Product[]>(() => {
    return PRODUCTS.filter(p => p.vendorId === 'v-knust-tech' || p.category === 'Electronics');
  });

  // Vendor orders
  const [vendorOrders, setVendorOrders] = useState([
    {
      id: 'ORD-2026-9041',
      date: 'Today, 11:20 AM',
      customerName: 'Kwame Osei Asante',
      hall: 'Unity Hall (Conti) - Room 214',
      productName: 'Anker PowerCore 20,000mAh High-Speed Power Bank',
      quantity: 1,
      total: 345,
      status: 'Dispatched',
      momoPhone: '+233 55 123 4567'
    },
    {
      id: 'ORD-2026-8910',
      date: 'Yesterday, 4:15 PM',
      customerName: 'Abena Mansa',
      hall: 'Africa Hall - Room 102',
      productName: 'Noise-Cancelling Wireless Headphones',
      quantity: 1,
      total: 295,
      status: 'Delivered',
      momoPhone: '+233 24 990 1144'
    },
    {
      id: 'ORD-2026-8740',
      date: '28 Sep 2026',
      customerName: 'Francis Mensah',
      hall: 'Katanga (University Hall)',
      productName: 'Lenovo ThinkPad T480 (Core i5)',
      quantity: 1,
      total: 3255,
      status: 'Delivered',
      momoPhone: '+233 50 441 2288'
    }
  ]);

  // Add Product Modal
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: 'Electronics' as ProductCategory,
    stock: '10',
    description: '',
    condition: 'Brand New' as any
  });

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Product = {
      id: `p-${Date.now()}`,
      name: newProduct.name,
      price: Number(newProduct.price),
      category: newProduct.category,
      vendorId: 'v-knust-tech',
      vendorName: 'CampusTech Hub KNUST',
      universityId: 'knust',
      universityName: 'KNUST',
      rating: 5.0,
      reviewCount: 1,
      stock: Number(newProduct.stock),
      description: newProduct.description,
      features: ['Genuine campus quality', 'Hostel delivery available'],
      image: '',
      images: [],
      deliveryTime: 'Within 2 hours',
      condition: newProduct.condition,
      tags: ['new arrival', 'campustech']
    };

    setVendorProducts([created, ...vendorProducts]);
    setIsAddProductOpen(false);
    setNewProduct({
      name: '',
      price: '',
      category: 'Electronics',
      stock: '10',
      description: '',
      condition: 'Brand New'
    });
  };

  const handleToggleOrderStatus = (orderId: string) => {
    setVendorOrders(prev =>
      prev.map(o => {
        if (o.id === orderId) {
          const nextStatus = o.status === 'Dispatched' ? 'Delivered' : 'Dispatched';
          return { ...o, status: nextStatus };
        }
        return o;
      })
    );
  };

  const handleDeleteProduct = (productId: string) => {
    setVendorProducts(prev => prev.filter(p => p.id !== productId));
  };

  const totalSalesGH = vendorOrders.reduce((acc, o) => acc + o.total, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner (Black with Orange accents) */}
      <div className="bg-zinc-950 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-md border border-zinc-800">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-orange-600 text-white font-brand font-bold text-2xl flex items-center justify-center shadow-lg">
            CT
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold font-brand text-white">
                CampusTech Hub Store
              </h1>
              <span className="text-[10px] font-bold text-orange-400 bg-orange-950/80 border border-orange-500/40 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Dokan Verified
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">KNUST Campus Vendor Dashboard · Kumasi</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setIsAddProductOpen(true)}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
          <button
            onClick={toggleRole}
            className="px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
          >
            Switch to Student View
          </button>
        </div>
      </div>

      {/* Main Layout: Nav Tabs + Views */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-3 space-y-1 bg-white dark:bg-zinc-900 p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 h-fit shadow-xs transition-colors">
          {[
            { id: 'overview', label: 'Store Overview', icon: TrendingUp },
            { id: 'products', label: 'Products & Stock', icon: Package, badge: vendorProducts.length },
            { id: 'orders', label: 'Campus Orders', icon: ShoppingBag, badge: vendorOrders.length },
            { id: 'sales', label: 'Sales & Revenue', icon: DollarSign },
            { id: 'profile', label: 'Storefront Profile', icon: Store },
            { id: 'reviews', label: 'Customer Reviews', icon: Star },
            { id: 'settings', label: 'Payout & Dokan API', icon: Settings }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </div>
                {tab.badge !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                    isActive ? 'bg-white/20 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Content Area */}
        <main className="lg:col-span-9 space-y-6">
          
          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs transition-colors">
                  <span className="text-[11px] text-zinc-400 block font-semibold uppercase tracking-wider">Gross Sales</span>
                  <div className="text-xl font-extrabold text-zinc-900 dark:text-white font-mono mt-1 tabular-nums">
                    GH₵ {totalSalesGH.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-orange-600 dark:text-orange-400 font-semibold flex items-center gap-0.5 mt-1">
                    <ArrowUpRight className="w-3 h-3" /> +18% this semester
                  </span>
                </div>

                <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs transition-colors">
                  <span className="text-[11px] text-zinc-400 block font-semibold uppercase tracking-wider">Total Orders</span>
                  <div className="text-xl font-extrabold text-zinc-900 dark:text-white font-mono mt-1 tabular-nums">
                    {vendorOrders.length}
                  </div>
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1 block">3 pending fulfillment</span>
                </div>

                <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs transition-colors">
                  <span className="text-[11px] text-zinc-400 block font-semibold uppercase tracking-wider">Items in Catalog</span>
                  <div className="text-xl font-extrabold text-zinc-900 dark:text-white font-mono mt-1 tabular-nums">
                    {vendorProducts.length}
                  </div>
                  <span className="text-[10px] text-orange-600 dark:text-orange-400 mt-1 block font-semibold">Active in KNUST store</span>
                </div>

                <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs transition-colors">
                  <span className="text-[11px] text-zinc-400 block font-semibold uppercase tracking-wider">Seller Rating</span>
                  <div className="text-xl font-extrabold text-zinc-900 dark:text-white font-mono mt-1 tabular-nums flex items-center gap-1">
                    <span>4.9</span>
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  </div>
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1 block">142 student reviews</span>
                </div>
              </div>

              {/* Recent Orders Preview */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-4 shadow-xs transition-colors">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                  <h3 className="font-bold text-zinc-900 dark:text-white text-sm font-brand">Recent Campus Orders</h3>
                  <button onClick={() => setActiveTab('orders')} className="text-xs text-orange-600 dark:text-orange-400 font-semibold hover:underline">
                    View All Orders
                  </button>
                </div>

                <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {vendorOrders.slice(0, 2).map(order => (
                    <div key={order.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div>
                        <span className="font-mono font-bold text-zinc-900 dark:text-white">{order.id}</span>
                        <span className="text-zinc-400 ml-2">· {order.customerName}</span>
                        <div className="text-zinc-600 dark:text-zinc-400 mt-0.5">{order.productName}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-zinc-900 dark:text-white tabular-nums">GH₵ {order.total}</span>
                        <button
                          onClick={() => handleToggleOrderStatus(order.id)}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors ${
                            order.status === 'Delivered'
                              ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400'
                              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                          }`}
                        >
                          {order.status}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: PRODUCTS */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
                <div>
                  <h2 className="text-base font-bold text-zinc-900 dark:text-white font-brand">Manage Catalog ({vendorProducts.length})</h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Live products syncing to your CampusBuy storefront</p>
                </div>
                <button
                  onClick={() => setIsAddProductOpen(true)}
                  className="px-3.5 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Product</span>
                </button>
              </div>

              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden divide-y divide-zinc-100 dark:divide-zinc-800 shadow-xs transition-colors">
                {vendorProducts.map(prod => (
                  <div key={prod.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-zinc-900 dark:bg-zinc-800 text-orange-500 flex items-center justify-center font-bold text-xs shrink-0">
                        {prod.category.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-zinc-900 dark:text-white text-xs sm:text-sm line-clamp-1">{prod.name}</h4>
                        <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 mt-0.5">
                          <span>{prod.category}</span>
                          <span>·</span>
                          <span className="text-orange-600 dark:text-orange-400 font-medium">{prod.stock} in stock</span>
                          <span>·</span>
                          <span>{prod.condition}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <div className="font-mono font-bold text-zinc-950 dark:text-white text-sm tabular-nums">
                        GH₵ {prod.price.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onSelectProduct(prod)}
                          className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
                          title="View Live Listing"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
                <h2 className="text-base font-bold text-zinc-900 dark:text-white font-brand">Campus Fulfillment Orders</h2>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">{vendorOrders.length} orders total</span>
              </div>

              <div className="space-y-3">
                {vendorOrders.map(order => (
                  <div key={order.id} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 space-y-3 shadow-xs text-xs transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                      <div>
                        <span className="font-mono font-bold text-zinc-900 dark:text-white text-sm">{order.id}</span>
                        <span className="text-zinc-400 ml-2">{order.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-zinc-500 dark:text-zinc-400">Status:</span>
                        <button
                          onClick={() => handleToggleOrderStatus(order.id)}
                          className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-colors cursor-pointer ${
                            order.status === 'Delivered'
                              ? 'bg-orange-100 dark:bg-orange-950/40 text-orange-800 dark:text-orange-300'
                              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200'
                          }`}
                          title="Click to toggle order status"
                        >
                          {order.status} (Click to toggle)
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-zinc-600 dark:text-zinc-400">
                      <div>
                        <span className="text-zinc-400 block text-[11px]">Customer & Contact:</span>
                        <span className="font-semibold text-zinc-900 dark:text-white">{order.customerName}</span>
                        <span className="block text-zinc-500">{order.momoPhone}</span>
                      </div>
                      <div>
                        <span className="text-zinc-400 block text-[11px]">Meetup / Hall:</span>
                        <span className="font-semibold text-zinc-900 dark:text-white">{order.hall}</span>
                      </div>
                      <div className="sm:text-right">
                        <span className="text-zinc-400 block text-[11px]">Order Value:</span>
                        <span className="font-mono font-bold text-zinc-900 dark:text-white text-sm">GH₵ {order.total}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: SALES */}
          {activeTab === 'sales' && (
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-6 shadow-xs text-xs sm:text-sm transition-colors">
              <h2 className="text-base font-bold text-zinc-900 dark:text-white font-brand pb-2 border-b border-zinc-100 dark:border-zinc-800">
                Revenue & Sales Breakdown
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700">
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">Total Collected (Cash/MoMo)</span>
                  <div className="text-2xl font-bold font-mono text-zinc-950 dark:text-white mt-1 tabular-nums">
                    GH₵ {totalSalesGH.toLocaleString()}
                  </div>
                </div>
                <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700">
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">Average Order Value</span>
                  <div className="text-2xl font-bold font-mono text-zinc-950 dark:text-white mt-1 tabular-nums">
                    GH₵ {Math.round(totalSalesGH / vendorOrders.length).toLocaleString()}
                  </div>
                </div>
                <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700">
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">Commission Deductions</span>
                  <div className="text-2xl font-bold font-mono text-orange-600 dark:text-orange-400 mt-1 tabular-nums">
                    GH₵ 0.00 (0% Promo)
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: STORE PROFILE */}
          {activeTab === 'profile' && (
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-6 shadow-xs text-xs sm:text-sm max-w-2xl transition-colors">
              <h2 className="text-base font-bold text-zinc-900 dark:text-white font-brand pb-2 border-b border-zinc-100 dark:border-zinc-800">
                Storefront Details (Dokan Profile)
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Store Name</label>
                  <input
                    type="text"
                    defaultValue="CampusTech Hub KNUST"
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Store Biography</label>
                  <textarea
                    rows={3}
                    defaultValue="Student-run tech store delivering laptops, original phone chargers, earphones, and power banks straight to your hall room or faculty."
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Campus Commercial Location</label>
                  <input
                    type="text"
                    defaultValue="Ayeduase Commercial Gate / Delivery across Conti, Katanga & Gaza"
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-xs"
                  />
                </div>
                <button
                  type="button"
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  Save Store Profile
                </button>
              </div>
            </div>
          )}

          {/* TAB: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-4 max-w-3xl">
              <h2 className="text-base font-bold text-zinc-900 dark:text-white font-brand pb-2 border-b border-zinc-200 dark:border-zinc-800">
                Student Feedback
              </h2>
              {REVIEWS.map(r => (
                <div key={r.id} className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-2 text-xs sm:text-sm transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-zinc-900 dark:text-white">{r.userName}</span>
                      <span className="text-zinc-400 text-xs block">{r.userUniversity}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-zinc-900 dark:text-white">{r.rating}.0</span>
                    </div>
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-300">{r.comment}</p>
                </div>
              ))}
            </div>
          )}

          {/* TAB: SETTINGS & DOKAN */}
          {activeTab === 'settings' && (
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-6 shadow-xs max-w-2xl text-xs sm:text-sm transition-colors">
              <h2 className="text-base font-bold text-zinc-900 dark:text-white font-brand pb-2 border-b border-zinc-100 dark:border-zinc-800">
                Payment Payouts & Dokan API Connector
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">MTN MoMo or Telecel Cash Number for Direct Payouts</label>
                  <input
                    type="tel"
                    defaultValue="+233 24 412 8901"
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-xs"
                  />
                </div>

                <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 space-y-2">
                  <span className="text-xs font-bold text-zinc-900 dark:text-white block">WordPress / Dokan API Endpoint Ready</span>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    This frontend architecture stores all vendor states in standard models aligned with Dokan REST endpoints (<code className="text-orange-600 dark:text-orange-400">/wp-json/dokan/v1/stores</code> and <code className="text-orange-600 dark:text-orange-400">/wp-json/wc/v3/products</code>).
                  </p>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ADD PRODUCT MODAL */}
      <Modal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        title="Add New Product to CampusStore"
        maxWidth="lg"
      >
        <form onSubmit={handleAddProduct} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Product Title</label>
            <input
              type="text"
              required
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              placeholder="e.g. Scientific Calculator or College Hoodie"
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 text-xs focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Price (GH₵)</label>
              <input
                type="number"
                required
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                placeholder="250"
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-xs focus:outline-none focus:border-orange-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Category</label>
              <select
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value as any })}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-xs focus:outline-none focus:border-orange-500"
              >
                <option value="Electronics">Electronics</option>
                <option value="Fashion">Fashion</option>
                <option value="Food">Food</option>
                <option value="Books">Books</option>
                <option value="Beauty">Beauty</option>
                <option value="Accessories">Accessories</option>
                <option value="School Supplies">School Supplies</option>
                <option value="Services">Services</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Stock Quantity</label>
              <input
                type="number"
                required
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                placeholder="10"
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-xs focus:outline-none focus:border-orange-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Item Condition</label>
              <select
                value={newProduct.condition}
                onChange={(e) => setNewProduct({ ...newProduct, condition: e.target.value as any })}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-xs focus:outline-none focus:border-orange-500"
              >
                <option value="Brand New">Brand New</option>
                <option value="Gently Used">Gently Used</option>
                <option value="Refurbished">Refurbished</option>
                <option value="Handmade">Handmade</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Product Description</label>
            <textarea
              rows={3}
              required
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              placeholder="Detailed description, campus pickup instructions, warranty info..."
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 text-xs focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddProductOpen(false)}
              className="px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
            >
              Publish Product
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
