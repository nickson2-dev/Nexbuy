
import React from 'react';
import { Product } from '../types';
import { ShoppingCart, Star, Heart, Truck, Eye, Zap, AlertCircle, BarChart3, ChevronDown, Store, ShieldCheck } from 'lucide-react';
import { useCurrency } from '../src/context/CurrencyContext';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  wishlist: Product[];
  onQuickView: (product: Product) => void;
  onProductClick?: (product: Product) => void;
  // Filter Props
  priceTier?: string;
  setPriceTier?: (tier: string) => void;
  minRating?: number;
  setMinRating?: (rating: number) => void;
  onReset?: () => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  onAddToCart, 
  onToggleWishlist, 
  wishlist, 
  onQuickView, 
  onProductClick,
  priceTier = 'all',
  setPriceTier,
  minRating = 0,
  setMinRating,
  onReset
}) => {
  const { formatPrice, currency } = useCurrency();
  const isInWishlist = (id: string) => wishlist.some(p => p.id === id);

  return (
    <div className="space-y-8">
      {/* Enhanced Filter Toolbar - Only show if filter props are provided */}
      {setPriceTier && setMinRating && onReset && (
        <div className="bg-white/50 backdrop-blur-xl border border-slate-100 rounded-[24px] md:rounded-[32px] p-4 lg:p-6 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 w-full xl:w-auto">
          {/* Price Segment Selector */}
          <div className="space-y-2 w-full sm:w-auto">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Price Segments ({currency.code})</p>
            <div className="flex bg-slate-100/50 p-1 rounded-2xl border border-slate-100 overflow-x-auto no-scrollbar">
              {[
                { id: 'all', label: 'All' },
                { id: 'under50', label: `< ${formatPrice(50)}` },
                { id: '50-150', label: `${formatPrice(50)}-${formatPrice(150)}` },
                { id: 'over150', label: `${formatPrice(150)}+` }
              ].map(tier => (
                <button
                  key={tier.id}
                  onClick={() => setPriceTier(tier.id)}
                  className={`px-3 md:px-4 py-2 rounded-xl text-[10px] md:text-[11px] font-bold transition-all whitespace-nowrap ${
                    priceTier === tier.id 
                    ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' 
                    : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tier.label}
                </button>
              ))}
            </div>
          </div>

          {/* Rating Segment Selector */}
          <div className="space-y-2 w-full sm:w-auto">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Min. Star Rating</p>
            <div className="flex bg-slate-100/50 p-1 rounded-2xl border border-slate-100">
              {[0, 4, 4.5].map(rating => (
                <button
                  key={rating}
                  onClick={() => setMinRating(rating)}
                  className={`px-4 py-2 rounded-xl text-[10px] md:text-[11px] font-bold flex items-center gap-2 transition-all ${
                    minRating === rating 
                    ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' 
                    : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {rating === 0 ? 'Any' : (
                    <>
                      {rating}+ <Star size={12} fill="currentColor" className="text-yellow-500" />
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between xl:justify-end gap-4 w-full xl:w-auto pt-4 xl:pt-0 border-t xl:border-t-0 border-slate-100">
          <div className="text-left xl:text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Visibility</p>
            <p className="text-sm font-black text-slate-900">{products.length} Assets Found</p>
          </div>
          <div className="w-[1px] h-8 bg-slate-200 hidden sm:block"></div>
          <button 
            onClick={onReset}
            className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-800 transition-colors bg-indigo-50 px-4 py-2 rounded-xl xl:bg-transparent xl:p-0"
          >
            Reset Filters
          </button>
        </div>
      </div>
      )}

      {/* Grid Content */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="group relative bg-white rounded-[32px] overflow-hidden border border-slate-100 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(79,70,229,0.1)] hover:-translate-y-2"
            >
              {/* Status Badges */}
              <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                {product.isNew && (
                  <span className="bg-indigo-600 text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                    Hot Seller
                  </span>
                )}
                <div className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md text-indigo-400 text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg border border-white/10">
                  <Zap size={10} className="fill-current" />
                  +{product.xpGain || 100} XP
                </div>
              </div>

              <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
                <button 
                  onClick={() => onToggleWishlist(product)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${
                    isInWishlist(product.id) 
                      ? 'bg-pink-500 text-white scale-110' 
                      : 'bg-white/90 text-slate-400 hover:text-pink-500 hover:bg-white backdrop-blur-md'
                  }`}
                >
                  <Heart size={20} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                </button>
                <button 
                  onClick={() => onQuickView(product)}
                  className="w-10 h-10 bg-white/90 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all backdrop-blur-md translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 duration-300"
                >
                  <Eye size={20} />
                </button>
              </div>

              <div 
                className="relative aspect-square overflow-hidden bg-slate-50 cursor-pointer"
                onClick={() => onProductClick?.(product)}
              >
                <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <button 
                  onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
                  className="absolute bottom-6 left-6 right-6 bg-slate-900 text-white h-14 rounded-2xl flex items-center justify-center gap-3 shadow-2xl translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-indigo-600 active:scale-95"
                >
                  <ShoppingCart size={20} />
                  <span className="font-bold">Add to Cart</span>
                </button>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">{product.category}</span>
                  <div className="flex items-center gap-1 text-yellow-500 bg-yellow-50 px-2 py-1 rounded-lg">
                    <Star size={12} fill="currentColor" />
                    <span className="text-xs font-black text-yellow-700">{product.rating}</span>
                  </div>
                </div>
                
                <h3 
                  className="text-xl font-bold text-slate-900 mb-1 leading-tight group-hover:text-indigo-600 transition-colors cursor-pointer"
                  onClick={() => onProductClick?.(product)}
                >
                  {product.name}
                </h3>
                
                {product.sellerName && (
                  <div className="flex flex-wrap items-center gap-1.5 mb-3">
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md border border-indigo-100">
                      <Store size={10} />
                      <span className="text-[9px] font-black uppercase tracking-wider">{product.sellerName}</span>
                    </div>
                    {product.sellerBadge && (
                      <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md border ${
                        product.sellerBadge === 'Platinum' ? 'bg-slate-900 text-white border-slate-800' :
                        product.sellerBadge === 'Gold' ? 'bg-yellow-400 text-slate-900 border-yellow-500' :
                        product.sellerBadge === 'Silver' ? 'bg-slate-200 text-slate-700 border-slate-300' :
                        'bg-orange-100 text-orange-700 border-orange-200'
                      }`}>
                        <ShieldCheck size={10} />
                        <span className="text-[9px] font-black uppercase tracking-wider">{product.sellerBadge}</span>
                      </div>
                    )}
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Verified Merchant</span>
                  </div>
                )}
                
                <p className="text-slate-500 text-xs line-clamp-2 mb-4 leading-relaxed">{product.description}</p>

                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <div className="flex flex-col">
                    <span className="text-2xl font-black text-slate-900">{formatPrice(product.price)}</span>
                    <div className="flex items-center gap-1.5 text-[10px] text-green-600 font-bold uppercase mt-1">
                      <Truck size={12} />
                      <span>Ships Express</span>
                    </div>
                  </div>
                  <div className="flex -space-x-1.5">
                    {product.colors?.map((color, i) => (
                      <div key={i} className="w-4 h-4 rounded-full border-2 border-white ring-1 ring-slate-100" style={{ backgroundColor: color }}></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-32 text-center bg-white rounded-[48px] border border-dashed border-slate-200 animate-fade-in">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={32} className="text-slate-300" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-2">Null result in current context.</h3>
          <p className="text-slate-400 mb-8 font-medium">No products match your current price or rating filters.</p>
          <button onClick={onReset} className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-indigo-600 transition-all">Reset Matrix</button>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
