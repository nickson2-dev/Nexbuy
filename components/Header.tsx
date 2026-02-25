import React, { useState, useRef, useEffect } from 'react';
import { Search, ShoppingCart, LogOut, Heart, User as UserIcon, ArrowLeft, UserCircle } from 'lucide-react';
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
  const searchRef = useRef<HTMLDivElement>(null);

  const suggestions = searchQuery.trim().length >= 2 ? [
    ...new Set(PRODUCTS.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    ).map(p => ({ type: 'product', value: p.name }))),
    ...new Set(PRODUCTS.filter(p => 
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    ).map(p => ({ type: 'category', value: p.category })))
  ].slice(0, 6) : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-[150] bg-white/80 backdrop-blur-2xl border-b border-slate-100">
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
            <Logo />
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

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-slide-up z-[200]">
              <div className="p-2">
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={`${suggestion.value}-${idx}`}
                    onClick={() => {
                      setSearchQuery(suggestion.value);
                      setShowSuggestions(false);
                      onGoHome();
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 rounded-xl transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <Search size={14} className="text-slate-300 group-hover:text-indigo-500" />
                      <span className="text-sm font-semibold text-slate-700">{suggestion.value}</span>
                    </div>
                  </button>
                ))}
              </div>
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

          <div 
            onClick={user.isLoggedIn ? onOpenAccount : onOpenLogin}
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
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;