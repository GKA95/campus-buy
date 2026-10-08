import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ProductImage } from '../components/common/ProductImage';
import { Modal } from '../components/common/Modal';
import { UNIVERSITIES } from '../data/mockData';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Truck, 
  Tag, 
  CheckCircle2
} from 'lucide-react';

interface CartPageProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
  onSelectProduct: (product: any) => void;
  checkoutOpenInitially?: boolean;
}

export const CartPage: React.FC<CartPageProps> = ({
  onNavigate,
  onSelectProduct,
  checkoutOpenInitially = false
}) => {
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    deliveryFee,
    total,
    selectedDeliveryHall,
    setSelectedDeliveryHall,
    discountCode,
    discountAmount,
    applyDiscountCode
  } = useCart();

  const { user } = useAuth();

  const [promoInput, setPromoInput] = useState('');
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(checkoutOpenInitially);
  const [orderCompleted, setOrderCompleted] = useState<any>(null);

  // Checkout form
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '+233 55 123 4567');
  const [customerUniversity, setCustomerUniversity] = useState(user?.universityId || 'knust');
  const [roomNumber, setRoomNumber] = useState(user?.roomNumber || 'Room 214');
  const [paymentMethod, setPaymentMethod] = useState<'Cash on Delivery / Meetup' | 'Mobile Money (MTN/Telecel)'>('Cash on Delivery / Meetup');

  const selectedUniObj = UNIVERSITIES.find(u => u.id === customerUniversity) || UNIVERSITIES[0];

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoInput.trim()) {
      applyDiscountCode(promoInput);
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedOrder = {
      id: `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      items: [...items],
      total,
      deliveryHall: selectedDeliveryHall,
      roomNumber,
      university: selectedUniObj.shortName,
      customerName,
      customerPhone,
      paymentMethod,
      date: 'Just now'
    };

    setOrderCompleted(generatedOrder);
    clearCart();
  };

  if (items.length === 0 && !orderCompleted) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mx-auto text-zinc-400">
          <ShoppingBag className="w-10 h-10 text-orange-500" />
        </div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white font-brand">Your Campus Bag is Empty</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
          You haven't added any campus items to your shopping bag yet. Explore peer sellers and dorm supplies available at your institution.
        </p>
        <button
          onClick={() => onNavigate('products')}
          className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-black font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md"
        >
          Explore Campus Marketplace
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white font-brand">
            Your Shopping Bag
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Review your selected items and schedule on-campus hall delivery.
          </p>
        </div>

        <button
          onClick={() => onNavigate('products')}
          className="text-xs font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-500 flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Continue Shopping</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Cart Items Table / List (Cols 8) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 divide-y divide-zinc-100 dark:divide-zinc-800 overflow-hidden shadow-xs">
            {items.map((item) => (
              <div key={item.product.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                
                {/* Product info */}
                <div 
                  className="flex items-center gap-4 cursor-pointer flex-1"
                  onClick={() => onSelectProduct(item.product)}
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-black shrink-0 border border-zinc-200 dark:border-zinc-800">
                    <ProductImage
                      category={item.product.category}
                      title={item.product.name}
                      src={item.product.image}
                    />
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider block">
                      {item.product.universityName} · {item.product.vendorName}
                    </span>
                    <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-xs sm:text-sm hover:text-orange-500 transition-colors line-clamp-1">
                      {item.product.name}
                    </h3>
                    <div className="text-xs font-bold text-zinc-950 dark:text-white font-mono tabular-nums">
                      GH₵ {item.product.price.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Quantity Controls & Total */}
                <div className="flex items-center justify-between w-full sm:w-auto sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center border border-zinc-200 dark:border-zinc-700 rounded-lg p-1 bg-zinc-50 dark:bg-zinc-800">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-7 h-7 rounded flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-700"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold font-mono tabular-nums text-zinc-900 dark:text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-7 h-7 rounded flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-700"
                      disabled={item.quantity >= item.product.stock}
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="text-right">
                    <span className="font-bold text-sm text-zinc-950 dark:text-white font-mono tabular-nums block">
                      GH₵ {(item.product.price * item.quantity).toLocaleString()}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-[11px] text-zinc-400 hover:text-rose-500 transition-colors flex items-center gap-1 mt-0.5 ml-auto"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* Delivery Note */}
          <div className="p-4 bg-orange-50 dark:bg-orange-950/30 rounded-2xl border border-orange-200/80 dark:border-orange-800/50 flex items-start gap-3 text-xs text-orange-950 dark:text-orange-200">
            <Truck className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Flat Campus Delivery: GH₵ 5.00</span>
              <span>
                Orders are hand-delivered directly to your hostel porter lodge, room, or faculty meeting point with cash or MoMo on arrival.
              </span>
            </div>
          </div>
        </div>

        {/* Order Summary Sidebar (Cols 4) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 space-y-5 shadow-xs">
            <h2 className="text-base font-bold text-zinc-900 dark:text-white font-brand pb-3 border-b border-zinc-100 dark:border-zinc-800">
              Order Summary
            </h2>

            {/* Subtotal & Delivery details */}
            <div className="space-y-3 text-xs text-zinc-600 dark:text-zinc-400">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-mono font-bold text-zinc-900 dark:text-white tabular-nums">
                  GH₵ {subtotal.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1">
                  <span>Hostel Delivery</span>
                  <span className="text-[10px] text-zinc-400">(Campus Hall)</span>
                </span>
                <span className="font-mono font-bold text-zinc-900 dark:text-white tabular-nums">
                  GH₵ {deliveryFee.toFixed(2)}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-orange-600 dark:text-orange-400 font-semibold">
                  <span>Student Promo Discount ({discountCode})</span>
                  <span className="font-mono tabular-nums">- GH₵ {discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-baseline text-zinc-900 dark:text-white">
                <span className="text-sm font-bold">Estimated Total</span>
                <span className="text-xl font-extrabold font-mono tabular-nums text-zinc-950 dark:text-white">
                  GH₵ {total.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="pt-2">
              <div className="flex items-center gap-1.5">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Promo (e.g. CAMPUS10)"
                    className="w-full pl-8 pr-2 py-1.5 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:border-orange-500 uppercase"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-zinc-900 dark:bg-zinc-800 text-white rounded-lg text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-700 transition-colors"
                >
                  Apply
                </button>
              </div>
            </form>

            {/* Checkout CTA Button */}
            <button
              onClick={() => setIsCheckoutModalOpen(true)}
              className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-black rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 active:scale-95"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center">
              <span className="text-[11px] text-zinc-400 dark:text-zinc-500 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-orange-500" />
                <span>Zero pre-payment risk · Inspect before you pay</span>
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* CHECKOUT MODAL */}
      <Modal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        title="Complete Your Campus Order"
        maxWidth="lg"
      >
        <form onSubmit={handlePlaceOrder} className="space-y-4 text-xs sm:text-sm">
          
          <div className="p-3 bg-zinc-50 dark:bg-zinc-800/60 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs">
            <span className="text-zinc-500 dark:text-zinc-400 block text-[11px]">Payable on Delivery:</span>
            <span className="text-lg font-bold text-zinc-950 dark:text-white font-mono">GH₵ {total.toLocaleString()}</span>
            <span className="text-zinc-500 dark:text-zinc-400 ml-2">({items.length} items)</span>
          </div>

          {/* Student Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Your Full Name</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Kwame Mensah"
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-xs focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Phone Number (MTN/Telecel)</label>
              <input
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+233 55 123 4567"
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-xs focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          {/* Campus & Hall Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">University Campus</label>
              <select
                value={customerUniversity}
                onChange={(e) => setCustomerUniversity(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-xs focus:outline-none focus:border-orange-500"
              >
                {UNIVERSITIES.map(u => (
                  <option key={u.id} value={u.id}>{u.shortName}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Hall / Hostel</label>
              <select
                value={selectedDeliveryHall}
                onChange={(e) => setSelectedDeliveryHall(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-xs focus:outline-none focus:border-orange-500"
              >
                {selectedUniObj.popularHalls.map((hall, idx) => (
                  <option key={idx} value={hall}>{hall}</option>
                ))}
                <option value="Off-Campus Private Hostel">Off-Campus Private Hostel</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Room Number / Porter Meeting Spot</label>
            <input
              type="text"
              required
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              placeholder="e.g. Block B, Room 214 or Porter Lodge"
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-xs focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Payment Method</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('Cash on Delivery / Meetup')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  paymentMethod === 'Cash on Delivery / Meetup'
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/40 text-orange-950 dark:text-orange-300 font-bold'
                    : 'border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                }`}
              >
                <span className="text-xs font-bold block">Cash on Meetup</span>
                <span className="text-[10px] text-zinc-500 dark:text-zinc-400">Inspect item then pay</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Mobile Money (MTN/Telecel)')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  paymentMethod === 'Mobile Money (MTN/Telecel)'
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/40 text-orange-950 dark:text-orange-300 font-bold'
                    : 'border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                }`}
              >
                <span className="text-xs font-bold block">Mobile Money</span>
                <span className="text-[10px] text-zinc-500 dark:text-zinc-400">MTN MoMo / Telecel</span>
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsCheckoutModalOpen(false)}
              className="px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-black rounded-lg text-xs font-bold shadow-sm"
            >
              Confirm Campus Order
            </button>
          </div>
        </form>
      </Modal>

      {/* ORDER CONFIRMATION MODAL */}
      <Modal
        isOpen={!!orderCompleted}
        onClose={() => setOrderCompleted(null)}
        title="Order Placed Successfully! 🎉"
      >
        {orderCompleted && (
          <div className="space-y-4 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
            <div className="text-center py-2">
              <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-zinc-900 dark:text-white text-base">Your order has been recorded</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Order ID: <strong className="font-mono text-orange-600 dark:text-orange-400">{orderCompleted.id}</strong></p>
            </div>

            <div className="p-4 bg-zinc-50 dark:bg-zinc-800/60 rounded-xl border border-zinc-200 dark:border-zinc-700 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Delivery Hall:</span>
                <span className="font-semibold text-zinc-900 dark:text-white">{orderCompleted.deliveryHall} ({orderCompleted.roomNumber})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">University:</span>
                <span className="font-semibold text-zinc-900 dark:text-white">{orderCompleted.university}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Recipient Phone:</span>
                <span className="font-semibold text-zinc-900 dark:text-white">{orderCompleted.customerPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Payment:</span>
                <span className="font-semibold text-zinc-900 dark:text-white">{orderCompleted.paymentMethod}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white font-bold">
                <span>Total Amount:</span>
                <span className="font-mono text-orange-600 dark:text-orange-400">GH₵ {orderCompleted.total.toLocaleString()}</span>
              </div>
            </div>

            <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center leading-relaxed">
              The campus vendor has received your order request and will reach out via WhatsApp/call shortly to confirm the meetup time at your hall.
            </p>

            <div className="pt-2 flex justify-center">
              <button
                onClick={() => {
                  setOrderCompleted(null);
                  onNavigate('student-dashboard');
                }}
                className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-black rounded-xl text-xs font-bold"
              >
                View in Student Dashboard
              </button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};
