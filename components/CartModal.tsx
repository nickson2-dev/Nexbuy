
import React, { useState } from 'react';
import { X, Minus, Plus, ShoppingBag, CreditCard, ShieldCheck, CheckCircle2, ChevronRight } from 'lucide-react';
import { CartItem, User } from '../types';
import { createOrder } from '../services/firebase';
import StripePaymentForm from './StripePaymentForm';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  total: number;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  user: User;
  onClearCart: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ 
  isOpen, 
  onClose, 
  items, 
  total, 
  onUpdateQuantity, 
  onRemove,
  user,
  onClearCart
}) => {
  const [step, setStep] = useState<'cart' | 'payment' | 'success'>('cart');
  const [orderComplete, setOrderComplete] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleStripeSuccess = async (paymentDetails: any) => {
    const profit = items.reduce((sum, item) => sum + ((item.price - item.costPrice) * item.quantity), 0);

    const orderResult = await createOrder({
      userId: user.id,
      customerName: user.name,
      customerEmail: user.email,
      items: items,
      total: total,
      profit: profit,
      status: 'pending',
      paymentMethod: 'stripe',
      paymentStatus: 'paid'
    });

    if (orderResult) {
      setOrderComplete(orderResult.id);
      setStep('success');
      setTimeout(() => {
        onClearCart();
        setStep('cart');
        setOrderComplete(null);
        onClose();
      }, 4000);
    }
  };

  const handleClose = () => {
    if (step === 'payment') {
      setStep('cart');
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[200] overflow-hidden">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
      
      <div className="absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-left">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
              <ShoppingBag className="text-indigo-600" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">
              {step === 'payment' ? 'Checkout' : step === 'success' ? 'Confirmed' : 'Your Cart'}
            </h2>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
            <X size={24} />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6">
          {step === 'success' ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 animate-fade-in">
              <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center stripe-pulse">
                <CheckCircle2 size={56} />
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-black text-slate-900">Payment Successful</h3>
                <p className="text-slate-500 text-sm px-8">Your order <span className="text-indigo-600 font-bold">#{orderComplete?.slice(-6).toUpperCase()}</span> has been confirmed and is being processed.</p>
              </div>
              <div className="w-full bg-slate-50 p-6 rounded-3xl space-y-3">
                 <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                   <span>Payment Method</span>
                   <span className="text-slate-900">Stripe (Visa)</span>
                 </div>
                 <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                   <span>Amount Paid</span>
                   <span className="text-slate-900 font-black">${total.toLocaleString()}</span>
                 </div>
              </div>
            </div>
          ) : step === 'payment' ? (
            <StripePaymentForm 
              amount={total} 
              onSuccess={handleStripeSuccess} 
              onCancel={() => setStep('cart')} 
            />
          ) : items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center">
                <ShoppingBag size={48} />
              </div>
              <p className="font-bold">Your cart is feeling lonely.</p>
              <button onClick={onClose} className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all">Discover Tech</button>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 group">
                  <div className="w-20 h-20 bg-slate-50 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-100">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-slate-900 leading-tight text-sm">{item.name}</h3>
                      <button onClick={() => onRemove(item.id)} className="text-slate-300 hover:text-red-500 transition-colors"><X size={16} /></button>
                    </div>
                    <p className="text-indigo-600 font-black text-sm my-1">${item.price.toLocaleString()}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center bg-slate-50 rounded-lg p-1 border border-slate-100">
                        <button onClick={() => onUpdateQuantity(item.id, -1)} className="p-1 hover:bg-white rounded transition-all"><Minus size={14} /></button>
                        <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                        <button onClick={() => onUpdateQuantity(item.id, 1)} className="p-1 hover:bg-white rounded transition-all"><Plus size={14} /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && step === 'cart' && (
          <div className="p-6 bg-slate-50 border-t border-slate-100 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-slate-500 text-sm">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">${total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-2xl font-black text-slate-900 pt-3 mt-3 border-t border-slate-200">
                <span>Total</span>
                <span>${total.toLocaleString()}</span>
              </div>
            </div>
            
            <button 
              onClick={() => {
                if (!user.isLoggedIn) {
                  alert("Please sign in to checkout.");
                  return;
                }
                setStep('payment');
              }}
              className="w-full bg-slate-900 text-white h-16 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-slate-800 transition-all active:scale-[0.98] shadow-xl text-lg group"
            >
              Checkout via Stripe
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="flex flex-col items-center gap-4 py-2">
               <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                 <ShieldCheck size={14} className="text-indigo-500" />
                 Secure Stripe Infrastructure
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;
