
import React from 'react';
import { ShoppingBag, ArrowRight, CheckCircle2 } from 'lucide-react';

interface CartToastProps {
  name: string;
  show: boolean;
  onOpenCart: () => void;
}

const CartToast: React.FC<CartToastProps> = ({ name, show, onOpenCart }) => {
  if (!show) return null;

  return (
    <div className="fixed bottom-24 right-8 z-[500] animate-slide-up">
      <div className="bg-slate-900 text-white p-4 pr-6 rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.3)] border border-white/10 flex items-center gap-4">
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white">
          <CheckCircle2 size={24} className="animate-pulse" />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase text-indigo-400 tracking-widest leading-none mb-1">Asset Secured</p>
          <p className="text-sm font-bold truncate max-w-[150px]">{name}</p>
        </div>
        <button 
          onClick={onOpenCart}
          className="ml-4 h-12 px-6 bg-white/10 hover:bg-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
        >
          View Cart
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default CartToast;
