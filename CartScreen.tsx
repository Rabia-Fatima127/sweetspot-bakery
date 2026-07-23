import React, { useState } from 'react';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Lock, Sparkles, CheckCircle, Tag } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PRODUCTS, FALLBACK_IMAGE } from '../data/products';
import { Product } from '../types';

export const CartScreen: React.FC = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    deliveryFee,
    taxes,
    total,
    appliedPromo,
    discountAmount,
    applyPromoCode,
    addToCart,
    setActiveScreen,
    setIsAssistantOpen,
    openProductDetail
  } = useApp();

  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ success: boolean; text: string } | null>(null);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromoCode(promoInput);
    setPromoMessage({ success: res.success, text: res.message });
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setIsOrderPlaced(true);
    clearCart();
  };

  // Recommendations for "Complete your order" section
  const recommendations: Product[] = [
    PRODUCTS.find(p => p.id === 'vanilla-latte') || PRODUCTS[15],
    PRODUCTS.find(p => p.id === 'caramel-brownie') || PRODUCTS[16],
    PRODUCTS.find(p => p.id === 'midnight-sea-salt') || PRODUCTS[7],
  ];

  if (isOrderPlaced) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-[#E2F0D9] text-[#3D7A4D] rounded-full flex items-center justify-center mx-auto shadow-md animate-scale-in">
          <CheckCircle className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8A7973]">ORDER #SS-84920</span>
          <h1 className="font-serif-display text-4xl font-bold text-[#3D312E]">Thank You for Your Order!</h1>
          <p className="text-[#6C5C57] text-sm max-w-md mx-auto">
            Your artisanal delights are being freshly handcrafted by our pastry chefs. We will send a confirmation notification shortly.
          </p>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            id="order-placed-continue-btn"
            onClick={() => { setIsOrderPlaced(false); setActiveScreen('products'); }}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#5C4A47] text-white font-medium hover:bg-[#3D312E] transition-all cursor-pointer shadow-sm"
          >
            Explore More Treats
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8 pb-28">
      
      {/* Title */}
      <div className="flex items-center justify-between border-b border-[#EAE0D5] pb-4">
        <div>
          <h1 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#3D312E]">
            Your Basket
          </h1>
          <p className="text-xs text-[#8A7973] mt-1">
            {cart.length === 0 ? 'Your basket is currently empty' : `${cart.length} unique items selected`}
          </p>
        </div>

        {cart.length > 0 && (
          <button
            id="cart-clear-all-btn"
            onClick={clearCart}
            className="text-xs font-medium text-[#C25B5B] hover:underline cursor-pointer"
          >
            Clear Basket
          </button>
        )}
      </div>

      {/* Cart Items List (Matching Screenshots 4 & 5) */}
      {cart.length === 0 ? (
        <div className="text-center py-16 bg-white/80 rounded-3xl border border-[#EAE0D5] p-8 space-y-4">
          <div className="w-16 h-16 bg-[#F8ECE9] rounded-full flex items-center justify-center text-[#8A7973] mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="font-serif-display text-2xl font-bold text-[#3D312E]">
            Your basket is empty
          </h2>
          <p className="text-sm text-[#7A6A65] max-w-sm mx-auto">
            Discover our fresh macarons, croissants, custom cakes, and artisanal pastries!
          </p>
          <button
            id="cart-empty-browse-btn"
            onClick={() => setActiveScreen('products')}
            className="px-8 py-3 rounded-full bg-[#5C4A47] text-white text-sm font-semibold hover:bg-[#3D312E] transition-all cursor-pointer shadow-xs"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {cart.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="bg-white/90 rounded-2xl p-4 sm:p-5 border border-[#EFE5DC] shadow-2xs flex items-center justify-between gap-4 transition-all hover:border-[#E2D5C9]"
            >
              {/* Product Thumbnail & Details */}
              <div
                onClick={() => openProductDetail(product.id)}
                className="flex items-center gap-3 sm:gap-4 flex-1 cursor-pointer group"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover group-hover:scale-105 transition-transform"
                />

                <div>
                  <h3 className="font-serif-display text-base sm:text-lg font-bold text-[#3D312E] group-hover:text-[#7A5A53] transition-colors leading-snug">
                    {product.name}
                  </h3>
                  <p className="text-xs text-[#8A7973]">
                    {product.subtitle || product.category}
                  </p>
                  <p className="text-sm font-bold text-[#5C4A47] mt-1">
                    ${product.price.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Quantity Selector & Trash */}
              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
                <div className="flex items-center gap-3 bg-[#F9ECE8] px-3 py-1.5 rounded-full border border-[#EBDAD4]">
                  <button
                    id={`cart-qty-minus-${product.id}`}
                    onClick={() => updateCartQuantity(product.id, quantity - 1)}
                    className="text-[#3D312E] hover:text-[#C25B5B] p-0.5 cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-serif-display text-sm font-bold text-[#3D312E] min-w-[16px] text-center">
                    {quantity}
                  </span>
                  <button
                    id={`cart-qty-plus-${product.id}`}
                    onClick={() => updateCartQuantity(product.id, quantity + 1)}
                    className="text-[#3D312E] hover:text-[#5C4A47] p-0.5 cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  id={`cart-delete-${product.id}`}
                  onClick={() => removeFromCart(product.id)}
                  className="text-[#A89893] hover:text-[#C25B5B] p-1 transition-colors cursor-pointer"
                  title="Remove item"
                  aria-label={`Remove ${product.name}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* "Complete your order" Cross-Sells Section (Matching Screenshots 4 & 5) */}
      <div className="space-y-3 pt-2">
        <h3 className="font-serif-display text-xl font-bold text-[#3D312E]">
          Complete your order
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              onClick={() => openProductDetail(rec.id)}
              className="bg-white/80 rounded-2xl p-3 border border-[#EFE5DC] hover:border-[#C28B87] transition-all cursor-pointer flex flex-col justify-between group shadow-2xs"
            >
              <div className="space-y-2">
                <img
                  src={rec.image}
                  alt={rec.name}
                  onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                  className="w-full h-24 rounded-xl object-cover group-hover:scale-105 transition-transform"
                />
                <div>
                  <h4 className="font-serif-display font-bold text-sm text-[#3D312E] group-hover:text-[#7A5A53] line-clamp-1">
                    {rec.name}
                  </h4>
                  <p className="text-xs text-[#7A6A65] font-semibold">
                    ${rec.price.toFixed(2)}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(rec, 1);
                }}
                className="mt-2 w-full py-1.5 rounded-xl bg-[#F8ECE9] hover:bg-[#5C4A47] hover:text-white text-[#3D312E] text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary Box (Matching Screenshot 5) */}
      {cart.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EFE5DC] shadow-sm space-y-6">
          <h2 className="font-serif-display text-2xl font-bold text-[#3D312E]">
            Order Summary
          </h2>

          <div className="space-y-3 text-sm text-[#6C5C57]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-[#3D312E]">${subtotal.toFixed(2)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-[#3D7A4D]">
                <span>Discount ({appliedPromo})</span>
                <span className="font-bold">-${discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span className="font-bold text-[#3D312E]">
                {deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Taxes</span>
              <span className="font-bold text-[#3D312E]">${taxes.toFixed(2)}</span>
            </div>

            <div className="pt-3 border-t border-[#EAE0D5] flex justify-between items-baseline">
              <span className="font-serif-display text-xl font-bold text-[#3D312E]">Total</span>
              <span className="font-serif-display text-2xl sm:text-3xl font-bold text-[#3D312E]">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Promo Code Input */}
          <form onSubmit={handleApplyPromo} className="space-y-2">
            <div className="flex items-center gap-2 bg-[#FAF6F2] p-1.5 rounded-2xl border border-[#EAE0D5]">
              <Tag className="w-4 h-4 text-[#A89893] ml-2" />
              <input
                id="cart-promo-input"
                type="text"
                placeholder="Promo code (e.g. SWEET10)"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                className="flex-1 bg-transparent text-sm text-[#3D312E] placeholder-[#A89893] focus:outline-none px-2"
              />
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#5C4A47] hover:bg-[#3D312E] text-white text-xs font-semibold cursor-pointer transition-colors"
              >
                Apply
              </button>
            </div>
            {promoMessage && (
              <p className={`text-xs ${promoMessage.success ? 'text-[#3D7A4D]' : 'text-[#C25B5B]'}`}>
                {promoMessage.text}
              </p>
            )}
          </form>

          {/* Checkout Button */}
          <div className="space-y-3 pt-2">
            <button
              id="cart-proceed-checkout-btn"
              onClick={handleCheckout}
              className="w-full py-4 rounded-2xl bg-[#7A6360] hover:bg-[#5C4A47] text-white font-bold text-base transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-xs text-[#A89893]">
              <Lock className="w-3.5 h-3.5" />
              <span>Secure checkout powered by SweetSpot</span>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
