import React, { useState, useEffect } from 'react';
import { ArrowLeft, Heart, Share2, Plus, Minus, ShoppingCart, Check, Info, Gift, Box, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PRODUCTS, FALLBACK_IMAGE } from '../data/products';
import { Product } from '../types';

export const ProductDetailScreen: React.FC = () => {
  const {
    selectedProduct,
    openProductDetail,
    addToCart,
    setActiveScreen,
    wishlist,
    toggleWishlist,
    showToast
  } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  // Reset quantity when selected product changes
  useEffect(() => {
    setQuantity(1);
    setIsAdded(false);
  }, [selectedProduct.id]);

  const isFavorite = wishlist.includes(selectedProduct.id);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: selectedProduct.name,
        text: selectedProduct.description,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard!');
    }
  };

  const handleAddToCart = () => {
    addToCart(selectedProduct, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  // Find paired items or fallback
  const pairedProducts: Product[] = (selectedProduct.pairsWithIds || ['vanilla-latte', 'raspberry-pistachio-tart'])
    .map(id => PRODUCTS.find(p => p.id === id))
    .filter((p): p is Product => p !== undefined)
    .slice(0, 2);

  return (
    <div className="min-h-screen pb-32">
      
      {/* Top Floating Nav Bar (Back, Heart, Share) */}
      <div className="sticky top-20 z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 flex items-center justify-between pointer-events-none">
        <button
          id="detail-back-btn"
          onClick={() => setActiveScreen('products')}
          className="pointer-events-auto w-10 h-10 rounded-full bg-white/90 backdrop-blur-md border border-[#E8DAD0] shadow-md flex items-center justify-center text-[#3D312E] hover:bg-white transition-all cursor-pointer"
          aria-label="Go back to products"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="pointer-events-auto flex items-center gap-2">
          <button
            id="detail-wishlist-btn"
            onClick={() => toggleWishlist(selectedProduct.id)}
            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md border border-[#E8DAD0] shadow-md flex items-center justify-center text-[#3D312E] hover:bg-white transition-all cursor-pointer"
            aria-label="Toggle wishlist"
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-[#C25B5B] text-[#C25B5B]' : 'text-[#3D312E]'}`} />
          </button>

          <button
            id="detail-share-btn"
            onClick={handleShare}
            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md border border-[#E8DAD0] shadow-md flex items-center justify-center text-[#3D312E] hover:bg-white transition-all cursor-pointer"
            aria-label="Share product"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        
        {/* Banner Hero Image */}
        <div className="w-full h-[320px] sm:h-[420px] md:h-[480px] rounded-3xl overflow-hidden shadow-lg bg-[#F2E8DF] relative">
          <img
            src={selectedProduct.bannerImage || selectedProduct.image}
            alt={selectedProduct.name}
            onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content Sheet */}
        <div className="bg-[#FAF6F2] rounded-3xl pt-8 sm:pt-10 space-y-8">
          
          {/* Header Title & Price */}
          <div className="space-y-3">
            <span className="inline-block px-3 py-1 rounded-full bg-[#F7E6E5] text-[#7A3E39] text-xs font-bold uppercase tracking-wider">
              {selectedProduct.badge || selectedProduct.tag || 'SIGNATURE SELECTION'}
            </span>

            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <h1 className="font-serif-display text-3xl sm:text-4xl md:text-5xl font-bold text-[#3D312E]">
                {selectedProduct.name}
              </h1>
              <span className="font-serif-display text-2xl sm:text-3xl font-bold text-[#3D312E]">
                ${selectedProduct.price.toFixed(2)}
              </span>
            </div>

            <p className="text-sm sm:text-base text-[#6C5C57] leading-relaxed max-w-3xl">
              {selectedProduct.description}
            </p>
          </div>

          {/* Feature Badges Row (Matching Screenshot 3: Box of 6, Seasonal Flavors, Gift Ready) */}
          <div className="flex flex-wrap items-center gap-3">
            {(selectedProduct.features || ['Signature Recipe', 'Fresh Daily', 'Gift Packaged']).map((feature, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#EAE0D5] text-xs sm:text-sm font-medium text-[#5C4A47] shadow-2xs"
              >
                {i === 0 && <Box className="w-4 h-4 text-[#C28B87]" />}
                {i === 1 && <Sparkles className="w-4 h-4 text-[#C28B87]" />}
                {i >= 2 && <Gift className="w-4 h-4 text-[#C28B87]" />}
                <span>{feature}</span>
              </div>
            ))}
          </div>

          {/* Two Column Grid: Pairs Perfectly With & Ingredients/Care */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left Box: Pairs perfectly with */}
            <div className="bg-[#F9ECE8]/60 border border-[#F0D8D2] rounded-3xl p-6 space-y-4">
              <h3 className="font-serif-display text-lg font-bold text-[#3D312E]">
                Pairs perfectly with
              </h3>

              <div className="space-y-3">
                {pairedProducts.map((pair) => (
                  <div
                    key={pair.id}
                    onClick={() => openProductDetail(pair.id)}
                    className="flex items-center justify-between p-3 rounded-2xl bg-white border border-[#EAE0D5] hover:border-[#C28B87] transition-all cursor-pointer shadow-2xs group"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={pair.image}
                        alt={pair.name}
                        onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div>
                        <h4 className="font-serif-display font-bold text-sm text-[#3D312E] group-hover:text-[#7A5A53] transition-colors">
                          {pair.name}
                        </h4>
                        <p className="text-xs text-[#7A6A65] font-semibold">
                          ${pair.price.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(pair, 1);
                      }}
                      className="w-8 h-8 rounded-full border border-[#D9C8BC] flex items-center justify-center text-[#3D312E] hover:bg-[#5C4A47] hover:text-white hover:border-[#5C4A47] transition-all cursor-pointer"
                      title={`Add ${pair.name} to cart`}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Box: Ingredients & Care / Personalization */}
            <div className="bg-[#F9ECE8]/60 border border-[#F0D8D2] rounded-3xl p-6 space-y-5">
              
              {/* Ingredients & Care */}
              <div className="flex gap-3">
                <div className="p-2 rounded-xl bg-white border border-[#EAE0D5] text-[#5C4A47] h-fit">
                  <Info className="w-5 h-5 text-[#C28B87]" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#3D312E]">
                    INGREDIENTS & CARE
                  </h4>
                  <p className="text-xs sm:text-sm text-[#6C5C57] leading-relaxed">
                    {selectedProduct.ingredients || 'Contains almonds, eggs, and dairy. Best enjoyed within 3 days. Keep refrigerated for freshness.'}
                  </p>
                </div>
              </div>

              {/* Personalization */}
              <div className="flex gap-3 pt-2 border-t border-[#EBDAD4]">
                <div className="p-2 rounded-xl bg-white border border-[#EAE0D5] text-[#5C4A47] h-fit">
                  <Gift className="w-5 h-5 text-[#C28B87]" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#3D312E]">
                    PERSONALIZATION
                  </h4>
                  <p className="text-xs sm:text-sm text-[#6C5C57] leading-relaxed">
                    {selectedProduct.personalization || 'Complimentary gift note included with every signature box purchase.'}
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Bottom Fixed Action Bar (Matching Screenshot 3 Bottom Bar) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#EAE0D5] py-4 shadow-2xl">
        <div className="max-w-3xl mx-auto px-4 flex items-center justify-between gap-4">
          
          {/* Quantity Selector */}
          <div className="flex items-center gap-4 bg-[#F8ECE9] px-4 py-2.5 rounded-full border border-[#E8DAD0]">
            <button
              id="detail-qty-minus"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="text-[#3D312E] hover:text-[#7A3E39] font-bold p-1 cursor-pointer transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-serif-display font-bold text-base min-w-[20px] text-center text-[#3D312E]">
              {quantity}
            </span>
            <button
              id="detail-qty-plus"
              onClick={() => setQuantity(quantity + 1)}
              className="text-[#3D312E] hover:text-[#7A3E39] font-bold p-1 cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Main Action Button */}
          <button
            id="detail-add-to-cart-btn"
            onClick={handleAddToCart}
            className={`flex-1 py-3.5 px-6 rounded-2xl font-bold text-sm sm:text-base transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md ${
              isAdded
                ? 'bg-[#2E3D35] text-white'
                : 'bg-[#635350] hover:bg-[#473937] text-white'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-5 h-5 text-[#88D3A8]" />
                <span>Added to Basket</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5" />
                <span>Add to Cart • ${(selectedProduct.price * quantity).toFixed(2)}</span>
              </>
            )}
          </button>

        </div>
      </div>

    </div>
  );
};
