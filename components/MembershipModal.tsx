
import React from 'react';
import { X, Crown, Zap, Gem, CheckCircle2, ChevronRight, Star, ArrowLeft } from 'lucide-react';
import { useCurrency } from '../src/context/CurrencyContext';

interface MembershipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

const MembershipModal: React.FC<MembershipModalProps> = ({ isOpen, onClose, onUpgrade }) => {
  const { formatPrice } = useCurrency();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-slate-950 rounded-[32px] md:rounded-[48px] shadow-[0_50px_100px_rgba(0,0,0,0.5)] border border-white/10 overflow-y-auto animate-slide-up scrollbar-hide">
        {/* Hero Section */}
        <div className="h-48 md:h-64 relative flex items-center justify-center p-6 md:p-8 overflow-hidden shrink-0">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/40 via-purple-600/40 to-slate-900/40"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
          
          {/* Decorative Sparks */}
          <div className="absolute top-10 left-10 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
          <div className="absolute bottom-12 right-20 w-3 h-3 bg-indigo-400 rounded-full animate-pulse"></div>

          <div className="relative z-10 text-center space-y-4">
             <div className="w-20 h-20 bg-gradient-to-tr from-yellow-400 to-amber-500 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-yellow-500/30">
                <Crown size={40} className="text-slate-900" />
             </div>
             <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">LUMI ASCEND</h2>
             <p className="text-indigo-200 text-xs font-black uppercase tracking-[0.4em]">The Elite Neural Tier</p>
          </div>
        </div>

        <div className="p-6 md:p-12 space-y-8 md:space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="p-5 md:p-6 bg-white/5 border border-white/10 rounded-[24px] md:rounded-[32px] space-y-2 md:space-y-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-500/20 text-indigo-400 rounded-xl md:rounded-2xl flex items-center justify-center">
                 <Zap size={18} />
              </div>
              <h4 className="font-black text-xs md:text-sm text-white uppercase tracking-tighter">2X Neural Growth</h4>
              <p className="text-[10px] md:text-xs text-slate-500 font-medium">Earn double Experience Points (XP) on every transaction and platform action.</p>
            </div>
            
            <div className="p-5 md:p-6 bg-white/5 border border-white/10 rounded-[24px] md:rounded-[32px] space-y-2 md:space-y-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-500/20 text-purple-400 rounded-xl md:rounded-2xl flex items-center justify-center">
                 <Gem size={18} />
              </div>
              <h4 className="font-black text-xs md:text-sm text-white uppercase tracking-tighter">Exclusive Assets</h4>
              <p className="text-[10px] md:text-xs text-slate-500 font-medium">Early access and reserved stock for limited-edition high-performance hardware.</p>
            </div>

            <div className="p-5 md:p-6 bg-white/5 border border-white/10 rounded-[24px] md:rounded-[32px] space-y-2 md:space-y-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-emerald-500/20 text-emerald-400 rounded-xl md:rounded-2xl flex items-center justify-center">
                 <Star size={18} />
              </div>
              <h4 className="font-black text-xs md:text-sm text-white uppercase tracking-tighter">Ascend Rewards</h4>
              <p className="text-[10px] md:text-xs text-slate-500 font-medium">Redeem points for premium shipping upgrades and exclusive Nexbuy brand merchandise.</p>
            </div>

            <div className="p-5 md:p-6 bg-white/5 border border-white/10 rounded-[24px] md:rounded-[32px] space-y-2 md:space-y-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-500/20 text-blue-400 rounded-xl md:rounded-2xl flex items-center justify-center">
                 <CheckCircle2 size={18} />
              </div>
              <h4 className="font-black text-xs md:text-sm text-white uppercase tracking-tighter">Priority Logic</h4>
              <p className="text-[10px] md:text-xs text-slate-500 font-medium">Your tickets and orders are prioritized in our global logistics and support queues.</p>
            </div>
          </div>

          <div className="pt-4 md:pt-6 space-y-3 md:space-y-4">
            <button 
              onClick={onUpgrade}
              className="w-full h-16 md:h-20 bg-white text-slate-900 rounded-[24px] md:rounded-[32px] font-black text-lg md:text-xl hover:bg-yellow-400 transition-all active:scale-95 shadow-2xl flex items-center justify-center gap-3 md:gap-4 group"
            >
              Pay to Join — $19.99
              <ChevronRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </button>
            <button 
              onClick={onClose}
              className="w-full h-12 md:h-14 bg-white/5 text-white/60 rounded-[20px] md:rounded-[24px] font-black text-[10px] md:text-xs uppercase tracking-[0.3em] hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft size={14} /> Return to Interface
            </button>
            <p className="text-center text-[9px] md:text-[10px] text-slate-500 font-black uppercase tracking-widest mt-4 md:mt-6">Secure Transaction • Instant Activation</p>
          </div>
        </div>

        <button onClick={onClose} className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors">
          <X size={24} />
        </button>
      </div>
    </div>
  );
};

export default MembershipModal;
