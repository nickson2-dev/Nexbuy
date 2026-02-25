
import React, { useState } from 'react';
import { CreditCard, ShieldCheck, Lock, ChevronRight, Info } from 'lucide-react';

interface StripePaymentFormProps {
  amount: number;
  onSuccess: (details: { last4: string; brand: string }) => void;
  onCancel: () => void;
}

const StripePaymentForm: React.FC<StripePaymentFormProps> = ({ amount, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    card: '',
    expiry: '',
    cvc: '',
    zip: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate Stripe API Latency
    setTimeout(() => {
      setLoading(false);
      onSuccess({
        last4: formData.card.slice(-4) || '4242',
        brand: 'Visa'
      });
    }, 2000);
  };

  return (
    <div className="animate-fade-in p-1">
      <div className="mb-8">
        <h3 className="text-xl font-black text-slate-900 mb-2">Payment Details</h3>
        <p className="text-sm text-slate-500">Pay <span className="text-indigo-600 font-bold">${amount.toLocaleString()}</span> securely with Stripe.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Cardholder Name</label>
          <input 
            type="text" 
            required
            placeholder="Jane Doe"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Card Information</label>
          <div className="relative">
            <input 
              type="text" 
              required
              placeholder="1234 5678 1234 5678"
              value={formData.card}
              onChange={e => setFormData({...formData, card: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
               <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4 opacity-50" alt="Visa" />
               <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-4 opacity-50" alt="Mastercard" />
            </div>
          </div>
          <div className="flex gap-4">
            <input 
              type="text" 
              required
              placeholder="MM / YY"
              className="w-1/2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
            <input 
              type="text" 
              required
              placeholder="CVC"
              className="w-1/2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center gap-3 mb-6 p-4 bg-indigo-50/50 rounded-2xl">
             <Info size={16} className="text-indigo-600 shrink-0" />
             <p className="text-[10px] text-indigo-700 font-medium leading-relaxed">
               Your payment information is processed by Stripe and never stored on our servers. Nexbuy uses 256-bit encryption for every transaction.
             </p>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full bg-indigo-600 text-white h-14 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-600/20 ${loading ? 'opacity-70' : ''}`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <Lock size={18} />
                Pay ${amount.toLocaleString()}
              </>
            )}
          </button>
          
          <button 
            type="button"
            onClick={onCancel}
            className="w-full mt-3 text-slate-400 text-xs font-bold py-2 hover:text-slate-600 transition-colors"
          >
            Cancel and Return
          </button>
        </div>

        <div className="flex flex-col items-center gap-2 pt-2">
           <div className="flex items-center gap-2 opacity-30">
              <span className="text-[8px] font-black uppercase tracking-[0.2em]">Powered by</span>
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" className="h-4" alt="Stripe" />
           </div>
           <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-bold uppercase tracking-widest">
              <ShieldCheck size={12} className="text-emerald-500" />
              Secure Checkout
           </div>
        </div>
      </form>
    </div>
  );
};

export default StripePaymentForm;
