import React from 'react';
import { Home, Heart, Settings, User as UserIcon, LogOut, Store, ShieldCheck, FlaskConical } from 'lucide-react';
import { User } from '../types';
import Logo from './Logo';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: any) => void;
  user: User;
  isAdmin: boolean;
  onLogout: () => void;
  onOpenLogin: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, user, isAdmin, onLogout, onOpenLogin }) => {
  const NavItem = ({ icon: Icon, label, view, active, badge }: any) => (
    <button
      onClick={() => onNavigate(view)}
      className={`group relative w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 ${
        active 
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
        : 'text-slate-400 hover:bg-white/5 hover:text-white'
      }`}
    >
      <Icon size={22} className={`${active ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'}`} />
      <span className="text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 absolute left-16 bg-slate-900 px-3 py-1.5 rounded-lg whitespace-nowrap pointer-events-none lg:static lg:opacity-100 lg:bg-transparent lg:p-0">
        {label}
      </span>
      {badge && (
        <span className="absolute top-3 right-3 w-2 h-2 bg-indigo-400 rounded-full animate-ping"></span>
      )}
    </button>
  );

  return (
    <aside className="hidden md:flex flex-col w-20 lg:w-64 h-screen sticky top-0 bg-slate-950 border-r border-white/5 p-4 z-[160] transition-all duration-500 group overflow-hidden">
      <div className="flex items-center gap-4 mb-10 px-2 overflow-hidden cursor-pointer" onClick={() => onNavigate('home')}>
        <Logo light showText={false} className="lg:hidden" />
        <Logo light className="hidden lg:flex" />
      </div>

      <nav className="flex-grow space-y-2 overflow-y-auto no-scrollbar">
        <NavItem icon={Home} label="Storefront" view="home" active={currentView === 'home'} />
        <NavItem icon={FlaskConical} label="Nexbuy Labs" view="experience" active={currentView === 'experience'} badge />
        <NavItem icon={Heart} label="Wishlist" view="wishlist" active={currentView === 'wishlist'} />
        
        <div className="pt-6 pb-2">
          <div className="h-[1px] bg-white/5 mx-2 mb-6"></div>
          <p className="hidden lg:block text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] px-4 mb-4">Dashboards</p>
        </div>

        <NavItem icon={Store} label="Sellers Portal" view="seller" active={currentView === 'seller'} />
        {isAdmin && (
          <NavItem icon={ShieldCheck} label="Admin Hub" view="admin" active={currentView === 'admin'} />
        )}

        <div className="pt-6 pb-2">
          <div className="h-[1px] bg-white/5 mx-2 mb-6"></div>
          <p className="hidden lg:block text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] px-4 mb-4">Account</p>
        </div>

        <NavItem icon={UserIcon} label="Profile" view="account" active={currentView === 'account'} />
        <NavItem icon={Settings} label="Settings" view="settings" active={currentView === 'settings'} />
      </nav>

      {user.isLoggedIn ? (
        <div className="mt-auto pt-6 border-t border-white/5">
          <div className="bg-white/5 rounded-2xl p-3 lg:p-4 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer" onClick={() => onNavigate('account')}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${user.isLumiAscend ? 'bg-indigo-600' : 'bg-slate-700'} text-white rounded-xl flex items-center justify-center font-black text-sm shrink-0`}>
                {user.name.charAt(0)}
              </div>
              <div className="hidden lg:block overflow-hidden">
                <p className="text-xs font-black text-white truncate">{user.name}</p>
                <p className="text-[9px] text-indigo-400 font-bold uppercase tracking-widest mt-0.5">
                  {user.isLumiAscend ? 'Ascended' : 'Citizen'}
                </p>
              </div>
            </div>
          </div>
          <button onClick={onLogout} className="hidden lg:flex items-center gap-3 w-full mt-4 px-4 py-3 text-red-500 hover:text-red-400 transition-colors font-black uppercase text-[10px] tracking-widest">
            <LogOut size={16} /> Logout
          </button>
        </div>
      ) : (
        <div className="mt-auto pt-6 border-t border-white/5">
          <button onClick={onOpenLogin} className="w-full bg-white/5 hover:bg-white/10 text-white rounded-2xl py-4 font-black uppercase text-[10px] tracking-widest transition-all">
            Connect
          </button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;