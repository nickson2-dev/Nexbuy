import React from 'react';
import { motion } from 'motion/react';
import { Crown, ArrowRight, ShieldCheck, Zap, Star } from 'lucide-react';
import { Product } from '../types';

interface PremiumShowcaseProps {
  products: Product[];
  onQuickView: (product: Product) => void;
  onOpenMembership: () => void;
}

const PremiumShowcase: React.FC<PremiumShowcaseProps> = ({ products, onQuickView, onOpenMembership }) => {
  const premiumProducts = products.filter(p => p.isExclusive).slice(0, 3);

  if (premiumProducts.length === 0) return null;

  return (
    <section className="py-24 bg-slate-900 overflow-hidden relative">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(251,191,36,0.3)]">
                <Crown size={24} className="text-white fill-current" />
              </div>
              <span className="text-[11px] font-black text-amber-400 uppercase tracking-[0.4em]">Lumi Ascend Exclusive</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-tight italic uppercase">
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-white to-amber-200">Ascended</span> Collection
            </h2>
            <p className="text-slate-400 mt-6 text-lg font-medium leading-relaxed">
              Rare hardware and limited-run artifacts reserved exclusively for our Ascended tier citizens. Hand-verified by Nexus Governance.
            </p>
          </div>
          <button 
            onClick={onOpenMembership}
            className="group flex items-center gap-4 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-black uppercase text-xs tracking-widest hover:bg-white/10 transition-all"
          >
            Upgrade Status
            <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {premiumProducts.map((product, i) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group relative bg-white/5 border border-white/10 rounded-[40px] p-4 hover:bg-white/[0.08] transition-all duration-500"
            >
              <div className="relative aspect-[4/5] rounded-[32px] overflow-hidden mb-6">
                <img 
                  src={product.image.includes('unsplash.com') ? `${product.image}&w=800` : product.image} 
                  alt={product.name} 
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>
                
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <div className="bg-yellow-400 text-slate-900 text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest">
                    Lumi Exclusive
                  </div>
                </div>

                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map(s => <Star key={s} size={10} className="text-yellow-400 fill-current" />)}
                    </div>
                    <span className="text-[9px] font-black text-white/60 uppercase tracking-widest">Pristine Condition</span>
                  </div>
                  <h3 className="text-2xl font-black text-white tracking-tight leading-tight">{product.name}</h3>
                </div>
              </div>

              <div className="px-4 pb-4">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Acquisition Cost</p>
                    <p className="text-2xl font-black text-white">${product.price.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">XP Yield</p>
                    <div className="flex items-center gap-1 text-indigo-400 font-black">
                      <Zap size={14} className="fill-current" />
                      <span>+{product.xpGain || 500}</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => onQuickView(product)}
                  className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-indigo-400 hover:text-white transition-all active:scale-95"
                >
                  Request Inspection
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PremiumShowcase;
