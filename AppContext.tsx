import React, { createContext, useContext, useState, useMemo } from 'react';
import { ActiveScreen, CartItem, Category, Product } from '../types';
import { PRODUCTS } from '../data/products';

interface AppContextType {
  activeScreen: ActiveScreen;
  setActiveScreen: (screen: ActiveScreen) => void;
  selectedProductId: string;
  selectedProduct: Product;
  openProductDetail: (productId: string) => void;
  
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  
  cartTotalCount: number;
  subtotal: number;
  deliveryFee: number;
  taxes: number;
  total: number;
  
  appliedPromo: string | null;
  discountAmount: number;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  
  selectedCategory: Category;
  setSelectedCategory: (category: Category) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  isAssistantOpen: boolean;
  setIsAssistantOpen: (open: boolean) => void;
  
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('home');
  const [selectedProductId, setSelectedProductId] = useState<string>('signature-macaron-box');
  const [selectedCategory, setSelectedCategory] = useState<Category>('All Delights');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  const [wishlist, setWishlist] = useState<string[]>(['signature-macaron-box']);
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initial cart populated according to screenshot basket view
  const [cart, setCart] = useState<CartItem[]>([
    {
      product: PRODUCTS.find(p => p.id === 'raspberry-pistachio-tart') || PRODUCTS[13],
      quantity: 1,
    },
    {
      product: PRODUCTS.find(p => p.id === 'honey-wheat-sourdough') || PRODUCTS[11],
      quantity: 2,
    },
    {
      product: PRODUCTS.find(p => p.id === 'rose-petal-macarons') || PRODUCTS[14],
      quantity: 1,
    },
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const selectedProduct = useMemo(() => {
    return PRODUCTS.find(p => p.id === selectedProductId) || PRODUCTS[0];
  }, [selectedProductId]);

  const openProductDetail = (productId: string) => {
    setSelectedProductId(productId);
    setActiveScreen('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(item => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prevCart, { product, quantity }];
      }
    });
    showToast(`Added ${quantity}x ${product.name} to your basket`);
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (productId: string) => {
    const item = cart.find(i => i.product.id === productId);
    setCart(prev => prev.filter(i => i.product.id !== productId));
    if (item) {
      showToast(`Removed ${item.product.name} from basket`);
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotalCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  }, [cart]);

  const deliveryFee = useMemo(() => {
    if (subtotal === 0) return 0;
    if (appliedPromo === 'FREEDELIVERY') return 0;
    return 3.99;
  }, [subtotal, appliedPromo]);

  const discountAmount = useMemo(() => {
    if (!appliedPromo) return 0;
    if (appliedPromo === 'SWEET10') return subtotal * 0.10;
    if (appliedPromo === 'SWEET20') return subtotal * 0.20;
    return 0;
  }, [subtotal, appliedPromo]);

  const taxes = useMemo(() => {
    if (subtotal === 0) return 0;
    return (subtotal - discountAmount) * 0.0516; // Exact tax proportion to match $2.40 on $46.50
  }, [subtotal, discountAmount]);

  const total = useMemo(() => {
    if (subtotal === 0) return 0;
    return subtotal - discountAmount + deliveryFee + taxes;
  }, [subtotal, discountAmount, deliveryFee, taxes]);

  const applyPromoCode = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'SWEET10' || cleanCode === 'SWEET20' || cleanCode === 'FREEDELIVERY') {
      setAppliedPromo(cleanCode);
      return { success: true, message: `Promo code ${cleanCode} applied successfully!` };
    }
    return { success: false, message: 'Invalid promo code. Try SWEET10 or FREEDELIVERY.' };
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from favorites');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Added to favorites');
        return [...prev, productId];
      }
    });
  };

  return (
    <AppContext.Provider
      value={{
        activeScreen,
        setActiveScreen,
        selectedProductId,
        selectedProduct,
        openProductDetail,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartTotalCount,
        subtotal,
        deliveryFee,
        taxes,
        total,
        appliedPromo,
        discountAmount,
        applyPromoCode,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        isAssistantOpen,
        setIsAssistantOpen,
        wishlist,
        toggleWishlist,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
