
import React from 'react';
import { Home, Search, FlaskConical, Heart, ShoppingBag, User as UserIcon } from 'lucide-react';
import { User } from '../types';

interface MobileNavbarProps {
  currentView: string;
  onNavigate: (view: any) => void;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  cartCount: number;
  user: User;
}

const MobileNavbar: React.FC<MobileNavbarProps> = ({ 
  currentView, 
  onNavigate, 
  onOpenCart, 
  onOpenSearch, 
  cartCount,
  user
}) => {
  const NavItem = ({ icon: Icon, view, active, onClick, count }: any) => (
    <button 
      onClick={onClick || (() => onNavigate(view))}
      className={`relative flex flex-col items-center justify-center w-full h-full transition-all duration-300 ${
        active ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
      }`}
    >
      <Icon size={24} className={`${active ? 'scale-110 drop-shadow-[0_0_8px_rgba(79,70,229,0.3)]' : ''}`} />
      {count !== undefined && count > 0 && (
        <span className="absolute top-2 right-1/2 translate-x-3 bg-indigo-600 text-white text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">
          {count}
        </span>
      )}
      {active && (
        <span className="absolute bottom-1 w-1 h-1 bg-indigo-600 rounded-full"></span>
      )}
    </button>
  );

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full h-16 bg-white/80 backdrop-blur-xl border-t border-slate-100 flex items-center justify-around px-2 z-[160] shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
      <NavItem 
        icon={Home} 
        view="home" 
        active={currentView === 'home'} 
      />
      <NavItem 
        icon={Search} 
        onClick={onOpenSearch} 
        active={false} 
      />
      <NavItem 
        icon={ShoppingBag} 
        onClick={onOpenCart} 
        active={false} 
        count={cartCount}
      />
      <NavItem 
        icon={Heart} 
        view="wishlist" 
        active={currentView === 'wishlist'} 
      />
      <NavItem 
        icon={UserIcon} 
        view="account" 
        active={currentView === 'account'} 
      />
    </nav>
  );
};

export default MobileNavbar;
