import React, { useState } from 'react';
import { Home, Store, ShoppingBag, Sparkles, Search, Cake, Heart, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Header: React.FC = () => {
  const {
    activeScreen,
    setActiveScreen,
    cartTotalCount,
    searchQuery,
    setSearchQuery,
    setIsAssistantOpen,
    wishlist
  } = useApp();

  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveScreen('products');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF6F2]/95 backdrop-blur-md border-b border-[#EAE0D5] transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <button
            id="header-logo-btn"
            onClick={() => { setActiveScreen('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
          >
            <div className="w-10 h-10 rounded-full bg-[#F3DEDC] flex items-center justify-center text-[#7A5A53] group-hover:bg-[#E8C8C4] transition-colors shadow-xs">
              <Cake className="w-6 h-6 stroke-[1.75]" />
            </div>
            <span className="font-serif-display text-2xl sm:text-3xl font-bold tracking-tight text-[#3D312E] group-hover:text-[#5C423E] transition-colors">
              SweetSpot
            </span>
          </button>

          {/* Center Search Input (Desktop) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center relative max-w-xs w-full"
          >
            <Search className="w-4 h-4 absolute left-3 text-[#A89893]" />
            <input
              id="header-search-input"
              type="text"
              placeholder="Find your treat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-[#F3ECE5] text-[#3D312E] placeholder-[#A89893] text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-[#C28B87]/50 transition-all border border-transparent hover:border-[#E2D5C9]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 text-[#A89893] hover:text-[#3D312E]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Navigation Items (Matching Screenshot Header) */}
          <nav className="flex items-center gap-1 sm:gap-3 md:gap-6">
            
            {/* Home */}
            <button
              id="header-nav-home"
              onClick={() => { setActiveScreen('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer ${
                activeScreen === 'home'
                  ? 'text-[#3D312E] bg-[#F0E4DA] font-bold'
                  : 'text-[#8A7973] hover:text-[#3D312E] hover:bg-[#F5ECE4]'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>HOME</span>
            </button>

            {/* Products */}
            <button
              id="header-nav-products"
              onClick={() => { setActiveScreen('products'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer ${
                activeScreen === 'products'
                  ? 'text-[#3D312E] bg-[#F0E4DA] font-bold'
                  : 'text-[#8A7973] hover:text-[#3D312E] hover:bg-[#F5ECE4]'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>PRODUCTS</span>
            </button>

            {/* Cart with Badge */}
            <button
              id="header-nav-cart"
              onClick={() => { setActiveScreen('cart'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`relative flex flex-col sm:flex-row items-center gap-1 sm:gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer ${
                activeScreen === 'cart'
                  ? 'text-[#3D312E] bg-[#F0E4DA] font-bold'
                  : 'text-[#8A7973] hover:text-[#3D312E] hover:bg-[#F5ECE4]'
              }`}
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4" />
                {cartTotalCount > 0 && (
                  <span className="absolute -top-2 -right-2.5 bg-[#C25B5B] text-white text-[10px] font-bold rounded-full h-4 min-w-4 px-1 flex items-center justify-center border-2 border-[#FAF6F2] animate-scale-in">
                    {cartTotalCount}
                  </span>
                )}
              </div>
              <span>CART</span>
            </button>

            {/* AI Assistant Button */}
            <button
              id="header-nav-assistant"
              onClick={() => setIsAssistantOpen(true)}
              className="flex flex-col sm:flex-row items-center gap-1 sm:gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase text-[#7A423D] bg-[#F7E6E5] hover:bg-[#F0D5D3] transition-all cursor-pointer border border-[#E9C3C0] shadow-xs hover:shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-[#B85B55] animate-pulse" />
              <span className="hidden sm:inline">ASSISTANT</span>
              <span className="sm:hidden">AI</span>
            </button>

            {/* Wishlist Indicator */}
            {wishlist.length > 0 && (
              <button
                id="header-nav-wishlist"
                onClick={() => { setActiveScreen('products'); }}
                className="hidden lg:flex items-center gap-1 text-[#8A7973] hover:text-[#C25B5B] text-xs font-medium px-2 py-1 transition-colors"
                title={`${wishlist.length} saved favorites`}
              >
                <Heart className="w-4 h-4 text-[#C25B5B] fill-[#C25B5B]" />
                <span>({wishlist.length})</span>
              </button>
            )}

            {/* Mobile Search Toggle */}
            <button
              id="header-mobile-search-toggle"
              type="button"
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="md:hidden p-2 text-[#8A7973] hover:text-[#3D312E]"
            >
              <Search className="w-5 h-5" />
            </button>

          </nav>
        </div>

        {/* Mobile Search Expanded */}
        {showMobileSearch && (
          <div className="md:hidden pb-4">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-[#A89893]" />
              <input
                id="mobile-search-input"
                type="text"
                placeholder="Find your treat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-[#F3ECE5] text-[#3D312E] placeholder-[#A89893] text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-[#C28B87]"
              />
            </form>
          </div>
        )}

      </div>
    </header>
  );
};
