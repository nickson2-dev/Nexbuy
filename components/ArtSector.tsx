
import React, { useState, useMemo } from 'react';
import { Product, User } from '../types';
import { Palette, Zap, Star, Plus, X, MessageSquare, Share2, Eye, TrendingUp, Info, Activity, Grid, Layout, Sparkles, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ArtSectorProps {
  products: Product[];
  user: User;
  onAddToCart: (product: Product) => void;
  onClose: () => void;
  onOpenSeller: () => void;
}

const ArtSector: React.FC<ArtSectorProps> = ({ products, user, onAddToCart, onClose, onOpenSeller }) => {
  const [selectedArt, setSelectedArt] = useState<Product | null>(null);
  const [activeFilter, setActiveFilter] = useState('All');

  const artProducts = useMemo(() => {
    return products.filter(p => p.sector === 'art' || p.category.toLowerCase().includes('art'));
  }, [products]);

  const categories = useMemo(() => ['All', ...new Set(artProducts.map(p => p.category))], [artProducts]);

  const filteredArt = useMemo(() => {
    if (activeFilter === 'All') return artProducts;
    return artProducts.filter(p => p.category === activeFilter);
  }, [artProducts, activeFilter]);

  return (
    <div className="fixed inset-0 z-[200] bg-slate-50 text-slate-900 overflow-y-auto font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Professional Gallery Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/white-diamond.png')] opacity-20" />
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-white to-transparent" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-[210] bg-white/80 backdrop-blur-2xl border-b border-slate-200 px-6 py-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-slate-900 text-white rounded-2xl cursor-pointer hover:scale-110 transition-transform shadow-lg" onClick={onClose}>
            <Palette size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
              Art <span className="text-indigo-600">Showcase</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Curated Professional Gallery</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => onOpenSeller()}
            className="hidden md:flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            <Plus size={18} /> Submit Art
          </button>
          <button 
            onClick={onClose}
            className="p-3 text-slate-400 hover:text-slate-900 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-[205] max-w-[1800px] mx-auto p-6 lg:p-12">
        {/* Gallery Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm flex items-center gap-6">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center"><Grid size={32} /></div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Collection</p>
              <p className="text-3xl font-black text-slate-900">{artProducts.length} Pieces</p>
            </div>
          </div>
          <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm flex items-center gap-6">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center"><TrendingUp size={32} /></div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Market Interest</p>
              <p className="text-3xl font-black text-slate-900">+12.4%</p>
            </div>
          </div>
          <div className="bg-indigo-600 p-8 rounded-[32px] text-white flex items-center gap-6 shadow-xl shadow-indigo-100">
            <div className="w-16 h-16 bg-white/20 text-white rounded-2xl flex items-center justify-center"><Sparkles size={32} /></div>
            <div>
              <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-1">AI Enhanced</p>
              <p className="text-3xl font-black">Verified Quality</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all border ${
                activeFilter === cat 
                ? 'bg-slate-900 border-slate-900 text-white shadow-lg' 
                : 'bg-white border-slate-200 text-slate-500 hover:border-slate-400 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Pinterest-style Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {filteredArt.map((art, idx) => (
            <motion.div
              layoutId={`art-${art.id}`}
              key={art.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="break-inside-avoid group relative bg-white rounded-[32px] border border-slate-200 overflow-hidden cursor-pointer hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300"
              onClick={() => setSelectedArt(art)}
            >
              <div className="relative overflow-hidden">
                <img 
                  src={art.image} 
                  alt={art.name} 
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="bg-white text-slate-900 px-6 py-3 rounded-full font-bold text-sm flex items-center gap-2 shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform">
                    View Details <ArrowUpRight size={16} />
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{art.category}</span>
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star size={12} fill="currentColor" />
                    <span className="text-xs font-bold text-slate-900">{art.rating}</span>
                  </div>
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-1">{art.name}</h3>
                <div className="flex items-center justify-between">
                  <p className="text-indigo-600 font-black text-xl">${art.price}</p>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{art.sellerName || 'Artist'}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredArt.length === 0 && (
          <div className="py-40 text-center">
            <div className="w-24 h-24 bg-slate-100 text-slate-300 rounded-[40px] flex items-center justify-center mx-auto mb-8">
              <Palette size={48} />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-4">No artworks found</h2>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">Our curators are currently sourcing new professional pieces. Check back soon or try another category.</p>
            <button 
              onClick={() => setActiveFilter('All')}
              className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-sm hover:bg-indigo-600 transition-all"
            >
              View All Collection
            </button>
          </div>
        )}
      </main>

      {/* Art Detail Modal */}
      <AnimatePresence>
        {selectedArt && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 lg:p-12"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-[56px] w-full max-w-6xl overflow-hidden flex flex-col lg:flex-row relative shadow-2xl"
            >
              <button 
                onClick={() => setSelectedArt(null)}
                className="absolute top-8 right-8 z-10 p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all"
              >
                <X size={24} />
              </button>

              {/* Image Section */}
              <div className="lg:w-1/2 aspect-square lg:aspect-auto relative bg-slate-50 flex items-center justify-center p-12">
                <img 
                  src={selectedArt.image} 
                  alt={selectedArt.name} 
                  className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl" 
                />
                <div className="absolute bottom-8 left-8">
                  <div className="bg-white/80 backdrop-blur-md border border-slate-200 p-4 rounded-2xl shadow-sm flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center"><Sparkles size={20} /></div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AI Enhanced</p>
                      <p className="text-xs font-bold text-slate-900">Professional Studio Quality</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Section */}
              <div className="lg:w-1/2 p-10 lg:p-20 flex flex-col">
                <div className="mb-10">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="px-4 py-1.5 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-full uppercase tracking-widest">
                      {selectedArt.category}
                    </span>
                    <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                      <TrendingUp size={14} /> Featured Showcase
                    </span>
                  </div>
                  <h2 className="text-5xl font-black text-slate-900 mb-6 leading-tight">
                    {selectedArt.name}
                  </h2>
                  <p className="text-slate-500 text-lg leading-relaxed mb-10 font-medium">
                    {selectedArt.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-12 mb-12">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Price</p>
                    <p className="text-5xl font-black text-indigo-600">${selectedArt.price}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Curator Rating</p>
                    <div className="flex items-center gap-3">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={24} fill={i < Math.floor(selectedArt.rating) ? 'currentColor' : 'none'} />
                        ))}
                      </div>
                      <span className="text-2xl font-black text-slate-900">{selectedArt.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-auto space-y-4">
                  <button 
                    onClick={() => {
                      onAddToCart(selectedArt);
                      setSelectedArt(null);
                    }}
                    className="w-full bg-slate-900 text-white h-20 rounded-[32px] font-black uppercase text-lg tracking-widest hover:bg-indigo-600 transition-all flex items-center justify-center gap-4 shadow-xl shadow-indigo-100"
                  >
                    Purchase Artwork <Zap size={24} />
                  </button>
                  <div className="flex gap-4">
                    <button className="flex-grow border border-slate-200 h-16 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                      <MessageSquare size={18} /> Contact Artist
                    </button>
                    <button className="flex-grow border border-slate-200 h-16 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                      <Info size={18} /> Provenance
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Floating Action Button */}
      <button 
        onClick={() => onOpenSeller()}
        className="md:hidden fixed bottom-24 right-8 w-16 h-16 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center z-[250] active:scale-90 transition-all"
      >
        <Plus size={32} />
      </button>
    </div>
  );
};

export default ArtSector;
