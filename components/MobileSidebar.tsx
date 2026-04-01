import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, User as UserIcon, Globe, MapPin, Layers, 
  Tag, Settings, LogOut, ChevronRight, 
  ShieldCheck, Briefcase, Languages, Zap, Palette, Sparkles
} from 'lucide-react';
import { User } from '../types';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onLogout: () => void;
  onNavigate: (view: any) => void;
  categories: string[];
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({ 
  isOpen, 
  onClose, 
  user, 
  onLogout, 
  onNavigate,
  categories
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[300] md:hidden"
          />

          {/* Sidebar Content */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-[85%] max-w-xs bg-white z-[301] md:hidden shadow-2xl flex flex-col"
          >
            {/* Header / User Profile */}
            <div className="p-6 bg-slate-900 text-white">
              <div className="flex justify-between items-start mb-6">
                <div className={`w-16 h-16 ${user.isLumiAscend ? 'bg-indigo-600 shadow-[0_0_20px_rgba(79,70,229,0.4)]' : 'bg-slate-700'} rounded-2xl flex items-center justify-center text-2xl font-black`}>
                  {(user.name || 'U').charAt(0)}
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight">{user.name || 'Guest Citizen'}</h3>
                <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
                  {user.isLumiAscend ? <ShieldCheck size={12} /> : null}
                  {user.isLumiAscend ? 'Ascended Member' : 'Standard Citizen'}
                </p>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-grow overflow-y-auto no-scrollbar p-6 space-y-8">
              {/* Professional Info Section */}
              <section>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Professional Identity</h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 border border-slate-100">
                      <Briefcase size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Department</p>
                      <p className="text-sm font-bold text-slate-900">{user.department || (user.role === 'admin' ? 'Nexus Governance' : user.role === 'seller' ? 'Merchant Guild' : 'Consumer Sector')}</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Discovery Section */}
              <section>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Ecosystem Discovery</h4>
                <div className="space-y-2">
                  <button 
                    onClick={() => { onNavigate('home'); onClose(); }}
                    className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <Layers size={18} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
                      <span className="text-sm font-bold text-slate-700">All Categories</span>
                    </div>
                    <ChevronRight size={16} className="text-slate-300" />
                  </button>
                  <div className="pl-12 space-y-2">
                    {categories.slice(1, 5).map(cat => (
                      <button 
                        key={cat}
                        onClick={() => { onNavigate(cat); onClose(); }}
                        className="block text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors py-1"
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              {/* Product Sectors */}
              <section>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Product Sectors</h4>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => { onNavigate('home'); onClose(); }} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-2 group hover:border-indigo-200 transition-all">
                    <Zap size={16} className="text-indigo-600" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Tech</span>
                  </button>
                  <button onClick={() => { onNavigate('art'); onClose(); }} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-2 group hover:border-indigo-200 transition-all">
                    <Sparkles size={16} className="text-indigo-600" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Digital Art</span>
                  </button>
                </div>
              </section>

              {/* Nexota Services */}
              <section>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Nexota Services</h4>
                <div className="space-y-2">
                  {[
                    { icon: ShieldCheck, label: 'Nexota Protection', desc: 'Extended warranty', view: 'nexota-protection' },
                    { icon: Globe, label: 'Global Logistics', desc: 'Real-time tracking', view: 'global-logistics' },
                    { icon: Tag, label: 'Merchant Guild', desc: 'Seller resources', view: 'seller' }
                  ].map((item, i) => (
                    <button 
                      key={i} 
                      onClick={() => { onNavigate(item.view); onClose(); }}
                      className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-colors text-left group"
                    >
                      <item.icon size={18} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
                      <div>
                        <p className="text-sm font-bold text-slate-700">{item.label}</p>
                        <p className="text-[9px] font-medium text-slate-400 uppercase tracking-widest">{item.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              {/* Preferences Section */}
              <section>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Global Preferences</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-slate-100">
                        <span className="text-xs font-black">EN</span>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Language</p>
                        <p className="text-sm font-bold text-slate-900">English (UK)</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => { onNavigate('language-settings'); onClose(); }}
                      className="text-[10px] font-black text-indigo-600 uppercase tracking-widest px-3 py-1 bg-white rounded-lg border border-slate-100 shadow-sm"
                    >
                      Change
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-slate-100 overflow-hidden">
                         <img src="https://flagcdn.com/w40/gb.png" alt="UK" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Market Region</p>
                        <p className="text-sm font-bold text-slate-900">United Kingdom</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => { onNavigate('region-settings'); onClose(); }}
                      className="text-[10px] font-black text-indigo-600 uppercase tracking-widest px-3 py-1 bg-white rounded-lg border border-slate-100 shadow-sm"
                    >
                      Change
                    </button>
                  </div>
                </div>
              </section>
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-slate-100">
              {user.isLoggedIn ? (
                <button 
                  onClick={() => { onLogout(); onClose(); }}
                  className="w-full flex items-center justify-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-red-100 transition-colors"
                >
                  <LogOut size={16} /> Terminate Session
                </button>
              ) : (
                <button 
                  onClick={() => { onNavigate('home'); onClose(); }}
                  className="w-full p-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-indigo-600 transition-colors"
                >
                  Initialize Connection
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileSidebar;
