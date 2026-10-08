import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedOption?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
  selectedDeliveryHall: string;
  setSelectedDeliveryHall: (hall: string) => void;
  discountCode: string;
  discountAmount: number;
  applyDiscountCode: (code: string) => boolean;
  toastMessage: string | null;
  dismissToast: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'campusbuy_cart_items';
const HALL_STORAGE_KEY = 'campusbuy_selected_hall';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [selectedDeliveryHall, setSelectedDeliveryHall] = useState<string>(() => {
    try {
      return localStorage.getItem(HALL_STORAGE_KEY) || 'Unity Hall (Conti)';
    } catch {
      return 'Unity Hall (Conti)';
    }
  });

  const [discountCode, setDiscountCode] = useState<string>('');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync with LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [items]);

  useEffect(() => {
    try {
      localStorage.setItem(HALL_STORAGE_KEY, selectedDeliveryHall);
    } catch (e) {
      console.error('Failed to save hall to localStorage', e);
    }
  }, [selectedDeliveryHall]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(prev => (prev === message ? null : prev));
    }, 3000);
  };

  const dismissToast = () => setToastMessage(null);

  const addToCart = (product: Product, quantity: number = 1, selectedOption?: string) => {
    setItems(prevItems => {
      const existingIndex = prevItems.findIndex(i => i.product.id === product.id);
      if (existingIndex > -1) {
        const next = [...prevItems];
        const newQty = next[existingIndex].quantity + quantity;
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: Math.min(newQty, product.stock)
        };
        return next;
      } else {
        return [...prevItems, { product, quantity: Math.min(quantity, product.stock), selectedOption }];
      }
    });
    showToast(`Added "${product.name.slice(0, 32)}..." to your bag`);
  };

  const removeFromCart = (productId: string) => {
    setItems(prev => prev.filter(i => i.product.id !== productId));
    showToast('Item removed from cart');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems(prev =>
      prev.map(i => {
        if (i.product.id === productId) {
          return { ...i, quantity: Math.min(quantity, i.product.stock) };
        }
        return i;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    setDiscountAmount(0);
    setDiscountCode('');
  };

  const applyDiscountCode = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'CAMPUS10' || cleanCode === 'FRESHER2026') {
      setDiscountCode(cleanCode);
      setDiscountAmount(15); // GH₵ 15 student discount
      showToast('GH₵ 15 campus promo code applied!');
      return true;
    }
    showToast('Invalid promo code. Try "CAMPUS10"');
    return false;
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  // Estimated campus delivery fee: GH₵ 5 flat within campus halls, or 0 if empty
  const deliveryFee = itemCount > 0 ? 5 : 0;
  const total = Math.max(0, subtotal + deliveryFee - discountAmount);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        deliveryFee,
        total,
        selectedDeliveryHall,
        setSelectedDeliveryHall,
        discountCode,
        discountAmount,
        applyDiscountCode,
        toastMessage,
        dismissToast
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
