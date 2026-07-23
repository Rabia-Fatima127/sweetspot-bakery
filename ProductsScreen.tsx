import React from 'react';
import { ShoppingCart, Check, Search, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Category, Product } from '../types';
import { PRODUCTS, FALLBACK_IMAGE } from '../data/products';

export const ProductsScreen: React.FC = () => {
  const {
    openProductDetail,
    addToCart,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery
  } = useApp();

  const [addedItems, setAddedItems] = React.useState<Record<string, boolean>>({});

  const filterCategories: Category[] = [
    'All Delights',
    'Macarons',
    'Croissants',
    'Signature Cakes',
    'Tarts'
  ];

  const filteredProducts = PRODUCTS.filter((p) => {
    // Category match
    let matchesCategory = true;
    if (selectedCategory !== 'All Delights') {
      if (selectedCategory === 'Macarons') matchesCategory = p.category === 'Macarons';
      else if (selectedCategory === 'Croissants') matchesCategory = p.category === 'Croissants';
      else if (selectedCategory === 'Signature Cakes') matchesCategory = p.category === 'Signature Cakes' || p.category === 'Cakes';
      else if (selectedCategory === 'Tarts') matchesCategory = p.category === 'Tarts';
      else matchesCategory = p.category === selectedCategory;
    }

    // Search query match
    let matchesSearch = true;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      matchesSearch =
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.subtitle && p.subtitle.toLowerCase().includes(q));
    }

    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedItems(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [product.id]: false }));
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      
      {/* Title & Description Block (Matching Screenshot 2) */}
      <div className="text-center max-w-2xl mx-auto space-y-3 pt-4">
        <h1 className="font-serif-display text-3xl sm:text-4xl md:text-5xl font-bold text-[#3D312E]">
          Artisanal Collection
        </h1>
        <p className="text-sm sm:text-base text-[#7A6964] leading-relaxed">
          Every pastry is a masterpiece, handcrafted daily with organic locally-sourced ingredients and a touch of artisanal magic.
        </p>
      </div>

      {/* Filter Tag Pills (Matching Screenshot 2) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#EAE0D5] pb-6">
        
        {/* Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto py-1">
          {filterCategories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                id={`products-cat-pill-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#F7E6E5] text-[#3D312E] font-semibold border border-[#E3C4C1]'
                    : 'bg-white text-[#7A6A65] hover:bg-[#F8EFEA] border border-transparent'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search / Result Count */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#A89893]" />
            <input
              id="products-search-input"
              type="text"
              placeholder="Search pastries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-white border border-[#E2D5C9] text-sm text-[#3D312E] rounded-full focus:outline-none focus:ring-2 focus:ring-[#C28B87]"
            />
          </div>
          <span className="text-xs font-medium text-[#8A7973] whitespace-nowrap">
            {filteredProducts.length} items
          </span>
        </div>
      </div>

      {/* Product Cards Grid (3 Columns on Desktop matching Screenshot 2) */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white/60 rounded-3xl border border-[#EAE0D5] space-y-4">
          <p className="font-serif-display text-xl text-[#3D312E]">No treats match your search</p>
          <p className="text-sm text-[#8A7973]">Try searching for "macaron", "cake", "croissant", or clearing filters.</p>
          <button
            onClick={() => { setSelectedCategory('All Delights'); setSearchQuery(''); }}
            className="px-6 py-2 rounded-full bg-[#5C4A47] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#3D312E]"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => openProductDetail(product.id)}
              className="group bg-white rounded-3xl overflow-hidden border border-[#EFE5DC] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer transform hover:-translate-y-1"
            >
              {/* Product Image Container */}
              <div className="relative aspect-4/3 w-full bg-[#F3ECE5] overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Badge (e.g. New Arrival, Best Seller) */}
                {product.badge && (
                  <span className={`absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full shadow-xs border ${
                    product.badge === 'New Arrival'
                      ? 'bg-white text-[#5C4A47] border-[#E8DAD0]'
                      : 'bg-[#F7E6E5] text-[#7A3E39] border-[#E3C4C1]'
                  }`}>
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Product Meta Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-baseline justify-between mb-1.5">
                    <h3 className="font-serif-display text-xl font-bold text-[#3D312E] group-hover:text-[#7A5A53] transition-colors">
                      {product.name}
                    </h3>
                    <span className="font-serif-display text-lg font-bold text-[#3D312E]">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#7A6A65] line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Add to Cart Button (Matching Screenshot 2: solid mocha button) */}
                <button
                  id={`products-add-cart-${product.id}`}
                  onClick={(e) => handleAddToCart(e, product)}
                  className={`w-full py-3 px-4 rounded-xl font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                    addedItems[product.id]
                      ? 'bg-[#3D312E] text-white shadow-inner'
                      : 'bg-[#7A6360] hover:bg-[#5C4A47] text-white shadow-2xs hover:shadow-md'
                  }`}
                >
                  {addedItems[product.id] ? (
                    <>
                      <Check className="w-4 h-4 text-[#E3C4C1]" />
                      <span>Added to Basket</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
