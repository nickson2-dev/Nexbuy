
import React from 'react';
import { FlaskConical, ChevronRight, Zap, Crown } from 'lucide-react';
import { motion } from 'motion/react';
import { PRODUCTS } from '../constants';

interface HeroProps {
  onShopNow: () => void;
  onLaunchLabs: () => void;
  isLumiAscend?: boolean;
  onOpenMembership: () => void;
}

const Hero: React.FC<HeroProps> = ({ onShopNow, onLaunchLabs, isLumiAscend, onOpenMembership }) => {
  // Select a few products for the banner
  const bannerProducts = [...PRODUCTS].slice(0, 6);
  
  return (
    <section className="relative h-[110vh] md:h-[100vh] flex items-center justify-center overflow-hidden bg-black text-white px-6">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 scale-105 overflow-hidden">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          poster="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1920"
          className="w-full h-full object-cover opacity-40 contrast-125"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-circuit-board-details-moving-145-large.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent"></div>
        {/* Subtle Scan Overlay */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
      </div>

      <div className="relative z-10 text-center max-w-6xl w-full">
        <div className="flex flex-col items-center justify-center mb-10 animate-fade-in">
           {isLumiAscend ? (
             <div 
               className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-yellow-400/20 to-amber-500/20 border border-yellow-400/40 rounded-full mb-6 backdrop-blur-xl animate-pulse cursor-pointer group"
               onClick={onOpenMembership}
             >
               <Crown size={14} className="text-yellow-400 fill-yellow-400/20" />
               <span className="text-yellow-400 text-[10px] font-black tracking-[0.4em] uppercase">Lumi Ascend Tier Active</span>
             </div>
           ) : (
             <div 
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600/10 border border-indigo-500/20 rounded-full mb-6 backdrop-blur-xl hover:bg-indigo-600/20 transition-all cursor-pointer group"
              onClick={onOpenMembership}
             >
               <Crown size={14} className="text-indigo-400 group-hover:scale-110 transition-transform" />
               <span className="text-indigo-300 text-[10px] font-black tracking-[0.4em] uppercase">Join the Ascended Tier</span>
             </div>
           )}
           
           <div className="flex items-center justify-center gap-4">
             <span className="w-16 h-[1.5px] bg-gradient-to-r from-transparent to-indigo-500"></span>
             <div className="flex items-center gap-2 px-4 py-2 bg-indigo-600/10 border border-indigo-500/20 rounded-full">
               <Zap size={14} className="text-indigo-400 fill-indigo-400/20" />
               <span className="text-indigo-300 text-[10px] font-black tracking-[0.4em] uppercase">Ecosystem Live</span>
             </div>
             <span className="w-16 h-[1.5px] bg-gradient-to-l from-transparent to-indigo-500"></span>
           </div>
        </div>
        
        <h1 className="text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] xl:text-[12rem] font-black mb-6 md:mb-10 tracking-tighter leading-[0.82] animate-slide-up italic uppercase group">
          <span className="group-hover:glitch transition-all">FUTURE</span> <br /> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-white to-purple-400 drop-shadow-[0_0_30px_rgba(255,255,255,0.3)] group-hover:glitch transition-all">
            CURATED.
          </span>
        </h1>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 mb-12 animate-fade-in">
          <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-xs">
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-2">The Standard</span>
            <p className="text-sm text-slate-400 font-medium leading-relaxed">
              Nexota Store: Engineered for the elite. Every unit is hand-selected and verified by the Nexus Governance.
            </p>
          </div>
          <div className="w-px h-12 bg-white/10 hidden md:block"></div>
          <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-xs">
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-2">Uganda's Premier Store</span>
            <p className="text-sm text-slate-400 font-medium leading-relaxed">
              The best online store in Uganda, offering a curated selection of premium high-tech gadgets and gear.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-10 px-4 mb-16">
          <button 
            onClick={onShopNow}
            className="w-full sm:w-auto group px-8 md:px-14 py-5 md:py-7 bg-white text-black rounded-[20px] md:rounded-[24px] font-black text-lg md:text-xl hover:bg-slate-100 transition-all shadow-[0_30px_60px_rgba(255,255,255,0.2)] active:scale-95 flex items-center justify-center gap-3 hover:neon-glow"
          >
            Explore Stack
            <ChevronRight size={24} className="group-hover:translate-x-2 transition-transform" />
          </button>
          <button 
            onClick={onLaunchLabs}
            className="w-full sm:w-auto group px-8 md:px-14 py-5 md:py-7 bg-white/5 border border-white/20 rounded-[20px] md:rounded-[24px] font-black text-lg md:text-xl hover:bg-white/10 transition-all backdrop-blur-2xl flex items-center justify-center gap-4 border-dashed"
          >
            <FlaskConical size={28} className="text-indigo-400 group-hover:rotate-12 transition-transform" />
            Nexota Labs
          </button>
        </div>

        {/* Sliding Banners */}
        <div className="relative w-full overflow-hidden py-4 select-none">
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent z-10"></div>
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent z-10"></div>
          
          <motion.div 
            className="flex gap-8 whitespace-nowrap"
            animate={{ x: [0, -1920] }}
            transition={{ 
              duration: 40, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          >
            {[...bannerProducts, ...bannerProducts, ...bannerProducts].map((product, idx) => (
              <div 
                key={`${product.id}-${idx}`}
                className="inline-flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 px-6 py-3 rounded-2xl group cursor-pointer hover:bg-white/10 transition-all"
              >
                <img 
                  src={product.image.includes('unsplash.com') ? `${product.image}&w=200` : product.image} 
                  alt={product.name} 
                  loading="lazy"
                  className="w-12 h-12 rounded-lg object-cover grayscale group-hover:grayscale-0 transition-all"
                  referrerPolicy="no-referrer"
                />
                <div className="text-left">
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{product.category}</p>
                  <p className="text-sm font-bold text-white/80 group-hover:text-white transition-colors">{product.name}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-slate-500/50">
        <span className="text-[9px] font-black uppercase tracking-[0.8em] mr-[-0.8em]">Interface Scroll</span>
        <div className="w-[1.5px] h-12 bg-gradient-to-b from-indigo-500 to-transparent"></div>
      </div>
    </section>
  );
};

export default Hero;
