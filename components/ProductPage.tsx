
import React, { useState } from 'react';
import { Product } from '../types';
import { ChevronLeft, ShoppingCart, Heart, Zap, ShieldCheck, Truck, Star, Info, Share2 } from 'lucide-react';

interface ProductPageProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  wishlist: Product[];
  onBack: () => void;
}

const ProductPage: React.FC<ProductPageProps> = ({ product, onAddToCart, onToggleWishlist, wishlist, onBack }) => {
  const isInWishlist = wishlist.some(p => p.id === product.id);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '');

  return (
    <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-10 animate-fade-in">
      {/* Breadcrumbs / Back */}
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-black uppercase text-[10px] tracking-widest mb-10 transition-all group"
      >
        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Return to Catalog
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Visual Column */}
        <div className="lg:col-span-7 space-y-8">
          <div className="aspect-square rounded-[48px] overflow-hidden bg-white border border-slate-100 shadow-sm relative group">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute top-6 left-6 z-10">
              <span className="bg-slate-900/80 backdrop-blur-md text-indigo-400 text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-[0.2em] border border-white/10">
                Subject: NEX-{product.id.toUpperCase()}
              </span>
            </div>
            
            <button 
              onClick={() => onToggleWishlist(product)}
              className={`absolute top-6 right-6 z-10 w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all ${
                isInWishlist ? 'bg-pink-500 text-white' : 'bg-white/80 backdrop-blur-md text-slate-400 hover:text-pink-500'
              }`}
            >
              <Heart size={24} fill={isInWishlist ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Detailed Narrative */}
          <div className="bg-white p-10 rounded-[48px] border border-slate-100">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Technical Narrative</h3>
            <p className="text-xl text-slate-500 leading-relaxed font-medium mb-10">
              {product.description}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4 p-6 bg-slate-50 rounded-3xl">
                <ShieldCheck className="text-indigo-600 shrink-0" size={24} />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Nexbuy Protection</h4>
                  <p className="text-xs text-slate-400 mt-1">2-Year global warranty included with every unit.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-6 bg-slate-50 rounded-3xl">
                <Truck className="text-emerald-600 shrink-0" size={24} />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Carbon-Neutral Logistics</h4>
                  <p className="text-xs text-slate-400 mt-1">Optimized routing for immediate and clean delivery.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Column */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="sticky top-32 space-y-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                  {product.category}
                </span>
                <div className="flex items-center gap-1 text-yellow-500 text-xs font-black">
                  <Star size={14} fill="currentColor" />
                  {product.rating} (Verified Owners)
                </div>
              </div>
              <h1 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter leading-none italic uppercase mb-6">
                {product.name}
              </h1>
              <div className="flex items-baseline gap-4">
                <span className="text-5xl font-black text-slate-900 tracking-tighter">
                  ${product.price.toLocaleString()}
                </span>
                <span className="text-emerald-500 font-black text-xs uppercase tracking-widest">In Stock</span>
              </div>
            </div>

            {/* Configurator (Simulated) */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Variant</h4>
                <div className="flex gap-3">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-12 h-12 rounded-2xl border-2 transition-all p-1 ${
                        selectedColor === color ? 'border-indigo-600' : 'border-transparent'
                      }`}
                    >
                      <div className="w-full h-full rounded-xl shadow-inner" style={{ backgroundColor: color }}></div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Specifications HUD */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Specs</h4>
              <div className="grid grid-cols-1 gap-3">
                {Object.entries(product.specs || {}).map(([key, val]) => (
                  <div key={key} className="flex justify-between items-center p-4 bg-white rounded-2xl border border-slate-100 hover:border-indigo-100 transition-colors">
                    <span className="text-xs font-bold text-slate-400">{key}</span>
                    <span className="text-sm font-black text-slate-900">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Main Action */}
            <div className="pt-6 space-y-4">
              <button 
                onClick={() => onAddToCart(product)}
                className="w-full h-20 bg-slate-900 text-white rounded-[32px] font-black text-xl hover:bg-indigo-600 transition-all active:scale-95 shadow-2xl flex items-center justify-center gap-4 group"
              >
                <ShoppingCart size={24} className="group-hover:rotate-12 transition-transform" />
                Initiate Purchase
              </button>
              
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <Zap size={16} className="text-indigo-600" />
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">+{product.xpGain || 100} XP Gain Potential</span>
                </div>
                <button className="text-slate-300 hover:text-slate-900 transition-colors">
                  <Share2 size={18} />
                </button>
              </div>
            </div>

            {/* Status Footer */}
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center gap-4">
              <Info className="text-slate-400" size={20} />
              <p className="text-[10px] text-slate-500 font-bold leading-relaxed uppercase tracking-wide">
                Nexbuy items are limited run and curated for quality. Pricing includes global duties and white-glove logistics.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
