import React, { useState, useRef, useEffect } from 'react';
import { Search, ShoppingCart, LogOut, Heart, User as UserIcon, ArrowLeft, UserCircle, Settings, ShieldCheck, Crown, ChevronDown, Package, Zap } from 'lucide-react';
import { User } from '../types';
import { PRODUCTS } from '../constants';
import Logo from './Logo';

interface HeaderProps {
  currentView: string;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenLogin: () => void;
  onOpenWishlist: () => void;
  onOpenAdmin: () => void;
  onOpenSeller: () => void;
  onOpenExperience: () => void;
  onGoHome: () => void;
  onBack?: () => void;
  onOpenAccount: () => void;
  user: User;
  onLogout: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isCartPulsing?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  currentView,
  cartCount, 
  wishlistCount,
  onOpenCart, 
  onOpenLogin, 
  onOpenWishlist,
  onOpenAdmin,
  onOpenSeller,
  onGoHome, 
  onBack,
  onOpenAccount,
  user, 
  onLogout,
  searchQuery,
  setSearchQuery,
  isCartPulsing = false
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showUserPanel, setShowUserPanel] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const userPanelRef = useRef<HTMLDivElement>(null);

  const categories = Array.from(new Set(PRODUCTS.map(p => p.category)));
  
  const productSuggestions = searchQuery.trim().length >= 2 
    ? PRODUCTS.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 4)
    : [];

  const categorySuggestions = searchQuery.trim().length >= 2
    ? categories.filter(c => 
        c.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 3)
    : [];

  const trendingProducts = PRODUCTS.slice(0, 3);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
      if (userPanelRef.current && !userPanelRef.current.contains(event.target as Node)) {
        setShowUserPanel(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 right-0 left-0 md:left-20 lg:left-64 z-[150] bg-white/80 backdrop-blur-2xl border-b border-slate-100 transition-all duration-500">
      <div className="max-w-[1600px] mx-auto flex items-center h-16 lg:h-20 px-4 lg:px-8 justify-between gap-6">
        <div className="flex items-center gap-4">
          {currentView !== 'home' && (
            <button 
              onClick={onBack || onGoHome}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all active:scale-90 flex items-center justify-center group"
              aria-label="Go Back"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
            </button>
          )}
          <div onClick={onGoHome} className="cursor-pointer group shrink-0">
            <Logo showText={false} />
          </div>
        </div>

        <div className="flex-grow max-w-[600px] hidden md:block relative" ref={searchRef}>
          <div className="flex items-center bg-slate-100/50 border border-slate-200 rounded-2xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:bg-white focus-within:border-white transition-all shadow-sm">
            <Search size={18} className="text-slate-400 mr-3" />
            <input 
              type="text" 
              value={searchQuery}
              onFocus={() => setShowSuggestions(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              placeholder="Search trending tech..." 
              className="flex-grow bg-transparent text-sm text-slate-900 font-medium outline-none placeholder:text-slate-400"
            />
          </div>

          {showSuggestions && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-slide-up z-[200] max-h-[80vh] overflow-y-auto">
              {searchQuery.trim().length < 2 ? (
                <div className="p-6 space-y-8">
                  <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Zap size={12} className="text-indigo-500" /> Trending Now
                    </h4>
                    <div className="grid grid-cols-1 gap-3">
                      {trendingProducts.map(p => (
                        <button
                          key={p.id}
                          onClick={() => {
                            setSearchQuery(p.name);
                            setShowSuggestions(false);
                            onGoHome();
                          }}
                          className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-2xl transition-all text-left group"
                        >
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 leading-tight">{p.name}</p>
                            <p className="text-[10px] text-indigo-600 font-black uppercase tracking-widest mt-0.5">${p.price}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Browse Categories</h4>
                    <div className="flex flex-wrap gap-2">
                      {categories.slice(0, 6).map(cat => (
                        <button
                          key={cat}
                          onClick={() => {
                            setSearchQuery(cat);
                            setShowSuggestions(false);
                            onGoHome();
                          }}
                          className="px-4 py-2 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-2">
                  {categorySuggestions.length > 0 && (
                    <div className="mb-2">
                      <h4 className="px-4 py-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">Categories</h4>
                      {categorySuggestions.map(cat => (
                        <button
                          key={cat}
                          onClick={() => {
                            setSearchQuery(cat);
                            setShowSuggestions(false);
                            onGoHome();
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 rounded-xl transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                            <Package size={14} />
                          </div>
                          <span className="text-sm font-bold text-slate-700">{cat}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {productSuggestions.length > 0 && (
                    <div>
                      <h4 className="px-4 py-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">Products</h4>
                      {productSuggestions.map(p => (
                        <button
                          key={p.id}
                          onClick={() => {
                            setSearchQuery(p.name);
                            setShowSuggestions(false);
                            onGoHome();
                          }}
                          className="w-full flex items-center gap-4 px-4 py-3 hover:bg-slate-50 rounded-xl transition-all text-left group"
                        >
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                          </div>
                          <div className="flex-grow">
                            <p className="text-sm font-bold text-slate-900 leading-tight">{p.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{p.category}</p>
                          </div>
                          <p className="text-xs font-black text-indigo-600">${p.price}</p>
                        </button>
                      ))}
                    </div>
                  )}

                  {productSuggestions.length === 0 && categorySuggestions.length === 0 && (
                    <div className="p-8 text-center">
                      <p className="text-sm text-slate-400 font-medium italic">No matches found for "{searchQuery}"</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 lg:gap-4">
          <button 
            onClick={onOpenCart} 
            className={`flex items-center justify-center w-12 h-12 rounded-2xl transition-all relative group ${
              isCartPulsing ? 'bg-indigo-600 scale-110 shadow-indigo-500/50' : 'bg-slate-50 hover:bg-slate-100'
            }`}
          >
            <ShoppingCart size={22} className={`transition-colors ${isCartPulsing ? 'text-white' : 'text-slate-600 group-hover:text-indigo-600'}`} />
            {cartCount > 0 && (
              <span className={`absolute -top-1 -right-1 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white transition-all ${isCartPulsing ? 'bg-emerald-500 scale-125' : 'bg-indigo-600'}`}>
                {cartCount}
              </span>
            )}
          </button>

          <div className="relative" ref={userPanelRef}>
            <div 
              onClick={() => user.isLoggedIn ? setShowUserPanel(!showUserPanel) : onOpenLogin()}
              className="flex items-center gap-2 lg:gap-3 bg-slate-900 text-white pl-3 lg:pl-4 pr-1.5 py-1.5 rounded-2xl cursor-pointer hover:bg-slate-800 transition-all group relative"
            >
              <div className="flex flex-col items-end leading-none hidden sm:flex">
                <span className="text-[8px] text-slate-400 font-black uppercase tracking-widest mb-0.5">User</span>
                <span className="text-[11px] font-black truncate max-w-[60px] lg:max-w-[100px]">
                  {user.isLoggedIn ? user.name.split(' ')[0] : 'Connect'}
                </span>
              </div>
              <div className="w-8 h-8 lg:w-9 lg:h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform overflow-hidden text-white font-black text-xs lg:text-sm">
                 {user.isLoggedIn ? user.name.charAt(0) : <UserIcon size={16} />}
              </div>
              {user.isLoggedIn && <ChevronDown size={14} className={`text-slate-500 transition-transform ${showUserPanel ? 'rotate-180' : ''}`} />}
            </div>

            {showUserPanel && user.isLoggedIn && (
              <div className="absolute top-full right-0 mt-3 w-64 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-slide-up z-[200]">
                <div className="p-6 bg-slate-50 border-b border-slate-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 ${user.isLumiAscend ? 'bg-indigo-600' : 'bg-slate-900'} text-white rounded-2xl flex items-center justify-center font-black text-xl`}>
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 text-sm truncate max-w-[140px]">{user.name}</h4>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {user.isLumiAscend ? (
                          <span className="flex items-center gap-1 text-[9px] font-black text-yellow-600 uppercase tracking-widest">
                            <Crown size={10} /> Ascended
                          </span>
                        ) : (
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Citizen</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span>Level {user.level}</span>
                    <span className="text-indigo-600">{user.points} XP</span>
                  </div>
                  <div className="h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-indigo-600" style={{ width: `${(user.points % 1000) / 10}%` }}></div>
                  </div>
                </div>
                <div className="p-2">
                  <button onClick={() => { onOpenAccount(); setShowUserPanel(false); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 rounded-xl transition-colors text-slate-700 font-bold text-sm">
                    <UserCircle size={18} className="text-slate-400" /> My Profile
                  </button>
                  <button onClick={() => { onOpenSeller(); setShowUserPanel(false); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 rounded-xl transition-colors text-slate-700 font-bold text-sm">
                    <ShieldCheck size={18} className="text-slate-400" /> Seller Hub
                  </button>
                  <button onClick={() => { onOpenAdmin(); setShowUserPanel(false); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 rounded-xl transition-colors text-slate-700 font-bold text-sm">
                    <Settings size={18} className="text-slate-400" /> Admin Hub
                  </button>
                  <div className="h-[1px] bg-slate-100 my-2 mx-2"></div>
                  <button onClick={() => { onLogout(); setShowUserPanel(false); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 rounded-xl transition-colors text-red-600 font-bold text-sm">
                    <LogOut size={18} /> Disconnect
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
