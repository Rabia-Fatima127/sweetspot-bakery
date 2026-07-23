import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Plus, ArrowRight, Sparkles, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Category, Product } from '../types';
import { PRODUCTS, FALLBACK_IMAGE } from '../data/products';

export const HomeScreen: React.FC = () => {
  const {
    openProductDetail,
    addToCart,
    setActiveScreen,
    setSelectedCategory
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<Category>('Cakes');
  const carouselRef = useRef<HTMLDivElement>(null);
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});

  // Filter products for category pills
  const categories: Category[] = ['Cakes', 'Cupcakes', 'Cookies', 'Brownies', 'Pastries', 'Vegan'];

  const chefSelectionProducts = PRODUCTS.filter(p => p.isChefSelection);

  const displayedProducts = PRODUCTS.filter(p => {
    if (activeCategory === 'Cakes') return p.category === 'Signature Cakes' || p.category === 'Cakes';
    if (activeCategory === 'Cupcakes') return p.category === 'Cupcakes';
    if (activeCategory === 'Cookies') return p.category === 'Cookies';
    if (activeCategory === 'Brownies') return p.category === 'Brownies';
    if (activeCategory === 'Pastries') return p.category === 'Pastries' || p.category === 'Croissants' || p.category === 'Tarts';
    if (activeCategory === 'Vegan') return p.ingredients?.toLowerCase().includes('vegan') || p.category === 'Croissants';
    return true;
  });

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -360 : 360;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedItems(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [product.id]: false }));
    }, 1200);
  };

  return (
    <div className="space-y-12 pb-16">
      
      {/* 1. CHEF'S SELECTION / SIGNATURE CAKES SECTION (Matching Screenshot 1 Top) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        
        {/* Header Row */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8A7973] block mb-1">
              CHEF'S SELECTION
            </span>
            <h1 className="font-serif-display text-3xl sm:text-4xl md:text-5xl font-bold text-[#3D312E]">
              Signature Cakes
            </h1>
          </div>

          {/* Carousel Arrows */}
          <div className="flex items-center gap-2">
            <button
              id="carousel-prev-btn"
              onClick={() => scrollCarousel('left')}
              className="w-10 h-10 rounded-full border border-[#DCD0C5] bg-[#FAF6F2] hover:bg-[#F3EBE3] flex items-center justify-center text-[#5C4A47] transition-all cursor-pointer shadow-2xs"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              id="carousel-next-btn"
              onClick={() => scrollCarousel('right')}
              className="w-10 h-10 rounded-full border border-[#DCD0C5] bg-[#FAF6F2] hover:bg-[#F3EBE3] flex items-center justify-center text-[#5C4A47] transition-all cursor-pointer shadow-2xs"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel Cards Row */}
        <div
          ref={carouselRef}
          className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-4"
        >
          {chefSelectionProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => openProductDetail(product.id)}
              className="group relative flex-none w-[310px] sm:w-[380px] h-[280px] sm:h-[320px] rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Background Image */}
              <img
                src={product.image}
                alt={product.name}
                onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#201816]/90 via-[#201816]/30 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                {product.chefTag && (
                  <span className="text-xs font-semibold tracking-wider text-[#F8E0DD] uppercase mb-1">
                    {product.chefTag}
                  </span>
                )}
                
                <h3 className="font-serif-display text-2xl sm:text-3xl font-bold leading-tight mb-3 text-white drop-shadow-sm">
                  {product.name}
                </h3>

                <div className="flex items-center gap-2 text-sm font-medium text-[#FAF0EB] group-hover:text-white transition-colors">
                  <span>{product.chefActionText || 'Pre-order now'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. CATEGORY PILL FILTERS (Matching Screenshot 1 Middle) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar py-2">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                id={`cat-pill-${cat.toLowerCase()}`}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all cursor-pointer whitespace-nowrap shadow-2xs ${
                  isActive
                    ? 'bg-[#5C4A4A] text-white font-semibold shadow-xs'
                    : 'bg-[#F8ECE9] text-[#6E5B58] hover:bg-[#F0DED9] hover:text-[#3D312E]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. PRODUCT GRID (Matching Screenshot 1 Bottom Grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {displayedProducts.slice(0, 8).map((product) => (
            <div
              key={product.id}
              onClick={() => openProductDetail(product.id)}
              className="group bg-transparent rounded-2xl cursor-pointer transition-all duration-200"
            >
              {/* Product Card Image Container */}
              <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden bg-[#F2E8DF] mb-3 shadow-xs group-hover:shadow-md transition-shadow">
                <img
                  src={product.image}
                  alt={product.name}
                  onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {product.badge && (
                  <span className="absolute top-3 left-3 bg-[#FAF6F2]/90 backdrop-blur-md text-[#5C4A4A] text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-[#E8DAD0]">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Product Card Meta */}
              <div className="flex items-end justify-between px-1">
                <div>
                  <span className="text-xs font-medium text-[#9C8B85] block mb-0.5">
                    {product.category}
                  </span>
                  <h4 className="font-serif-display text-lg font-bold text-[#3D312E] group-hover:text-[#7A5A53] transition-colors leading-snug">
                    {product.name}
                  </h4>
                  <p className="text-sm font-semibold text-[#5C4A47] mt-1">
                    ${product.price.toFixed(2)}
                  </p>
                </div>

                {/* Quick Add Button (+) */}
                <button
                  id={`quick-add-${product.id}`}
                  onClick={(e) => handleQuickAdd(e, product)}
                  className={`w-9 h-9 rounded-full border border-[#D9C8BC] flex items-center justify-center transition-all cursor-pointer ${
                    addedItems[product.id]
                      ? 'bg-[#5C4A47] text-white border-[#5C4A47] scale-110'
                      : 'bg-[#FAF6F2] text-[#3D312E] hover:bg-[#5C4A47] hover:text-white hover:border-[#5C4A47]'
                  }`}
                  aria-label={`Add ${product.name} to basket`}
                >
                  {addedItems[product.id] ? (
                    <Check className="w-4 h-4 text-white" />
                  ) : (
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-12 text-center">
          <button
            id="home-view-all-btn"
            onClick={() => {
              setSelectedCategory('All Delights');
              setActiveScreen('products');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#5C4A47] text-white font-medium hover:bg-[#473937] transition-all cursor-pointer shadow-sm hover:shadow-md"
          >
            <span>Explore Full Artisanal Menu</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* AI Assistant Callout Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="bg-gradient-to-r from-[#F7ECE8] to-[#F3E3DF] rounded-3xl p-8 sm:p-10 border border-[#E8D4CE] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF6F2] text-[#8C4A45] text-xs font-semibold tracking-wider uppercase border border-[#E5C9C3]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>PASTRY AI CONCIERGE</span>
            </div>
            <h3 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#3D312E]">
              Need help choosing or customizing a cake?
            </h3>
            <p className="text-sm text-[#6C5B57] max-w-xl">
              Ask Chef Camille about flavor notes, gluten-free choices, allergen info, or get personalized dessert pairing suggestions!
            </p>
          </div>

          <button
            id="home-ai-assistant-banner-btn"
            onClick={() => useApp().setIsAssistantOpen(true)}
            className="whitespace-nowrap px-6 py-3 rounded-full bg-[#3D312E] text-white font-medium text-sm hover:bg-[#5C4A47] transition-all shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#E3A8A3]" />
            <span>Chat with Chef Camille</span>
          </button>
        </div>
      </section>

    </div>
  );
};
