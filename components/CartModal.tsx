
import React, { useState, useEffect } from 'react';
import { X, Minus, Plus, ShoppingBag, Truck, ShieldCheck, CheckCircle2, ChevronRight, AlertCircle, MapPin, Phone, Home, Globe } from 'lucide-react';
import { CartItem, User, ShippingAddress } from '../types';
import { createOrder, fetchShippingRates } from '../services/firebase';
import { useCurrency } from '../src/context/CurrencyContext';

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
  const { formatPrice } = useCurrency();
  const [step, setStep] = useState<'cart' | 'shipping' | 'payment' | 'success'>('cart');
  const [orderComplete, setOrderComplete] = useState<string | null>(null);
  const [shippingRates, setShippingRates] = useState<Record<string, number>>({});
  const [shippingCost, setShippingCost] = useState(0);
  const [shippingInfo, setShippingInfo] = useState<ShippingAddress>({
    fullName: user.name || '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
    phone: ''
  });
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    const loadRates = async () => {
      const rates = await fetchShippingRates();
      setShippingRates(rates);
    };
    if (isOpen) loadRates();
  }, [isOpen]);

  useEffect(() => {
    if (shippingInfo.city) {
      const city = shippingInfo.city.trim().toLowerCase();
      const matchingDistrict = Object.keys(shippingRates).find(
        d => d.toLowerCase() === city
      );
      if (matchingDistrict) {
        setShippingCost(shippingRates[matchingDistrict]);
      } else {
        setShippingCost(0);
      }
    } else {
      setShippingCost(0);
    }
  }, [shippingInfo.city, shippingRates]);

  if (!isOpen) return null;

  const finalTotal = total + shippingCost;

  const handleGetLocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        setShippingInfo(prev => ({ ...prev, lat: latitude, lng: longitude }));
        
        // Reverse geocoding simulation or just setting coordinates
        // In a real app, we'd use Google Maps API here
        setShippingInfo(prev => ({ 
          ...prev, 
          address: `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)} (Detected Location)`,
          city: 'Detected City'
        }));
        setIsLocating(false);
      }, (error) => {
        console.error("Error getting location:", error);
        setIsLocating(false);
        alert("Could not detect location. Please enter manually.");
      });
    } else {
      setIsLocating(false);
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handleCheckout = async () => {
    const profit = items.reduce((sum, item) => sum + ((item.price - item.costPrice) * item.quantity), 0);

    const orderResult = await createOrder({
      userId: user.id,
      customerName: user.name,
      customerEmail: user.email,
      items: items,
      total: finalTotal,
      profit: profit,
      status: 'pending',
      paymentMethod: 'cod',
      paymentStatus: 'pending',
      shippingAddress: shippingInfo,
      shippingCost: shippingCost,
      trackingNumber: `NX-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()
    });

    if (orderResult) {
      setOrderComplete(orderResult.id);
      setStep('success');
      setTimeout(() => {
        onClearCart();
        setStep('cart');
        setOrderComplete(null);
        onClose();
      }, 6000);
    }
  };

  const handleClose = () => {
    if (step === 'payment') {
      setStep('shipping');
    } else if (step === 'shipping') {
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
              {step === 'shipping' ? 'Shipping' : step === 'payment' ? 'Checkout' : step === 'success' ? 'Confirmed' : 'Your Cart'}
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
                <h3 className="text-3xl font-black text-slate-900">Order Placed</h3>
                <p className="text-slate-500 text-sm px-8">Your order <span className="text-indigo-600 font-bold">#{orderComplete?.slice(-6).toUpperCase()}</span> has been received. Please have the cash ready upon delivery.</p>
              </div>
              <div className="w-full bg-slate-50 p-6 rounded-3xl space-y-3">
                 <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                   <span>Payment Method</span>
                   <span className="text-slate-900">Cash on Delivery</span>
                 </div>
                 <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                   <span>Amount Due</span>
                   <span className="text-slate-900 font-black">{formatPrice(finalTotal)}</span>
                 </div>
                 <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                   <span>Est. Delivery</span>
                   <span className="text-indigo-600 font-black">{new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                 </div>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Track your order in the Account section</p>
            </div>
          ) : step === 'shipping' ? (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Delivery Details</h3>
                <button 
                  onClick={handleGetLocation}
                  disabled={isLocating}
                  className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-2 rounded-xl hover:bg-indigo-100 transition-all"
                >
                  <MapPin size={14} />
                  {isLocating ? 'Locating...' : 'Google Pin'}
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <CheckCircle2 size={18} />
                    </div>
                    <input 
                      type="text" 
                      value={shippingInfo.fullName}
                      onChange={(e) => setShippingInfo({...shippingInfo, fullName: e.target.value})}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-bold"
                      placeholder="Recipient Name"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Street Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <Home size={18} />
                    </div>
                    <input 
                      type="text" 
                      value={shippingInfo.address}
                      onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-bold"
                      placeholder="123 Future Lane"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">City / District</label>
                    <input 
                      type="text" 
                      value={shippingInfo.city}
                      onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-bold"
                      placeholder="e.g. Kampala"
                    />
                    {shippingCost > 0 && (
                      <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1 ml-1">
                        District Rate Applied: {formatPrice(shippingCost)}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Postal Code</label>
                    <input 
                      type="text" 
                      value={shippingInfo.postalCode}
                      onChange={(e) => setShippingInfo({...shippingInfo, postalCode: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-bold"
                      placeholder="10101"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Country</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <Globe size={18} />
                    </div>
                    <input 
                      type="text" 
                      value={shippingInfo.country}
                      onChange={(e) => setShippingInfo({...shippingInfo, country: e.target.value})}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-bold"
                      placeholder="United Tech Federation"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <Phone size={18} />
                    </div>
                    <input 
                      type="tel" 
                      value={shippingInfo.phone}
                      onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-bold"
                      placeholder="+1 234 567 890"
                    />
                  </div>
                </div>
              </div>

              <button 
                onClick={() => {
                  if (!shippingInfo.address || !shippingInfo.city || !shippingInfo.phone) {
                    alert("Please fill in all required fields.");
                    return;
                  }
                  setStep('payment');
                }}
                className="w-full bg-slate-900 text-white h-16 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl"
              >
                Continue to Payment
                <ChevronRight size={20} />
              </button>
            </div>
          ) : step === 'payment' ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-8 animate-fade-in">
              <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center">
                <Truck size={40} />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-black text-slate-900">Confirm COD Order</h3>
                <p className="text-slate-500 text-sm">You are about to place an order using <span className="font-bold text-slate-900">Cash on Delivery</span>. Our courier will collect the payment when the package arrives.</p>
              </div>

              <div className="w-full bg-slate-50 p-6 rounded-3xl text-left space-y-3">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Shipping to:</h4>
                <p className="text-sm font-bold text-slate-900">{shippingInfo.fullName}</p>
                <p className="text-xs text-slate-500">{shippingInfo.address}, {shippingInfo.city}</p>
                <p className="text-xs text-slate-500">{shippingInfo.phone}</p>
                {shippingCost > 0 && (
                  <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                    <span className="text-[10px] font-black text-slate-400 uppercase">District Fee</span>
                    <span className="text-xs font-black text-emerald-600">+{formatPrice(shippingCost)}</span>
                  </div>
                )}
              </div>
              
              <div className="w-full space-y-4">
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-slate-900 text-white h-16 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl"
                >
                  Place Order — {formatPrice(finalTotal)}
                </button>
                <button 
                  onClick={() => setStep('shipping')}
                  className="w-full text-slate-400 font-bold text-sm hover:text-slate-600 transition-colors"
                >
                  Edit Shipping Info
                </button>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-3 text-left">
                <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[10px] text-amber-800 font-medium leading-relaxed">
                  Please ensure someone is available at the delivery address to provide the exact amount. Orders cannot be released without payment.
                </p>
              </div>
            </div>
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
                    <p className="text-indigo-600 font-black text-sm my-1">{formatPrice(item.price)}</p>
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
                <span className="font-bold text-slate-900">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-2xl font-black text-slate-900 pt-3 mt-3 border-t border-slate-200">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
            
            <button 
              onClick={() => {
                if (!user.isLoggedIn) {
                  alert("Please sign in to checkout.");
                  return;
                }
                setStep('shipping');
              }}
              className="w-full bg-slate-900 text-white h-16 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-slate-800 transition-all active:scale-[0.98] shadow-xl text-lg group"
            >
              Checkout (Cash on Delivery)
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="flex flex-col items-center gap-4 py-2">
               <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                 <Truck size={14} className="text-indigo-500" />
                 Global Logistics Network
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;
