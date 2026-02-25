
import React from 'react';
import { FlaskConical, ChevronRight, Zap, Crown } from 'lucide-react';

interface HeroProps {
  onShopNow: () => void;
  onLaunchLabs: () => void;
  isLumiAscend?: boolean;
  onOpenMembership: () => void;
}

const Hero: React.FC<HeroProps> = ({ onShopNow, onLaunchLabs, isLumiAscend, onOpenMembership }) => {
  return (
    <section className="relative h-[95vh] flex items-center justify-center overflow-hidden bg-black text-white px-6">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 scale-105 overflow-hidden">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="w-full h-full object-cover opacity-50 contrast-125"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-circuit-board-details-moving-145-large.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent"></div>
        {/* Subtle Scan Overlay */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
      </div>

      <div className="relative z-10 text-center max-w-6xl">
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
        
        <h1 className="text-7xl md:text-[11rem] font-black mb-10 tracking-tighter leading-[0.85] animate-slide-up italic uppercase">
          FUTURE <br /> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-white to-purple-400 drop-shadow-2xl">
            CURATED.
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-300 font-light max-w-3xl mx-auto mb-20 animate-fade-in leading-relaxed opacity-80">
          The global destination for high-performance hardware and avant-garde lifestyle tech. Welcome to the Nexbuy interface.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-10">
          <button 
            onClick={onShopNow}
            className="group px-14 py-7 bg-white text-black rounded-[24px] font-black text-xl hover:bg-slate-100 transition-all shadow-[0_30px_60px_rgba(255,255,255,0.2)] active:scale-95 flex items-center gap-3"
          >
            Explore Stack
            <ChevronRight size={24} className="group-hover:translate-x-2 transition-transform" />
          </button>
          <button 
            onClick={onLaunchLabs}
            className="group px-14 py-7 bg-white/5 border border-white/20 rounded-[24px] font-black text-xl hover:bg-white/10 transition-all backdrop-blur-2xl flex items-center gap-4 border-dashed"
          >
            <FlaskConical size={28} className="text-indigo-400 group-hover:rotate-12 transition-transform" />
            Nexbuy Labs
          </button>
        </div>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-5 text-slate-500/50">
        <span className="text-[9px] font-black uppercase tracking-[0.8em] mr-[-0.8em]">Interface Scroll</span>
        <div className="w-[1.5px] h-20 bg-gradient-to-b from-indigo-500 to-transparent"></div>
      </div>
    </section>
  );
};

export default Hero;
