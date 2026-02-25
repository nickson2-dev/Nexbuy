import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { ChevronLeft, ChevronRight, ShoppingCart, Cpu, Target } from 'lucide-react';

interface ExperienceCenterProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onClose: () => void;
}

const ExperienceCenter: React.FC<ExperienceCenterProps> = ({ products, onAddToCart, onClose }) => {
  const [index, setIndex] = useState(0);
  const [isScanning, setIsScanning] = useState(true);
  const current = products[index % products.length];

  useEffect(() => {
    setIsScanning(true);
    const timer = setTimeout(() => setIsScanning(false), 2000);
    return () => clearTimeout(timer);
  }, [index]);

  const next = () => setIndex(prev => prev + 1);
  const prev = () => setIndex(prev => prev - 1);

  return (
    <div className="fixed inset-0 z-[700] bg-black text-white overflow-hidden flex flex-col font-mono selection:bg-indigo-500">
      <div className="absolute inset-0 z-0">
        <video 
          key={current.videoUrl || current.image}
          autoPlay muted loop playsInline
          className="w-full h-full object-cover opacity-40 transition-opacity duration-1000 grayscale"
        >
          <source src={current.videoUrl || "https://assets.mixkit.co/videos/preview/mixkit-circuit-board-details-moving-145-large.mp4"} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none opacity-20"></div>
      </div>

      <header className="relative z-10 flex items-center justify-between p-4 md:p-8 border-b border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-3 md:gap-6">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-600 rounded-xl flex items-center justify-center font-black italic shadow-[0_0_30px_rgba(79,70,229,0.5)] text-sm md:text-base">NB</div>
          <div>
            <h2 className="text-sm md:text-xl font-black tracking-tighter uppercase italic">Nexbuy Research Labs</h2>
            <p className="text-[8px] md:text-[10px] text-indigo-400 font-bold tracking-[0.3em] uppercase">Core Simulation Protocol v2.5</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="px-4 md:px-8 py-2 md:py-3 bg-white/5 border border-white/20 rounded-xl font-black uppercase text-[8px] md:text-[10px] tracking-widest hover:bg-red-500/20 hover:border-red-500/50 transition-all flex items-center gap-2"
        >
          <span className="hidden sm:inline">Terminate Session</span>
          <span className="sm:hidden">Exit</span>
        </button>
      </header>

      <main className="relative z-10 flex-grow flex flex-col items-center justify-center px-6">
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          <div className="space-y-6 md:space-y-10 animate-slide-up">
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em]">
              <Cpu size={14} /> Neural Interface Active
            </div>
            
            <div className="space-y-2">
              <p className="text-indigo-500 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-2 md:mb-4 flex items-center gap-2">
                <Target size={14} /> Subject Identification: NEX-{current.id.toUpperCase()}
              </p>
              <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter leading-none italic uppercase">
                {current.name}
              </h1>
            </div>
            
            <p className="text-base md:text-lg text-slate-400 font-medium leading-relaxed max-w-lg">
              {current.description}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
               {Object.entries(current.specs || {}).map(([key, val]) => (
                 <div key={key} className="p-4 md:p-5 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 relative overflow-hidden group">
                   <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500/0 group-hover:bg-indigo-500 transition-all"></div>
                   <p className="text-[8px] md:text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{key}</p>
                   <p className="text-xs md:text-sm font-bold text-white/90">{val}</p>
                 </div>
               ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-8 pt-6">
              <button 
                onClick={() => onAddToCart(current)}
                className="w-full sm:w-auto bg-white text-black px-8 md:px-12 h-16 md:h-20 rounded-2xl font-black text-base md:text-lg flex items-center justify-center gap-4 hover:scale-105 active:scale-95 transition-all shadow-[0_0_50px_rgba(255,255,255,0.2)]"
              >
                <ShoppingCart size={20} />
                Acquire Asset — ${current.price}
              </button>
              <div className="flex flex-row sm:flex-col items-center sm:items-start gap-2 sm:gap-0">
                 <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">XP Reward</span>
                 <span className="text-2xl md:text-3xl font-black tabular-nums">+{current.xpGain || 100} XP</span>
              </div>
            </div>
          </div>

          <div className="relative group perspective-1000 hidden md:block">
            <div className="relative w-full aspect-square bg-slate-900/40 rounded-[48px] lg:rounded-[64px] border border-white/10 backdrop-blur-md p-12 lg:p-24 flex items-center justify-center overflow-hidden">
               {isScanning && (
                 <div className="absolute inset-0 z-20 pointer-events-none">
                    <div className="w-full h-1 bg-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.8)] scan-line"></div>
                 </div>
               )}
               <img 
                 src={current.image} 
                 alt={current.name} 
                 className={`w-full h-full object-contain drop-shadow-[0_0_80px_rgba(99,102,241,0.3)] transform transition-all duration-1000 ${isScanning ? 'blur-sm scale-90 opacity-50' : 'scale-100 opacity-100'}`}
               />
               <div className="absolute top-8 left-8 text-[10px] font-bold text-indigo-400/50">
                  <p>COORD_X: 42.9221</p>
                  <p>COORD_Y: -12.4491</p>
               </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 p-6 md:p-12 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-white/5 backdrop-blur-md">
        <div className="flex gap-4 md:gap-6">
          <button 
            onClick={prev}
            className="w-14 h-14 md:w-20 md:h-20 rounded-2xl border border-white/10 flex items-center justify-center hover:bg-white/5 hover:border-indigo-500/50 transition-all group"
          >
            <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <button 
            onClick={next}
            className="w-14 h-14 md:w-20 md:h-20 rounded-2xl border border-white/10 flex items-center justify-center hover:bg-white/5 hover:border-indigo-500/50 transition-all group"
          >
            <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="flex flex-col items-center md:items-end gap-3">
           <div className="flex gap-2 md:gap-3">
            {products.map((_, i) => (
              <div 
                key={i} 
                className={`h-1 md:h-1.5 rounded-full transition-all duration-700 ${i === index % products.length ? 'w-12 md:w-24 bg-indigo-500' : 'w-2 md:w-4 bg-white/10'}`}
              ></div>
            ))}
          </div>
          <p className="text-[9px] md:text-[10px] text-slate-500 font-black uppercase tracking-widest">
            Dataset Index: { (index % products.length) + 1 } / { products.length }
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ExperienceCenter;
